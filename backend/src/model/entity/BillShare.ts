export type BillShare = {
  id: string;
  billId: string;
  memberId: string;
  amount: number;
  dateCreated: Date | null;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
