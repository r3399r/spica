export type Currency = {
  id: string;
  bookId: string;
  name: string;
  symbol: string;
  exchangeRate: number|null;
  isPrimary: boolean;
  deletable: boolean;
  dateCreated: string | null;
  dateUpdated: string | null;
};
