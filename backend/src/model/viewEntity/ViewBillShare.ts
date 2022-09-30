import { BillShareType } from 'src/constant/Book';

export type ViewBillShare = {
  id: string;
  billId: string;
  ver: string;
  memberId: string;
  side: string;
  type: BillShareType;
  value: number;
  takeRemainder: boolean;
  dateCreated: Date;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
  bookId: string;
};
