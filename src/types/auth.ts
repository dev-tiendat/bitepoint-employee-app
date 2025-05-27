import { UserRole } from './user';

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export type AuthLogin = {
  username?: string;
  fullName?: string;
  avatar?: string;
  roles?: UserRole[];
  tokens?: AuthToken;
};
