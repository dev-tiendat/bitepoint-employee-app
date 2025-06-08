import { Store } from '@reduxjs/toolkit';
import { AuthLogin } from 'types/auth';
import { User } from 'types/user';
import APIManager from './APIManager';
import { logout, updateProfileInfo } from 'store/user/userSlice';
import SocketManager from './SocketManager';
import { navigationRef } from 'navigation/AppNavigator';
import StorageUtils from 'utils/StorageUtils';
import { StorageKey } from 'common';

class UserManager {
  private _store?: Store;
  private _user?: AuthLogin;
  private _token?: string;

  updateStore = (store: Store) => {
    if (!store || this._store === store) return;

    this._store = store;
    this._updateUser();
    this._subscribeStore();
  };

  clearUserSession = async () => {
    this._token = undefined;

    this._store?.dispatch(logout());
    APIManager.signOut();
    SocketManager.signOut();

    try {
      await StorageUtils.removeItem(StorageKey.FCM_TOKEN);
    } catch (error) {}

    this._resetToLogin();
  };

  signOut = async () => {
    if (!this._token) return;

    const formData = new FormData();
    const fcmToken = await StorageUtils.getItem(StorageKey.FCM_TOKEN);
    if (fcmToken) {
      formData.append('fcm_token', fcmToken);
    }

    await APIManager.POST<AuthLogin>('/api/v1/account/logout', formData);
    this.clearUserSession();
  };

  _resetToLogin = () => {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'AuthNavigator' }],
    });
  };

  _syncUser = async () => {
    if (!this._token) return;

    try {
      const { response } = await APIManager.GET<User>(
        '/api/v1/account/profile',
      );
      if (!APIManager.isSucceed(response)) {
        return;
      }

      const user = response!.data;
      this._store?.dispatch(updateProfileInfo(user!));
    } catch (error) {}
  };

  _updateUser = () => {
    const user = this._store?.getState().user as AuthLogin;
    if (!user || this._user === user) return;

    this._user = user;

    const token = user.tokens?.accessToken;
    if (!token || this._token !== token) {
      this._token = token;
      this._syncUser();
    }
  };

  _handleStoreChange = () => {
    this._updateUser();
  };

  _subscribeStore = () => {
    if (!this._store) return;

    this._store?.subscribe(this._handleStoreChange.bind(this));
  };
}

export default new UserManager();
