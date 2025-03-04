import * as yup from 'yup';

export enum TableStatus {
  AVAILABLE = 0,
  RESERVED = 1,
  OCCUPIED = 2,
  CLEANING = 3,
}

export type FindTable = {
  customerName: string;
  guestCount: number;
};

export type TableZone = {
  id: number;
  name: string;
};

export type TableHome = TableZone & {
  tables?: Table[];
};

export type Table = {
  id: number;
  name?: string;
  status?: TableStatus;
  image?: string;
};

export type StatusInfo = {
  status: TableStatus;
  title: string;
  color: string;
};
