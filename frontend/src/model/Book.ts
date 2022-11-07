import { Member, Transaction, ViewBook } from '@y-celestial/spica-service';

export type SavedBook = ViewBook & {
  members: Member[] | null;
  transactions: Transaction[] | null;
};