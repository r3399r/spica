import { ShareMethod } from 'src/constant/backend/Book';
import { Currency } from './backend/entity/Currency';
import { Member } from './backend/entity/Member';
import { BookDetail, Transaction } from './backend/type/Book';

export type SavedBook = Omit<BookDetail, 'members' | 'transactions' | 'currencies'> & {
  showDelete: boolean;
  members: Member[] | null;
  transactions: Transaction[] | null;
  queriedTransactions?: Transaction[];
  currencies: Currency[] | null;
  txCount: number | null;
};

export type Detail = {
  id: string;
  method: ShareMethod;
  value: number;
};

export type MemberFormer = {
  id: string;
  checked: boolean;
  nickname: string;
  amount: string;
  customAmount: boolean;
};

export type MemberLatter = {
  id: string;
  checked: boolean;
  nickname: string;
  method: ShareMethod;
  value: string | null;
  amount: string;
  customAmount: boolean;
};

export type MemberAdjust = {
  id: string;
  checked: boolean;
  nickname: string;
  value: string;
  amount: string;
};

export type Check = {
  former: Member;
  latter: Member;
  amount: number;
};
