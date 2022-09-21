export type BillShare = {
  id: string;
  billId: string;
  ver: string;
  memberId: string;
  side: string;
  type: string;
  value: number;
  takeRemainder: boolean;
  dateCreated: Date | null;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
