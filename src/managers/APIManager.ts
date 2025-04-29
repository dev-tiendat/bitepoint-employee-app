import axios, { AxiosRequestHeaders, CancelToken, Method } from 'axios';
import { NavigationContainerRef } from '@react-navigation/native';
import { Store } from '@reduxjs/toolkit';
import { isEmpty, isNil, startsWith } from 'lodash';
import { Config } from 'react-native-config';

import { AuthLogin } from 'types/auth';
import {
  APIGenericResponse,
  APIGenericResponseData,
  ContentType,
} from '../types/api';
import { updateToken } from 'store/user/userSlice';
import { ErrorCode } from 'common';

class APIManager {
  private navigationRef!: NavigationContainerRef<ReactNavigation.RootParamList> | null;
  private _baseUrl: string;
  private _accessToken?: string;
  private _refreshToken?: string;
  private _store?: Store;

  constructor(bareUrl: string) {
    this._baseUrl = bareUrl;
  }

  setAccessToken = (token?: string) => {
    if (!token || this._accessToken === token) return;

    this._accessToken = token;
  };

  setRefreshToken = (token?: string) => {
    if (!token || this._refreshToken === token) return;
    this._refreshToken = token;
  };

  setNavigationRef = (
    ref: NavigationContainerRef<ReactNavigation.RootParamList> | null,
  ) => {
    this.navigationRef = ref;
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
    this._subscribeToken();
  };

  GET = async <T>(
    path: string,
    params?: Record<string, any> | undefined,
    cancelToken?: CancelToken | undefined,
  ): Promise<APIGenericResponse<T>> =>
    this.request<T>('GET', path, undefined, params, undefined, cancelToken);

  POST = async <T>(
    path: string,
    data?: any,
    cancelToken?: CancelToken | undefined,
  ): Promise<APIGenericResponse<T>> =>
    this.request<T>('POST', path, undefined, undefined, data, cancelToken);

  PUT = async <T>(
    path: string,
    data?: any,
    cancelToken?: CancelToken | undefined,
  ): Promise<APIGenericResponse<T>> =>
    this.request<T>('PUT', path, undefined, undefined, data, cancelToken);

  DELETE = async <T>(
    path: string,
    data?: any,
    cancelToken?: CancelToken | undefined,
  ): Promise<APIGenericResponse<T>> =>
    this.request<T>('DELETE', path, undefined, undefined, data, cancelToken);

  request = async <T>(
    method: Method,
    path: string,
    headers?: AxiosRequestHeaders,
    params?: Record<string, any> | undefined,
    data?: any,
    cancelToken?: CancelToken | undefined,
  ): Promise<APIGenericResponse<T>> => {
    try {
      const url = startsWith(path, 'http') ? path : `${this._baseUrl}${path}`;

      if (isNil(headers)) {
        headers = {} as AxiosRequestHeaders;
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
          cancelToken,
        });

      let rawResponse = await fetchData();

      if (rawResponse.data.code === ErrorCode.ACCESS_TOKEN_EXPIRED) {
        await this._fetchNewToken();
        rawResponse = await fetchData();
      }
      const response = rawResponse.data;

      return { response };
    } catch (error) {
      return { error };
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

  async _fetchNewToken(): Promise<void> {
    const user = this._store?.getState().user as AuthLogin;
    const refreshToken = user?.tokens?.refreshToken;
    const { response } = await this.request<string>(
      'POST',
      '/api/v1/auth/refresh-token',
      undefined,
      undefined,
      { refreshToken },
    );

    if (response?.code === ErrorCode.REFRESH_TOKEN_EXPIRED) {
      this.signOut();
      this.navigationRef?.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      return;
    }

    this._store?.dispatch(updateToken(response?.data!));
    this.setAccessToken(response?.data);
  }

  _handleStateChange = () => {
    const user = this._store?.getState().user as AuthLogin;

    this.setAccessToken(user?.tokens?.accessToken);
    this.setRefreshToken(user?.tokens?.refreshToken);
  };

  _subscribeToken = () => {
    this._store?.subscribe(this._handleStateChange.bind(this));
  };
}

export default new APIManager(Config.API_BASE_URL!);
