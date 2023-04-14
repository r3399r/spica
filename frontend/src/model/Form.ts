import { ShareDetail } from './backend/type/Book';

export type LanguageForm = { language: string };

export type NewBookForm = { bookName: string; nickname: string };

export type NewMemberForm = { nickname: string };

export type ShareForm = { code: string };

export type RenameBookForm = { name: string };

export type ReviseSymbolForm = { symbol: string };

export type RenameMemberForm = { nickname: string };

export type BillForm = {
  date: string;
  type: 'in' | 'out';
  descr: string;
  amount: number;
  former: ShareDetail[];
  latter: ShareDetail[];
  memo?: string;
};

export type TransferForm = {
  date: string;
  amount: number;
  srcMemberId: string;
  dstMemberId: string;
  memo?: string;
};

export type SplitForm = {
  value: string;
};

export type FriendForm = {
  id: string;
};
