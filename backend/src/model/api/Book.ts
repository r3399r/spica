import { Bill } from 'src/model/entity/Bill';
import { BillShare } from 'src/model/entity/BillShare';
import { Book } from 'src/model/entity/Book';
import { Member } from 'src/model/entity/Member';
import { Transfer } from 'src/model/entity/Transfer';
import { BillData, TransferData } from 'src/model/type/Book';

export type PostBookRequest = {
  name: string;
};

export type PostBookResponse = Book;

export type PutBookRequest = {
  name: string;
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

export type PostBookBillResponse = Bill & { detail: BillShare[] };

export type PutBookBillRequest = BillData;

export type PutBookBillResponse = Bill & { detail: BillShare[] };

export type PostBookTransferRequest = TransferData;

export type PostBookTransferResponse = Transfer;

export type PutBookTransferRequest = TransferData;

export type PutBookTransferResponse = Transfer;
