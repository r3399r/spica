import { BillType, ShareMethod } from 'src/constant/Book';
import { Currency } from 'src/model/entity/Currency';
import { Member } from 'src/model/entity/Member';
import { ViewBook } from 'src/model/viewEntity/ViewBook';

export type BookDetail = ViewBook & {
  members: Member[];
  transactions: Transaction[];
  currencies: Currency[];
};

export type ShareDetail = {
  id: string;
  method: ShareMethod;
  value?: number;
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
  currencyId?: string;
};

export type TransferData = {
  date: string;
  amount: number;
  srcMemberId: string;
  dstMemberId: string;
  memo?: string;
  currencyId?: string;
};

export type Transaction = TransactionBill | TransactionTransfer;

export type TransactionBill = {
  id: string;
  ver: string;
  bookId: string;
  date: string;
  type: 'in' | 'out';
  descr: string;
  amount: number;
  former: ShareDetail[];
  latter: ShareDetail[];
  memo: string | null;
  currencyId: string;
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
  currencyId: string;
  dateCreated: string | null;
  dateUpdated: string | null;
  dateDeleted: string | null;
  history: History[];
};

export type History = {
  date: string | null;
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
