export type BillShare = {
  id: string;
  billId: string;
  ver: string;
  memberId: string;
  amount: number;
  dateCreated: string | null;
  dateUpdated: string | null;
};
