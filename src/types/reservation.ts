import * as yup from 'yup';
import { BaseEntity } from './api';
import { OrderInfo } from './order';

export const ReserveTableValidationSchema = yup.object().shape({
  customerName: yup.string().required('Họ tên không được để trống'),
  phone: yup
    .string()
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại không được để trống'),
  email: yup.string().email('Email không hợp lệ'),
  reservationTime: yup.number().required('Thời gian đặt không được để trống'),
  guestCount: yup.number().required('Số lượng khách không được để trống'),
  specialRequest: yup.string(),
});

export type ReserveTableInput = yup.InferType<typeof ReserveTableValidationSchema>;

export enum ReservationStatus {
  PENDING = 0,
  COMPLETED = 1,
  CANCELED = 2,
}

export type Reservation = ReserveTableInput &
  BaseEntity & {
    status: ReservationStatus;
    orders?: OrderInfo[];
  };
