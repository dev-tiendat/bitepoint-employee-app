import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DeviceState = {
  isMinimizedMenu: boolean;
  notificationUpdatedAt?: number;
  unreadNotificationCount?: number;
};

const initialState: DeviceState = {
  isMinimizedMenu: false,
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    toggleSideBar: state => {
      state.isMinimizedMenu = !state.isMinimizedMenu;
    },
    updateNotificationUpdatedAt: state => {
      state.notificationUpdatedAt = Date.now();
    },
    updateUnreadNotificationCount: (state, action: PayloadAction<number>) => {
      state.unreadNotificationCount = action.payload;
    },
  },
});

export const {
  toggleSideBar,
  updateNotificationUpdatedAt,
  updateUnreadNotificationCount,
} = deviceSlice.actions;

export default deviceSlice.reducer;
