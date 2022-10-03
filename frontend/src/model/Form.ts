export type NewBookForm = { name: string };

export type NewMemberForm = { nickname: string };

export type ShareForm = { code: string };

export type RenameBookForm = { name: string };

export type RenameMemberForm = { nickname: string };

export type AddTransferForm = {
  date: Date;
  amount: string;
  from: string;
  to: string;
  memo: string;
};
