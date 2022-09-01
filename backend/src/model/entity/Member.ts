export type Member = {
  id: string;
  bookId: string;
  nickname: string;
  deletable: boolean;
  dateCreated: Date | null;
  dateUpdated: Date | null;
};
