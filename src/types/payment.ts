export enum PaymentMethod {
  QR_CODE = 0,
  CASH = 1,
}

export enum PaymentBank{
  MB_BANK = 'mb_bank',
  TP_BANK = 'tp_bank',
}

export type Payment = {
  name: string;
  bank: PaymentBank;
  account: string;
  content: string;
  amount: number;
  qrCode: string;
}