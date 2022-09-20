export type BillShare = {
  id: string;
  ver: number;
  billId: string;
  memberId: string;
  side: string;
  type: string;
  value: number;
  takeRemainder: boolean;
  dateCreated: Date | null;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
