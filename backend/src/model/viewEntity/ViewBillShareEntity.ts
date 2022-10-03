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

  @ViewColumn({ name: 'member_id' })
  memberId!: string;

  @ViewColumn()
  amount!: number;

  @ViewColumn({ name: 'date_created' })
  dateCreated!: Date;

  @ViewColumn({ name: 'date_updated' })
  dateUpdated: Date | null = null;

  @ViewColumn({ name: 'book_id' })
  bookId!: string;
}
