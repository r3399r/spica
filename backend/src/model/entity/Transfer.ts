export type Transfer = {
  id: string;
  ver: string;
  bookId: string;
  date: Date;
  amount: number;
  srcMemberId: string;
  dstMemberId: string;
  memo: string | null;
  dateCreated: Date | null;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
