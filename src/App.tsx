import React from 'react';
import { StatusBar } from 'react-native';
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
          <StatusBar hidden />
          <AppNavigator />
          <Toast position="bottom" />
        </PersistGate>
      </Provider>
    </React.Fragment>
  );
};

export default App;
