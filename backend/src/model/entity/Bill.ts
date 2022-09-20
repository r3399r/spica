export type Bill = {
  id: string;
  ver: number;
  bookId: string;
  date: Date;
  type: string;
  descr: string;
  amount: number;
  memo: string | null;
  dateCreated: Date | null;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
