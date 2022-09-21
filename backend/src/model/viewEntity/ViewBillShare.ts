export type ViewBillShare = {
  id: string;
  billId: string;
  ver: string;
  memberId: string;
  side: string;
  type: string;
  value: number;
  takeRemainder: boolean;
  dateCreated: Date;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
  bookId: string;
};
