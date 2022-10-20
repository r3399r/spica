export type ViewTransaction = {
  id: string;
  ver: string;
  bookId: string;
  date: Date;
  type: 'in' | 'out' | 'transfer';
  descr: string | null;
  amount: number;
  shareMemberId: string | null;
  shareCount: number | null;
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
  type: 'in' | 'out';
  descr: string;
  amount: number;
  shareMemberId: string;
  shareCount: number;
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
  shareMemberId: null;
  shareCount: null;
  srcMemberId: string;
  dstMemberId: string;
  memo: string | null;
  dateCreated: Date;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
