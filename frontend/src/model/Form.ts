export type NewBookForm = { name: string };

export type NewMemberForm = { nickname: string };

export type ShareForm = { code: string };

export type RenameBookForm = { name: string };

export type ReviseSymbolForm = { symbol: string };

export type RenameMemberForm = { nickname: string };

export type BillForm = {
  date: string;
  descr: string;
  amount: string;
  memo: string;
};

export type TransferForm = {
  date: Date;
  amount: string;
  from: string;
  to: string;
  memo: string;
};
