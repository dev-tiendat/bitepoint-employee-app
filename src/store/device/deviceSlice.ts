import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMinimizedMenu: false,
  isShowNotificationModal: false,
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    toggleSideBar: state => {
      state.isMinimizedMenu = !state.isMinimizedMenu;
    },
    toggleNotificationModal: state => {
      state.isShowNotificationModal = !state.isShowNotificationModal;
    },
  },
});

export const { toggleSideBar } = deviceSlice.actions;

export default deviceSlice.reducer;
