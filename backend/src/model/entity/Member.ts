export type Member = {
  id: string;
  bookId: string;
  nickname: string;
  deviceId: string | null;
  total: number;
  balance: number;
  deletable: boolean;
  visible: boolean;
  dateCreated: string | null;
  dateUpdated: string | null;
};
