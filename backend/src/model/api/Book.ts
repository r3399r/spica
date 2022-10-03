import { Book } from 'src/model/entity/Book';
import { Member } from 'src/model/entity/Member';
import {
  BillData,
  BillTransaction,
  Transaction,
  TransferData,
  TransferTransaction,
} from 'src/model/type/Book';

export type GetBookParams = { ids: string };

export type GetBookResponse = Book[];

export type PostBookRequest = {
  name: string;
};

export type PostBookResponse = Book;

export type PutBookRequest = {
  name: string;
};

export type GetBookIdResponse = Book & {
  members: Member[];
  transactions: Transaction[];
};

export type PutBookResponse = Book;

export type PostBookMemberRequest = {
  nickname: string;
};

export type PostBookMemberResponse = Member;

export type PutBookMemberRequest = {
  nickname: string;
};

export type PutBookMemberResponse = Member;

export type GetBookNameResponse = {
  id: string;
  name: string;
};

export type PostBookBillRequest = BillData;

export type PostBookBillResponse = {
  members: Member[];
  transaction: BillTransaction;
};

export type PutBookBillRequest = BillData;

export type PutBookBillResponse = {
  members: Member[];
  transaction: BillTransaction;
};

export type PostBookTransferRequest = TransferData;

export type PostBookTransferResponse = {
  members: Member[];
  transaction: TransferTransaction;
};

export type PutBookTransferRequest = TransferData;

export type PutBookTransferResponse = {
  members: Member[];
  transaction: TransferTransaction;
};
