export type Stats = {
  totalEarning: number;
  totalOrder: number;
  ordersCompleted: number;
};

export type PopularMenuItem = {
  name: string;
  image: string;
  quantity: number;
};

export type ReservationInfo = {
  reservationId: number;
  customerName: string;
  guestCount: number;
  phone: string;
  reservationTime: number;
};

export type Statistics = {
  stats?: Stats;
  popularMenuItems?: PopularMenuItem[];
  reservations?: ReservationInfo[];
};
