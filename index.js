import { AppRegistry, LogBox } from 'react-native';

import './gesture-handler';
import { name as appName } from './app.json';
import App from 'App';
import APIManager from 'managers/APIManager';
import SocketManager from 'managers/SocketManager';
import UserManager from 'managers/UserManager';
import NotificationManager from 'managers/NotificationManager';
import LibraryUtils from 'utils/LibraryUtils';
import { store, configurePersistor } from 'store';

if (__DEV__) {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Require cycle: src/managers/APIManager.ts -> src/managers/UserManager.ts -> src/managers/APIManager.ts',
  ]);
}

LibraryUtils.initialize();
APIManager.initialize();
NotificationManager.initialize();

export const persistor = configurePersistor(() => {
  APIManager.updateStore(store);
  NotificationManager.updateStore(store);
  SocketManager.updateStore(store);
  UserManager.updateStore(store);

  NotificationManager.start();
});

AppRegistry.registerComponent(appName, () => App);
