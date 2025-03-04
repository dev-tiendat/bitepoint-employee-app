import { RootState } from 'store';

export const selectIsMinimizedMenu = (state: RootState) =>
  state.device.isMinimizedMenu;

export const selectIsShowNotificationModal = (state: RootState) =>
  state.device.isShowNotificationModal;
