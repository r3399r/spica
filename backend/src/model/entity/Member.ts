export type Member = {
  id: string;
  bookId: string;
  nickname: string;
  total: number;
  balance: number;
  deletable: boolean;
  dateCreated: string | null;
  dateUpdated: string | null;
};
