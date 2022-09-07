export type BillShare = {
  id: string;
  ver: number;
  billId: string;
  memberId: string;
  amount: number;
  dateCreated: Date | null;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
