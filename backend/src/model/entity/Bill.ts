export type Bill = {
  id: string;
  ver: number;
  bookId: string;
  date: Date;
  descr: string;
  memo: string | null;
  dateCreated: Date | null;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
