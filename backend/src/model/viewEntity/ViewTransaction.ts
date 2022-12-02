export type ViewTransaction = {
  id: string;
  type: 'transfer' | 'bill';
  bookId: string;
  date: string;
};
