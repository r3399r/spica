export type Transfer = {
  id: string;
  amount: number;
  srcMemberId: string;
  destMemberId: string;
  memo: string | null;
  dateCreated: Date | null;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
