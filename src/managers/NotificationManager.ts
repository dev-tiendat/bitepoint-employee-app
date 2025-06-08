import { AppState, AppStateStatus, Platform } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, { Event, EventType } from '@notifee/react-native';
import { Store } from '@reduxjs/toolkit';
import { COLORS, StorageKey } from 'common';
import { isEmpty } from 'lodash';
import { AuthLogin } from 'types/auth';
import StorageUtils from 'utils/StorageUtils';
import {
  DeviceState,
  updateNotificationUpdatedAt,
  updateUnreadNotificationCount,
} from 'store/device/deviceSlice';
import { showToast } from 'components/Toast/ToastContext';
import { UnreadNotification } from 'types/notification';
import APIManager from './APIManager';

const MAX_SYNC_FCM_TOKEN_ATTEMPTS = 3;

const DEFAULT_CHANNEL_ID = 'default';
const DEFAULT_NOTIFICATION_SOUND_NAME = 'default';
const LOCAL_CHANNEL_ID = 'local';
const LOCAL_NOTIFICATION_SOUND_NAME = 'default';

class NotificationManager {
  private _started: boolean;
  private _notifeeInitialized: boolean;
  private _fcmInitialized: boolean;

  private _store?: Store;
  private _user?: AuthLogin;
  private _username?: string;
  private _fcmToken?: string;
  private _currentState?: AppStateStatus;
  private _unreadNotificationCount?: number;

  private _notifeeNotification?: Notification;

  private _tokenRefreshListener?: () => void;
  private _messageListener?: () => void;
  private _fcmNotificationOpenedAppListener?: () => void;

  constructor() {
    this._started = false;
    this._notifeeInitialized = false;
    this._fcmInitialized = false;
  }

  initialize = async () => {
    this._initializeNotifee();
    AppState.addEventListener('change', this._handleAppStateChange);
  };

  start = () => {
    this._started = true;
    this._handleNotifeeNotification();
  };

  initializeFCM = async () => {
    if (!messaging || this._fcmInitialized) {
      return;
    }

    this._fcmInitialized = true;

    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus !== messaging.AuthorizationStatus.AUTHORIZED) {
      return;
    }

    try {
      this._setupFCMRefreshTokenListener();
      this._setupFCMMessageListener();
      this._setupFCMNotificationOpenedAppListener();
      this._fetchInitialFCMNotification();
    } catch (error) {}

    try {
      const token = await messaging().getToken();

      if (__DEV__) console.log('FCM token: ', token);

      this._updateFCMToken(token);
    } catch (error) {
      console.log(error);
    }
  };

  updateUnread = async () => {
    if (APIManager.isAuthenticated()) {
      const { response } = await APIManager.GET<UnreadNotification>(
        '/notifications/unread',
      );

      if (!response || !APIManager.isSucceed(response)) {
        this._updateUnreadNotificationCount(0);
        return;
      }

      const count = response?.data?.unread || 0;
      this._updateUnreadNotificationCount(count);
    } else {
      this._updateUnreadNotificationCount(0, false);
    }
  };

  updateStore(store: Store) {
    if (!store || this._store === store) return;

    this._store = store;

    const user = this._store.getState().user as AuthLogin;
    const device = store.getState().device as DeviceState;
    this._username = user?.username;

    const count = device?.unreadNotificationCount || 0;
    this._updateUnreadNotificationCount(count, false);

    this.updateUnread();
    this._subscribeToken();
  }

  read = async (id: string) => {
    try {
      if (isEmpty(id)) {
        return false;
      }

      const { response } = await APIManager.POST<UnreadNotification>(
        `/notifications/${id}/read`,
      );
      if (!response || !APIManager.isSucceed(response)) {
        return false;
      }

      const unread = response.data?.unread;
      this._updateUnreadNotificationCount(unread || 0);
      return true;
    } catch (error) {
      return false;
    }
  };

  _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (this._currentState === 'background' && nextAppState === 'active')
      this.updateUnread();

    this._currentState = nextAppState;
  };

  _initializeNotifee = () => {
    if (this._notifeeInitialized) {
      return;
    }

    this._notifeeInitialized = true;

    this._createNotificationChannels();
    this._clearLocalNotifications();
    notifee.onForegroundEvent(this._handleNotifeeEvent);
    notifee.onBackgroundEvent(this._handleNotifeeEvent);
  };

  _updateUnreadNotificationCount = async (
    count: number,
    shouldPersistToStore = true,
  ) => {
    if (this._unreadNotificationCount === count) {
      shouldPersistToStore = true;
    }
    this._unreadNotificationCount = count;
    notifee.setBadgeCount(count);

    if (shouldPersistToStore && this._store) {
      this._store.dispatch(updateUnreadNotificationCount(count));
    }
  };

  _handleNotifeeEvent = async (event: Event) => {
    if (
      event.type !== EventType.PRESS &&
      event.type !== EventType.ACTION_PRESS
    ) {
      return;
    }

    this._notifeeNotification = event.detail.notification as Notification;
    this._handleNotifeeNotification();
  };

  _handleRemoteMessageOpened = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ) => {
    this._handleRemoteMessage(remoteMessage, false);

    if (isEmpty(remoteMessage)) {
      return;
    }

    const data = remoteMessage?.data;
    this._handleNotificationOpened(data);
  };

  _handleNotificationOpened = async (data?: Record<string, any>) => {
    if (!data || isEmpty(data)) {
      return;
    }

    const { id, uri } = data;
    await this.read(id);
    await this.updateUnread();

    if (this._store) {
      this._store.dispatch(updateNotificationUpdatedAt());
    }
  };

  _handleNotifeeNotification = () => {
    if (!this._started || !this._notifeeNotification) return;

    this._handleNotificationOpened(this._notifeeNotification?.data);
  };

  _clearLocalNotifications = () => {
    notifee.cancelAllNotifications();
  };

  _createNotificationChannels = async () => {
    if (Platform.OS !== 'android') {
      return;
    }

    await notifee.createChannel({
      id: DEFAULT_CHANNEL_ID,
      name: 'Default Channel',
      description: 'Default channel for notification',
      sound: DEFAULT_NOTIFICATION_SOUND_NAME,
      vibration: true,
    });
    await notifee.createChannel({
      id: LOCAL_CHANNEL_ID,
      name: 'Local Channel',
      description: 'Channel for local notification',
      sound: LOCAL_NOTIFICATION_SOUND_NAME,
      vibration: true,
    });
  };

  _setupFCMRefreshTokenListener = () => {
    this._tokenRefreshListener = messaging().onTokenRefresh(
      this._updateFCMToken,
    );
  };

  _setupFCMMessageListener = () => {
    this._messageListener = messaging().onMessage(this._handleRemoteMessage);
  };

  _setupFCMNotificationOpenedAppListener = () => {
    this._fcmNotificationOpenedAppListener =
      messaging().onNotificationOpenedApp(this._handleRemoteMessageOpened);
  };

  _syncFCMToken = async (attempts = 1) => {
    if (
      isEmpty(this._fcmToken) ||
      !APIManager.isAuthenticated() ||
      attempts > MAX_SYNC_FCM_TOKEN_ATTEMPTS
    ) {
      return;
    }
    const data = new FormData();
    data.append('token', this._fcmToken!);

    const response = await APIManager.POST('/notifications/fcm', data);
    if (!APIManager.isSucceed(response)) {
      await this._syncFCMToken(attempts + 1);
      return;
    }
    await StorageUtils.setItem(StorageKey.FCM_TOKEN, this._fcmToken!);
  };

  _updateFCMToken = async (token?: string) => {
    const currentToken = await StorageUtils.getItem(StorageKey.FCM_TOKEN);
    if (currentToken === token) {
      return;
    }
    this._fcmToken = token;
    this._syncFCMToken();
  };

  _cleanFCM = () => {
    this._tokenRefreshListener?.();
    this._tokenRefreshListener = undefined;

    this._messageListener?.();
    this._messageListener = undefined;

    this._fcmNotificationOpenedAppListener?.();
    this._fcmNotificationOpenedAppListener = undefined;
  };

  _handleRemoteMessage = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
    shouldShowLocalNotification = true,
  ) => {
    if (!remoteMessage || isEmpty(remoteMessage)) {
      return;
    }

    const { data } = remoteMessage;
    const { notification } = remoteMessage;

    if (
      shouldShowLocalNotification &&
      notification &&
      !isEmpty(notification) &&
      !isEmpty(notification.title) &&
      !isEmpty(notification.body)
    ) {
      if (this._currentState === 'active') {
        showToast(notification.body!, 'notification', notification.title);

        return;
      }

      notifee.displayNotification({
        title: notification.title,
        body: notification.body,
        android: {
          color: COLORS.primary600,
          colorized: true,
          channelId: LOCAL_CHANNEL_ID,
          sound: LOCAL_NOTIFICATION_SOUND_NAME,
        },
        data,
      });
    }

    if (this._store) {
      this._store.dispatch(updateNotificationUpdatedAt());
    }

    await this.updateUnread();
  };

  _fetchInitialFCMNotification = async () => {
    try {
      const remoteMessage = await messaging().getInitialNotification();
      await this._handleRemoteMessageOpened(remoteMessage);
    } catch (error) {}
  };

  _handleStateChange = () => {
    const user = this._store!.getState().user;
    if (
      (isEmpty(this._user) && !isEmpty(user)) ||
      (!isEmpty(this._user) && isEmpty(user)) ||
      this._user?.username !== user?.username
    ) {
      this._username = user?.username;
      this._syncFCMToken();
      this.updateUnread();
    }
    this._user = user;
  };

  _subscribeToken = () => {
    if (!this._store) return;

    this._store?.subscribe(this._handleStateChange.bind(this));
  };
}

export default new NotificationManager();
