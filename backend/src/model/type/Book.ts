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
  detail: ShareDetail[];
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
  date: Date;
  type: 'in' | 'out';
  descr: string;
  amount: number;
  shareMemberId: string;
  shareCount: string;
  memo: string | null;
  dateCreated: Date;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};

export type TransactionTransfer = {
  id: string;
  ver: string;
  bookId: string;
  date: Date;
  type: 'transfer';
  amount: number;
  srcMemberId: string;
  dstMemberId: string;
  memo: string | null;
  dateCreated: Date;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
