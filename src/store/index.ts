import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistCombineReducers, persistStore } from 'redux-persist';

import userReducer from './user/userSlice';
import deviceReducer from './device/deviceSlice';

const config = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = persistCombineReducers(config, {
  device: deviceReducer,
  user: userReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const configurePersistor = (onRehydrationCompleted: () => any) => {
  return persistStore(store, null, onRehydrationCompleted);
};

export { store };
