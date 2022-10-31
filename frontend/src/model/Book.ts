import { Transaction } from '@y-celestial/spica-service';
import { Member } from '@y-celestial/spica-service/lib/src/model/entity/Member';
import { ViewBook } from '@y-celestial/spica-service/lib/src/model/viewEntity/ViewBook';

export type SavedBook = ViewBook & {
  members: Member[] | null;
  transactions: Transaction[] | null;
};
