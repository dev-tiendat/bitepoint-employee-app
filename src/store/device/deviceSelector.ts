import { RootState } from 'store';

export const selectIsMinimizedMenu = (state: RootState) =>
  state.device.isMinimizedMenu;

export const selectUnreadNotificationCount = (state: RootState) =>
  state.device.unreadNotificationCount;

export const selectNotificationUpdatedAt = (state: RootState) =>
  state.device.notificationUpdatedAt;
