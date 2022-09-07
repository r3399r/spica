export type Transfer = {
  id: string;
  ver: number;
  bookId: string;
  date: Date;
  srcMemberId: string;
  dstMemberId: string;
  memo: string | null;
  dateCreated: Date | null;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
