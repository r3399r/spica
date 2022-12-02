import { ViewColumn, ViewEntity } from 'typeorm';
import { ViewTransaction } from './ViewTransaction';

@ViewEntity({ name: 'v_transaction' })
export class ViewTransactionEntity implements ViewTransaction {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  type!: 'transfer' | 'bill';

  @ViewColumn({ name: 'book_id' })
  bookId!: string;

  @ViewColumn()
  date!: string;
}
