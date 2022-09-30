export type Member = {
  id: string;
  bookId: string;
  nickname: string;
  balance: number;
  deletable: boolean;
  dateCreated: Date | null;
  dateUpdated: Date | null;
};
