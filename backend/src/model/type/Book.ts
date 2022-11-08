import { BillType } from 'src/constant/Book';

export type ShareDetail = {
  id: string;
  amount: number;
};

export type BillData = {
  date: string;
  type: BillType;
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

export type Transaction = TransactionBill | TransactionTransfer;

export type TransactionBill = {
  id: string;
  ver: string;
  bookId: string;
  date: string;
  type: 'in' | 'out';
  descr: string | null;
  amount: number;
  former: ShareDetail[];
  latter: ShareDetail[];
  memo: string | null;
  dateCreated: string | null;
  dateUpdated: string | null;
  dateDeleted: string | null;
  history: History[];
};

export type TransactionTransfer = {
  id: string;
  ver: string;
  bookId: string;
  date: string;
  type: 'transfer';
  amount: number;
  srcMemberId: string;
  dstMemberId: string;
  memo: string | null;
  dateCreated: string | null;
  dateUpdated: string | null;
  dateDeleted: string | null;
  history: History[];
};

export type History = {
  id: string;
  items: {
    key:
      | 'date'
      | 'amount'
      | 'memo'
      | 'srcMemberId'
      | 'dstMemberId'
      | 'descr'
      | 'former'
      | 'latter';
    from: string | number | null;
    to: string | number | null;
  }[];
};
