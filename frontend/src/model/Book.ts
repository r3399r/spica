import { Member, ShareMethod, Transaction, ViewBook } from '@y-celestial/spica-service';

export type SavedBook = ViewBook & {
  members: Member[] | null;
  transactions: Transaction[] | null;
  txCount: number | null;
};

export type LocalBook = {
  id: string;
  code: string;
  showDeleted: boolean;
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
