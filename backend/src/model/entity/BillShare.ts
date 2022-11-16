import { ShareMethod } from 'src/constant/Book';

export type BillShare = {
  id: string;
  billId: string;
  ver: string;
  memberId: string;
  method: ShareMethod;
  value: number | null;
  amount: number;
  dateCreated: string | null;
  dateUpdated: string | null;
};
