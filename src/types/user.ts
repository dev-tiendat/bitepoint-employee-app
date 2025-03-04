import * as yup from 'yup';

export enum UserGender {
  FEMALE = 0,
  MALE = 1,
  OTHER = 2,
}

export const UserValidationSchema = yup.object().shape({
  firstName: yup.string().required('Họ không được để trống'),
  lastName: yup.string().required('Tên không được để trống'),
  birthDate: yup.number().required('Ngày sinh không được để trống'),
  gender: yup.number().required('Giới tính không được để trống'),
  email: yup.string().email('Email không hợp lệ'),
  phone: yup
    .string()
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại không được để trống'),
  avatar: yup.string().url('Avatar không hợp lệ'),
});

export type UserInput = yup.InferType<typeof UserValidationSchema>;

export type User = UserInput & {
  username: string;
  roles: string[];
};
