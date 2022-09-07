import { Book } from 'src/model/entity/Book';

export type PostBookRequest = {
  name: string;
};

export type PostBookResponse = Book;

export type PutBookRequest = {
  name: string;
};

export type PostBookMemberRequest = {
  nickname: string;
};

export type PutBookMemberRequest = {
  nickname: string;
};

export type PostBookBillRequest = {
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

export type PostBookTransferRequest = {
  date: string;
  type: 'transfer';
  amount: number;
  srcMemberId: string;
  dstMmeberId: string;
  memo?: string;
};
