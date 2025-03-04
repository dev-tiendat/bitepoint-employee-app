import { Store } from '@reduxjs/toolkit';
import { AuthLogin } from 'types/auth';

class NotificationManager {
  private _store: Store | undefined;
  private _url: string | undefined;
  private _token: string | undefined;
  private _uuid: string | undefined;
  private _fcmToken: string | undefined;
  private _apnToken: string | undefined;

  setToken(token?: string) {
    if (!token || this._token === token) return;

    this._token = token;
  }

  updateStore(store: Store) {
    if (!store || this._store === store) return;

    this._store = store;

    const user = this._store.getState().user as AuthLogin;
    // this._uuid = user?.;
    this.setToken(user?.tokens?.accessToken);

    this._subscribeToken();
  }

  _handleStateChange = () => {
    const user = this._store!.getState().user;
    this.setToken(user?.token);
  };

  _subscribeToken = () => {
    this._store?.subscribe(this._handleStateChange.bind(this));
  };
}

export default new NotificationManager();
