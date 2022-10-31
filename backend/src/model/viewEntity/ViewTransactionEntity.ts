import { ViewColumn, ViewEntity } from 'typeorm';
import { ViewTransaction } from './ViewTransaction';

@ViewEntity({ name: 'v_transaction' })
export class ViewTransactionEntity implements ViewTransaction {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  ver!: string;

  @ViewColumn({ name: 'book_id' })
  bookId!: string;

  @ViewColumn()
  date!: string;

  @ViewColumn()
  type!: 'in' | 'out' | 'transfer';

  @ViewColumn()
  descr: string | null = null;

  @ViewColumn()
  amount!: number;

  @ViewColumn({ name: 'share_member_id' })
  shareMemberId: string | null = null;

  @ViewColumn({ name: 'share_count' })
  shareCount: string | null = null;

  @ViewColumn({ name: 'src_member_id' })
  srcMemberId: string | null = null;

  @ViewColumn({ name: 'dst_member_id' })
  dstMemberId: string | null = null;

  @ViewColumn()
  memo: string | null = null;

  @ViewColumn({ name: 'date_created' })
  dateCreated!: string;

  @ViewColumn({ name: 'date_updated' })
  dateUpdated: string | null = null;

  @ViewColumn({ name: 'date_deleted' })
  dateDeleted: string | null = null;
}
