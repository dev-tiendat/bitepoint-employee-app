export type APIGenericResponseData<T> = {
  code: number;
  message: string;
  data?: T;
};

export type SocketResponseData<T> = {
  event: string;
  code: number;
  data: T;
};

export type APIGenericResponse<T> = {
  error?: any;
  response?: APIGenericResponseData<T>;
};

export enum ContentType {
  // json
  JSON = 'application/json;charset=UTF-8',
  // text
  TEXT = 'text/plain;charset=UTF-8',
  // form-data
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data
  FORM_DATA = 'multipart/form-data',
}

export type BaseEntity = {
  id: number;
  createdAt: number;
  updatedAt: number;
};
