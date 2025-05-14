import 'react-native-gesture-handler';
import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from 'store';
import { PersistGate } from 'redux-persist/integration/react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { persistor } from '../index';

import AppNavigator from 'navigation/AppNavigator';
import { ToastProvider } from 'components/Toast';

const App = () => {
  return (
    <GestureHandlerRootView>
      <ActionSheetProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ToastProvider>
              <StatusBar
                translucent={Platform.OS === 'android'}
                hidden={Platform.OS === 'ios'}
                backgroundColor={'transparent'}
                barStyle={'light-content'}
              />
              <AppNavigator />
            </ToastProvider>
          </PersistGate>
        </Provider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
};

export default App;
