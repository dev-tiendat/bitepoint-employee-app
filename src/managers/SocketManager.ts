import { Store } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';

import { AuthLogin } from 'types/auth';

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
  }

  static setToken = (token?: string) => {
    if (this.token === token) return;

    this.token = token;
  };

  static updateStore = (store: Store) => {
    if (!store || this.store === store) {
      return;
    }
    this.store = store;
    const user = this.store.getState().user as AuthLogin;

    this.setToken(user?.tokens?.accessToken);
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
}

SocketManager.baseUrl = 'http://localhost:3000';

export default SocketManager;
