import { ViewColumn, ViewEntity } from 'typeorm';
import { BillType, ShareMethod } from 'src/constant/Book';
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
  type!: BillType;

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

  @ViewColumn()
  method!: ShareMethod;

  @ViewColumn()
  value: number | null = null;

  @ViewColumn({ name: 'member_amount' })
  memberAmount!: number;
}
