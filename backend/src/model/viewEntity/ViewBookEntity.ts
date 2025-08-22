import { ViewColumn, ViewEntity } from 'typeorm';
import { ViewBook } from './ViewBook';

@ViewEntity({ name: 'v_book' })
export class ViewBookEntity implements ViewBook {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  name!: string;

  @ViewColumn()
  code!: string | null;

  @ViewColumn()
  symbol!: string;

  @ViewColumn({ name: 'date_created' })
  dateCreated!: string;

  @ViewColumn({ name: 'last_date_updated' })
  lastDateUpdated!: string;
}
