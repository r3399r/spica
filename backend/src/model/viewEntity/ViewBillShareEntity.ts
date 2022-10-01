import { ViewColumn, ViewEntity } from 'typeorm';
import { BillShareType } from 'src/constant/Book';
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
  side!: string;

  @ViewColumn()
  type!: BillShareType;

  @ViewColumn()
  value!: number;

  @ViewColumn({ name: 'take_remainder' })
  takeRemainder!: boolean;

  @ViewColumn({ name: 'date_created' })
  dateCreated!: Date;

  @ViewColumn({ name: 'date_updated' })
  dateUpdated: Date | null = null;

  @ViewColumn({ name: 'book_id' })
  bookId!: string;
}
