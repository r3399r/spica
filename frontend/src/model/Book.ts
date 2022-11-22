import { Member, ShareMethod, Transaction, ViewBook } from '@y-celestial/spica-service';

export type SavedBook = ViewBook & {
  members: Member[] | null;
  transactions: Transaction[] | null;
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
