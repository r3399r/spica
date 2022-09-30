import { BillShareType } from 'src/constant/Book';

export type BillShare = {
  id: string;
  billId: string;
  ver: string;
  memberId: string;
  side: string;
  type: BillShareType;
  value: number;
  takeRemainder: boolean;
  dateCreated: Date | null;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
