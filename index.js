/**
 * @format
 */

import { AppRegistry } from 'react-native';

import './gesture-handler';
import { name as appName } from './app.json';
import App from 'App';
import APIManager from 'managers/APIManager';
import SocketManager from 'managers/SocketManager';
import { store, configurePersistor } from 'store';
import NotificationManager from 'managers/NotificationManager';

export const persistor = configurePersistor(() => {
  APIManager.updateStore(store);
  NotificationManager.updateStore(store);
  SocketManager.updateStore(store);
});

AppRegistry.registerComponent(appName, () => App);
