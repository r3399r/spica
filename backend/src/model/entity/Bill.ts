import { BillType } from 'src/constant/Book';

export type Bill = {
  id: string;
  ver: string;
  bookId: string;
  date: string;
  type: BillType;
  descr: string;
  amount: number;
  memo: string | null;
  dateCreated: string | null;
  dateUpdated: string | null;
  dateDeleted: string | null;
};
