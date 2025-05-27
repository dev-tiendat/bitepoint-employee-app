import { isNil, isString } from 'lodash';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import * as yup from 'yup';

export type UserRole = {
  name: string;
  value: string;
};

export enum UserGender {
  FEMALE = 0,
  MALE = 1,
  OTHER = 2,
}

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const UpdateUserValidationSchema = yup.object().shape({
  firstName: yup.string().required('Họ không được để trống'),
  lastName: yup.string().required('Tên không được để trống'),
  birthDate: yup.date().required('Ngày sinh không được để trống'),
  gender: yup.number().required('Giới tính không được để trống'),
  email: yup.string().email('Email không hợp lệ'),
  phone: yup
    .string()
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại không được để trống'),
  avatar: yup.lazy(value => {
    if (isString(value) || isNil(value)) {
      return yup.string().optional().nullable();
    }

    return yup
      .mixed()
      .test('fileSize', 'Kích thước ảnh cần <= 2MB', (value: any) => {
        return (value as ImageOrVideo).size <= MAX_FILE_SIZE;
      })
      .optional();
  }),
});

export type UserInput = yup.InferType<typeof UpdateUserValidationSchema>;

export type User = Omit<UserInput, 'birthDate' | 'avatar'> & {
  avatar: string;
  birthDate: number;
  username: string;
  roles: UserRole[];
};

export type UserLoginLog = {
  id: number;
  ip: string;
  address: string;
  os: string;
  browser: string;
  time: Date | string;
};
