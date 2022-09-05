export type Bill = {
  id: string;
  descr: string;
  memo: string | null;
  dateCreated: Date | null;
  dateUpdated: Date | null;
  dateDeleted: Date | null;
};
