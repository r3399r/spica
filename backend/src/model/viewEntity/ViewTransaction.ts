export type ViewTransaction = {
  id: string;
  ver: string;
  bookId: string;
  date: Date;
  type: 'income' | 'expense' | 'transfer';
  descr: string | null;
  amount: number;
  srcMemberId: string | null;
  dstMemberId: string | null;
  memo: string | null;
  dateCreated: Date;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};

export type ViewTransactionBill = {
  id: string;
  ver: string;
  bookId: string;
  date: Date;
  type: 'income' | 'expense';
  descr: string;
  amount: number;
  srcMemberId: null;
  dstMemberId: null;
  memo: string | null;
  dateCreated: Date;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};

export type ViewTransactionTransfer = {
  id: string;
  ver: string;
  bookId: string;
  date: Date;
  type: 'transfer';
  descr: null;
  amount: number;
  srcMemberId: string;
  dstMemberId: string;
  memo: string | null;
  dateCreated: Date;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
