import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthLogin } from 'types/auth';
import { User } from 'types/user';

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
    updateUser: (state: AuthLogin, action: PayloadAction<AuthLogin>) => {
      return { ...state, ...action.payload };
    },
    updateProfileInfo: (state: AuthLogin, action: PayloadAction<User>) => {
      state.avatar = action.payload.avatar;
      state.fullName = `${action.payload.firstName} ${action.payload.lastName}`;
      state.roles = action.payload.roles;
    },
    updateToken: (state: AuthLogin, action: PayloadAction<string>) => {
      if (state.tokens) {
        state.tokens.accessToken = action.payload;
      }
    },
    logout: () => initialState,
  },
});

export const { updateUser, updateProfileInfo, updateToken, logout } =
  userSlice.actions;

export default userSlice.reducer;
