import { PaginationParams } from 'src/celestial-service/model/Pagination';
import { Book } from 'src/model/entity/Book';
import { Member } from 'src/model/entity/Member';
import {
  BillData,
  BookDetail,
  Transaction,
  TransferData,
} from 'src/model/type/Book';
import { ViewDeviceBook } from 'src/model/viewEntity/ViewDeviceBook';

export type GetBookResponse = ViewDeviceBook[];

export type PostBookRequest = {
  name: string;
  symbol?: string;
};

export type PostBookResponse = Book;

export type PutBookRequest = {
  name?: string;
  symbol?: string;
};

export type GetBookIdParams = PaginationParams;

export type GetBookIdResponse = BookDetail;

export type PostBookIdRequest = { code: string };

export type PostBookIdResponse = BookDetail;

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

export type PutBookShowDeleteResponse = ViewDeviceBook;

export type PostBookBillRequest = BillData;

export type PostBookBillResponse = {
  members: Member[];
  transaction: Transaction;
};

export type PutBookBillRequest = BillData;

export type PutBookBillResponse = {
  members: Member[];
  transaction: Transaction;
};

export type DeleteBookBillResponse = {
  members: Member[];
  transaction: Transaction;
};

export type PostBookTransferRequest = TransferData;

export type PostBookTransferResponse = {
  members: Member[];
  transaction: Transaction;
};

export type PutBookTransferRequest = TransferData;

export type PutBookTransferResponse = {
  members: Member[];
  transaction: Transaction;
};

export type DeleteBookTransferResponse = {
  members: Member[];
  transaction: Transaction;
};
