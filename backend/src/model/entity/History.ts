import { Type } from 'src/constant/History';

export type History = {
  id: string;
  billId: string;
  type: Type;
  dateCreated: Date | null;
};
