export type NewBookForm = { name: string };

export type NewMemberForm = { nickname: string };

export type ShareForm = { code: string };

export type RenameBookForm = { name: string };

export type ReviseSymbolForm = { symbol: string };

export type RenameMemberForm = { nickname: string };

export type TransferForm = {
  date: Date;
  amount: string;
  from: string;
  to: string;
  memo: string;
};

export type BillForm = {
  date: Date;
  type: string;
  descr: string;
  amount: string;
  detail: {
    id: string;
    side: 'former' | 'latter';
    type: 'weight' | 'pct' | 'amount';
    value: string;
  }[];
  memo: string;
};
