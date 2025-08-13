import { Book } from 'src/model/entity/Book';
import { Currency } from 'src/model/entity/Currency';
import { Member } from 'src/model/entity/Member';
import { PaginationParams } from 'src/model/Pagination';
import {
  BillData,
  BookDetail,
  Transaction,
  TransferData,
} from 'src/model/type/Book';
import { ViewDeviceBook } from 'src/model/viewEntity/ViewDeviceBook';

export type GetBookResponse = ViewDeviceBook[];

export type PostBookRequest = {
  bookName: string;
  nickname?: string;
};

export type PostBookResponse = Book;

export type PutBookRequest = {
  name?: string;
  symbol?: string;
};

export type GetBookIdParams = PaginationParams;

export type GetBookIdResponse = BookDetail;

export type PostBookIdRequest = { email: string };

export type PostBookIdInviteRequest = { email: string; language: string };

export type PutBookResponse = Book;

export type PostBookMemberRequest = {
  nickname: string;
};

export type PostBookMemberResponse = Member;

export type PutBookMemberRequest = {
  nickname: string;
};

export type PutBookMemberResponse = Member;

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

export type PostBookCurrencyRequest = {
  name: string;
  symbol: string;
  exchangeRate: number;
};

export type PostBookCurrencyResponse = Currency;

export type PutBookCurrencyRequest = {
  name: string;
  symbol: string;
  exchangeRate?: number;
};

export type PutBookCurrencyResponse = {
  currency: Currency;
  members: Member[];
};

export type PutBookCurrencyPrimaryResponse = {
  currencies: Currency[];
  members: Member[];
};

export type GetBookIdSearchParams = {
  q: string;
};

export type GetBookIdSearchResponse = Transaction[];
