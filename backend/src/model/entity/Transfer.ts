export type Transfer = {
  id: string;
  ver: string;
  bookId: string;
  date: string;
  amount: number;
  srcMemberId: string;
  dstMemberId: string;
  memo: string | null;
  dateCreated: string | null;
  dateUpdated: string | null;
  dateDeleted: string | null;
};
