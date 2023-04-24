import { ShareMethod } from 'src/constant/backend/Book';
import { Member } from './backend/entity/Member';
import { Transaction } from './backend/type/Book';
import { ViewBook } from './backend/viewEntity/ViewBook';

export type SavedBook = ViewBook & {
  showDelete: boolean;
  members: Member[] | null;
  transactions: Transaction[] | null;
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
