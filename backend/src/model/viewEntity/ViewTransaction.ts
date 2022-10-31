export type ViewTransaction = {
  id: string;
  ver: string;
  bookId: string;
  date: string;
  type: 'in' | 'out' | 'transfer';
  descr: string | null;
  amount: number;
  shareMemberId: string | null;
  shareCount: string | null;
  srcMemberId: string | null;
  dstMemberId: string | null;
  memo: string | null;
  dateCreated: string;
  dateUpdated: string | null;
  dateDeleted: string | null;
};

export type ViewTransactionBill = {
  id: string;
  ver: string;
  bookId: string;
  date: string;
  type: 'in' | 'out';
  descr: string;
  amount: number;
  shareMemberId: string;
  shareCount: string;
  srcMemberId: null;
  dstMemberId: null;
  memo: string | null;
  dateCreated: string;
  dateUpdated: string | null;
  dateDeleted: string | null;
};

export type ViewTransactionTransfer = {
  id: string;
  ver: string;
  bookId: string;
  date: string;
  type: 'transfer';
  descr: null;
  amount: number;
  shareMemberId: null;
  shareCount: null;
  srcMemberId: string;
  dstMemberId: string;
  memo: string | null;
  dateCreated: string;
  dateUpdated: string | null;
  dateDeleted: string | null;
};
