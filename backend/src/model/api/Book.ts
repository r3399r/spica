import { Book } from 'src/model/entity/Book';
import { BillData, TransferData } from 'src/model/type/Book';

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

export type PostBookBillRequest = BillData;

export type PostBookTransferRequest = TransferData;

export type PutBookBillRequest = BillData;

export type PutBookTransferRequest = TransferData;
