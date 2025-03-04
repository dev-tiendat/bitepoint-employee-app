import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthLogin } from 'types/auth';

const initialState: AuthLogin = {
  username: undefined,
  roles: [],
  tokens: undefined,
  avatar: undefined,
  fullName: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<AuthLogin>) => {
      state.username = action.payload.username;
      state.roles = action.payload.roles;
      state.tokens = action.payload.tokens;
      state.avatar = action.payload.avatar;
      state.fullName = action.payload.fullName;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      if (state.tokens) {
        state.tokens.accessToken = action.payload;
      }
    },

    logout: state => {
      return initialState;
    },
  },
});

export const { updateUser, updateToken, logout } = userSlice.actions;

export default userSlice.reducer;
