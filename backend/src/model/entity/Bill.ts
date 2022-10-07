import { BillType } from 'src/constant/Book';

export type Bill = {
  id: string;
  ver: string;
  bookId: string;
  date: Date;
  type: BillType;
  descr: string;
  amount: number;
  memo: string | null;
  dateCreated: Date | null;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
