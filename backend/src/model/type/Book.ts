export type BillData = {
  date: string;
  type: 'income' | 'expense';
  descr: string;
  amount: number;
  former: { id: string; weight?: number; amount?: number }[];
  latter: { id: string; weight?: number; amount?: number }[];
  formerRemainder: string;
  latterRemainder: string;
  memo?: string;
};

export type TransferData = {
  date: string;
  amount: number;
  srcMemberId: string;
  dstMemberId: string;
  memo?: string;
};
