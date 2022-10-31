import { Book } from 'src/model/entity/Book';
import { Member } from 'src/model/entity/Member';
import {
  BillData,
  Transaction,
  TransactionBill,
  TransactionTransfer,
  TransferData,
} from 'src/model/type/Book';
import { ViewBook } from 'src/model/viewEntity/ViewBook';

export type GetBookParams = { ids: string };

export type GetBookResponse = ViewBook[];

export type PostBookRequest = {
  name: string;
};

export type PostBookResponse = Book;

export type PutBookRequest = {
  name: string;
};

export type GetBookIdResponse = ViewBook & {
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
  transaction: TransactionBill;
};

export type PutBookBillRequest = BillData;

export type PutBookBillResponse = {
  members: Member[];
  transaction: TransactionBill;
};

export type PostBookTransferRequest = TransferData;

export type PostBookTransferResponse = {
  members: Member[];
  transaction: TransactionTransfer;
};

export type PutBookTransferRequest = TransferData;

export type PutBookTransferResponse = {
  members: Member[];
  transaction: TransactionTransfer;
};
