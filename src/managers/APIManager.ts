import axios, {
  CancelTokenSource,
  Method,
  RawAxiosRequestHeaders,
} from 'axios';
import { Store } from '@reduxjs/toolkit';
import { isEmpty, isNil, startsWith } from 'lodash';
import { Config } from 'react-native-config';

import { ErrorCode } from 'common';
import { AuthLogin } from 'types/auth';
import {
  APIGenericResponse,
  APIGenericResponseData,
  ContentType,
} from 'types/api';
import { updateToken } from 'store/user/userSlice';
import AlertUtils from 'utils/AlertUtils';
import UserManager from './UserManager';

class APIManager {
  private _baseUrl: string;
  private _accessToken?: string;
  private _refreshToken?: string;
  private _store?: Store;
  private _refreshingTokenPromise?: Promise<void> | null = null;
  private _handlingCriticalError: boolean;
  private _pendingRequestCancelTokens: CancelTokenSource[];

  constructor(bareUrl: string) {
    this._baseUrl = bareUrl;
    this._handlingCriticalError = false;
    this._pendingRequestCancelTokens = [];
  }

  isAuthenticated = () => {
    return !isNil(this._accessToken);
  };

  setAccessToken = (token?: string) => {
    if (!token || this._accessToken === token) return;

    this._accessToken = token;
  };

  setRefreshToken = (token?: string) => {
    if (!token || this._refreshToken === token) return;
    this._refreshToken = token;
  };

  signOut = () => {
    this._accessToken = undefined;
    this._refreshToken = undefined;
  };

  updateStore = (store: Store) => {
    if (!store || this._store === store) {
      return;
    }
    this._store = store;
    const user = this._store.getState().user as AuthLogin;

    this.setAccessToken(user?.tokens?.accessToken);
    this.setRefreshToken(user?.tokens?.refreshToken);
    
    this._subscribeToken();
  };

  GET = async <T>(
    path: string,
    params?: Record<string, any> | undefined,
    cancelTokenSource?: CancelTokenSource | undefined,
  ): Promise<APIGenericResponse<T>> =>
    this.request<T>(
      'GET',
      path,
      undefined,
      params,
      undefined,
      cancelTokenSource,
    );

  POST = async <T>(
    path: string,
    data?: any,
    cancelTokenSource?: CancelTokenSource | undefined,
  ): Promise<APIGenericResponse<T>> =>
    this.request<T>(
      'POST',
      path,
      undefined,
      undefined,
      data,
      cancelTokenSource,
    );

  PUT = async <T>(
    path: string,
    data?: any,
    cancelTokenSource?: CancelTokenSource | undefined,
  ): Promise<APIGenericResponse<T>> =>
    this.request<T>('PUT', path, undefined, undefined, data, cancelTokenSource);

  DELETE = async <T>(
    path: string,
    data?: any,
    cancelTokenSource?: CancelTokenSource | undefined,
  ): Promise<APIGenericResponse<T>> =>
    this.request<T>(
      'DELETE',
      path,
      undefined,
      undefined,
      data,
      cancelTokenSource,
    );

  request = async <T>(
    method: Method,
    path: string,
    headers?: RawAxiosRequestHeaders,
    params?: Record<string, any> | undefined,
    data?: any,
    cancelTokenSource?: CancelTokenSource | undefined,
  ): Promise<APIGenericResponse<T>> => {
    if (isNil(cancelTokenSource))
      cancelTokenSource = axios.CancelToken.source();
    this._pendingRequestCancelTokens.push(cancelTokenSource);

    if (this._refreshingTokenPromise) await this._refreshingTokenPromise;

    try {
      const url = startsWith(path, 'http') ? path : `${this._baseUrl}${path}`;

      if (isNil(headers)) {
        headers = {} as RawAxiosRequestHeaders;
      }

      if (this._accessToken && !headers?.Authorization) {
        headers['Authorization'] = `Bearer ${this._accessToken}`;
      }

      if (method !== 'GET' && !isNil(data)) {
        if (data instanceof FormData) {
          headers['Content-Type'] = ContentType.FORM_DATA;
        } else {
          headers['Content-Type'] = ContentType.JSON;
          data = JSON.stringify(data);
        }
      }

      const fetchData = async () =>
        axios.request<APIGenericResponseData<T>>({
          method,
          url,
          headers,
          params,
          data,
          cancelToken: cancelTokenSource.token,
        });

      let rawResponse = await fetchData();

      if (ErrorCode.ACCESS_TOKEN_EXPIRED === rawResponse.data.code) {
        if (!this._refreshingTokenPromise) {
          this._refreshingTokenPromise = this._fetchNewToken().finally(() => {
            this._refreshingTokenPromise = undefined;
          });
        }
        await this._refreshingTokenPromise;
        rawResponse = await fetchData();
      }
      this._handleCriticalAuthError(rawResponse.data.code);

      const response = rawResponse.data;

      return { response };
    } catch (error) {
      return { error };
    } finally {
      this._removePendingToken(cancelTokenSource);
    }
  };

  isSucceed = (response: any) => {
    if (isEmpty(response)) return;

    let responseData: APIGenericResponseData<any>;
    if ((response as APIGenericResponse<any>).response)
      responseData = (response as APIGenericResponse<any>).response!;
    else responseData = response as APIGenericResponseData<any>;

    return (
      responseData && !Object.values(ErrorCode).includes(responseData.code)
    );
  };

  passedMessageError = (response: APIGenericResponseData<any>) => {
    if (isEmpty(response)) return '';

    return response.message;
  };

  transformToFormData = (data: Record<string, any>) => {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    return formData;
  };

  async _fetchNewToken(): Promise<void> {
    if (!this._refreshToken) return;

    const { response } = await this.request<string>(
      'POST',
      '/api/v1/auth/refresh-token',
      undefined,
      undefined,
      { refreshToken: this._refreshToken },
    );

    this._handleCriticalAuthError(response?.code);

    this.setAccessToken(response?.data);
    this._store?.dispatch(updateToken(response?.data!));
  }

  _handleCriticalAuthError = (error?: ErrorCode) => {
    if (this._handlingCriticalError || !error) return;

    const criticalErrors = [
      ErrorCode.REFRESH_TOKEN_EXPIRED,
      ErrorCode.PASSWORD_CHANGED,
    ];
    if (!criticalErrors.includes(error)) return;

    this._handlingCriticalError = true;
    this._cancelAllPendingRequests();

    let message = '';
    switch (error) {
      case ErrorCode.REFRESH_TOKEN_EXPIRED:
        message = 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.';
        break;
      case ErrorCode.PASSWORD_CHANGED:
        message = 'Mật khẩu đã thay đổi, vui lòng đăng nhập lại.';
        break;
      default:
        message = 'Đã xảy ra lỗi xác thực.';
    }

    AlertUtils.showCustom({
      title: 'Lỗi xác thực',
      description: message,
      actions: [
        {
          label: 'Đăng nhập lại',
          onPress: () => {
            UserManager.clearUserSession();
            this._handlingCriticalError = false;
          },
          style: 'primary',
        },
      ],
    });

    throw new Error('Critical auth error');
  };

  _cancelAllPendingRequests = () => {
    this._pendingRequestCancelTokens.forEach(token => token.cancel());
    this._pendingRequestCancelTokens = [];
  };

  private _removePendingToken = (token: CancelTokenSource) => {
    this._pendingRequestCancelTokens = this._pendingRequestCancelTokens.filter(
      t => t !== token,
    );
  };

  _handleStateChange = () => {
    const user = this._store?.getState().user as AuthLogin;

    this.setAccessToken(user?.tokens?.accessToken);
    this.setRefreshToken(user?.tokens?.refreshToken);
  };

  _subscribeToken = () => {
    if (!this._store) return;

    this._store.subscribe(this._handleStateChange.bind(this));
  };
}

export default new APIManager(Config.API_BASE_URL!);
