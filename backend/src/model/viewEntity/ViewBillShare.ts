export type ViewBillShare = {
  id: string;
  billId: string;
  ver: string;
  memberId: string;
  amount: number;
  dateCreated: Date;
  dateUpdated: Date | null;
  bookId: string;
};
