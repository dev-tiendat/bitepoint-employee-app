export enum NotificationType {
  ORDER_CHECK_IN = 'order.check-in',
  ORDER_URGE = 'order.urge',
  PAYMENT_SUCCESS = 'payment.success',
  PAYMENT_CUSTOMER_REQUEST_CASH_PAYMENT = 'payment.customer-request-cash-payment',
  TABLE_CLEANED = 'table.cleaned',
  TABLE_ASSIGNED = 'table.assigned',
  RESERVATION_CREATED = 'reservation.created',
  RESERVATION_CANCELED = 'reservation.canceled',
}

export type UnreadNotification = {
  unread: number;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  uri?: string;
  type: NotificationType;
  readAt: Date;
  createdAt: number;
};
