import { Store } from '@reduxjs/toolkit';
import Config from 'react-native-config';
import { io, Socket } from 'socket.io-client';

import { AuthLogin } from 'types/auth';

let SocketManagerLookup: Record<string, SocketManager> = {};

interface SocketManagerOptions {
  namespace?: string;
}

class SocketManager {
  private _socket: Socket | null = null;
  private _namespace: string;
  static store: Store;
  static baseUrl: string;
  static token?: string;

  constructor(options: SocketManagerOptions) {
    this._namespace = options.namespace || '';
    if (SocketManagerLookup[this._namespace]) {
      return SocketManagerLookup[this._namespace];
    }
    SocketManagerLookup[this._namespace] = this;
  }

  static setToken = (token?: string) => {
    if (this.token === token) return;

    this.token = token;
    for (const key in SocketManagerLookup) {
      const socketManager = SocketManagerLookup[key];
      if (!socketManager._isConnected()) continue;
      socketManager.disconnect();
      socketManager.connect();
    }
  };

  static updateStore = (store: Store) => {
    if (!store || this.store === store) {
      return;
    }
    this.store = store;
    const user = this.store.getState().user as AuthLogin;

    this.setToken(user?.tokens?.accessToken);
    this._subscribeStore();
  };

  static signOut = () => {
    for (const key in SocketManagerLookup) {
      const socketManager = SocketManagerLookup[key];
      if (!socketManager._isConnected()) continue;

      SocketManagerLookup[key].disconnect();
    }
    SocketManagerLookup = {};
    this.token = undefined;
  };

  connect = (query?: Record<string, any>) => {
    this._socket = io(`${SocketManager.baseUrl}/${this._namespace}`, {
      extraHeaders: {
        Authorization: `${SocketManager.token}`,
      },
      query: query,
    });

    return this._socket;
  };

  disconnect = () => {
    if (this._socket) {
      this._socket.disconnect();
    }
  };

  on = (event: string, callback: (...args: any[]) => void) => {
    if (this._socket) {
      this._socket.on(event, callback);
    }
  };

  off = (event: string, callback: (...args: any[]) => void) => {
    if (this._socket) {
      this._socket.off(event, callback);
    }
  };

  emit = (event: string, ...args: any[]) => {
    if (this._socket) {
      this._socket.emit(event, ...args);
    }
  };

  join = (room: string) => {
    this.emit('join', room);
  };

  leave = (room: string) => {
    this.emit('leave', room);
  };

  onConnect = (callback: () => void) => {
    this.on('connect', callback);
  };

  onDisconnect = (callback: () => void) => {
    this.on('disconnect', callback);
  };

  _isConnected = () => {
    return this._socket?.connected;
  };

  static _handleStoreChange = () => {
    const user = this.store.getState().user as AuthLogin;
    this.setToken(user?.tokens?.accessToken);
  };

  static _subscribeStore = () => {
    if (!this.store) return;

    this.store?.subscribe(this._handleStoreChange.bind(this));
  };
}

SocketManager.baseUrl = Config.API_BASE_URL!;

export default SocketManager;
