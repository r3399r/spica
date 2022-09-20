export enum BillType {
  Weight = 'weight',
  Amount = 'amount',
  Pct = 'pct',
}

export type ShareDetail = {
  id: string;
  type: BillType;
  value: number;
  takeRemainder?: boolean;
};

export type BillData = {
  date: string;
  type: 'income' | 'expense';
  descr: string;
  amount: number;
  former: ShareDetail[];
  latter: ShareDetail[];
  memo?: string;
};

export type TransferData = {
  date: string;
  amount: number;
  srcMemberId: string;
  dstMemberId: string;
  memo?: string;
};
