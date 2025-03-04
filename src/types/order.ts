import { Reservation } from './reservation';
import { Table } from './table';
import { Voucher } from './voucher';

export enum OrderItemStatus {
  ORDERED = 1,
  PREPARING = 2,
  READY = 3,
  SERVED = 4,
  CANCELLED = 5,
}

export enum OrderStatus {
  ALL = -1,
  ORDERING = 0,
  CANCELLED = 1,
  COMPLETED = 2,
}

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  popular?: number;
  description?: string;
  quantity?: number;
  note?: string;
  urged?: number;
  status?: OrderItemStatus;
  orderId?: string;
  tableName?: string;
  createdAt?: number;
};

export type OrderInfo = {
  orderId: string;
  qrcode: string;
  tableName: string;
};

export type Order = {
  id: string;
  orderTime: number;
  totalPrice: number;
  status: OrderStatus;
  table?: Table;
  reservation?: Reservation;
  orderItems?: MenuItem[];
  voucher?: Voucher;
};

export type OrderMenu = {
  id: number;
  name: string;
  image: string;
  description: string;
  orderNo: number;
  menuItems?: MenuItem[];
};

export type OrderTable = OrderInfo & {
  cart?: MenuItem[];
};
