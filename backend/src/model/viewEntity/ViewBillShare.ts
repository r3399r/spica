export type ViewBillShare = {
  id: string;
  billId: string;
  ver: string;
  bookId: string;
  date: string;
  type: 'in' | 'out';
  descr: string | null;
  amount: number;
  memo: string | null;
  dateCreated: string;
  dateUpdated: string | null;
  dateDeleted: string | null;
  memberId: string;
  memberAmount: number;
};
