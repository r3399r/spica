import { ShareDetail } from './backend/type/Book';

export type LanguageForm = { language: string };

export type NewBookForm = { bookName: string; nickname: string };

export type NewMemberForm = { nickname: string };

export type ShareForm = { code: string };

export type RenameBookForm = { name: string };

export type CreateCurrencyForm = { name: string; symbol: string; exchangeRate: string };

export type RenameMemberForm = { nickname: string };

export type BillForm = {
  date: string;
  type: 'in' | 'out';
  descr: string;
  currencyId: string;
  amount: number;
  former: ShareDetail[];
  latter: ShareDetail[];
  memo?: string;
};

export type TransferForm = {
  date: string;
  currencyId: string;
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

export type DataTransferForm = {
  token: string;
};

export type MemberSelectForm = {
  id: string;
};

export type CurrencySelectForm = {
  id: string;
};
