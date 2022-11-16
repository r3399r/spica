import { BillType, ShareMethod } from 'src/constant/Book';

export type ViewBillShare = {
  id: string;
  billId: string;
  ver: string;
  bookId: string;
  date: string;
  type: BillType;
  descr: string | null;
  amount: number;
  memo: string | null;
  dateCreated: string | null;
  dateUpdated: string | null;
  dateDeleted: string | null;
  memberId: string;
  method: ShareMethod;
  value: number | null;
  memberAmount: number;
};
