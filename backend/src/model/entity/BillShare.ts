export type BillShare = {
  id: string;
  billId: string;
  ver: string;
  memberId: string;
  amount: number;
  dateCreated: Date | null;
  dateUpdated: Date | null;
};
