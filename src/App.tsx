import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from 'store';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';
import { persistor } from '../index';

import AppNavigator from 'navigation/AppNavigator';

const App = () => {
  return (
    <React.Fragment>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar
            translucent={Platform.OS === 'android'}
            hidden={Platform.OS === 'ios'}
            backgroundColor={'transparent'}
            barStyle={'light-content'}
          />
          <AppNavigator />
          <Toast position="bottom" />
        </PersistGate>
      </Provider>
    </React.Fragment>
  );
};

export default App;
