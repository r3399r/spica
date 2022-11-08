import { ViewColumn, ViewEntity } from 'typeorm';
import { ViewBillShare } from './ViewBillShare';

@ViewEntity({ name: 'v_bill_share' })
export class ViewBillShareEntity implements ViewBillShare {
  @ViewColumn()
  id!: string;

  @ViewColumn({ name: 'bill_id' })
  billId!: string;

  @ViewColumn()
  ver!: string;

  @ViewColumn({ name: 'book_id' })
  bookId!: string;

  @ViewColumn()
  date!: string;

  @ViewColumn()
  type!: 'in' | 'out';

  @ViewColumn()
  descr: string | null = null;

  @ViewColumn()
  amount!: number;

  @ViewColumn()
  memo: string | null = null;

  @ViewColumn({ name: 'date_created' })
  dateCreated!: string;

  @ViewColumn({ name: 'date_updated' })
  dateUpdated: string | null = null;

  @ViewColumn({ name: 'date_deleted' })
  dateDeleted: string | null = null;

  @ViewColumn({ name: 'member_id' })
  memberId!: string;

  @ViewColumn({ name: 'member_amount' })
  memberAmount!: number;
}
