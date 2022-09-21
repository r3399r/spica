import { Book } from 'src/model/entity/Book';
import { Member } from 'src/model/entity/Member';
import { Transfer } from 'src/model/entity/Transfer';
import {
  BillData,
  BillTransaction,
  Transaction,
  TransferData,
} from 'src/model/type/Book';

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

export type PostBookBillRequest = BillData;

export type PostBookBillResponse = BillTransaction;

export type PutBookBillRequest = BillData;

export type PutBookBillResponse = BillTransaction;

export type PostBookTransferRequest = TransferData;

export type PostBookTransferResponse = Transfer;

export type PutBookTransferRequest = TransferData;

export type PutBookTransferResponse = Transfer;
