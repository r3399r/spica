import { ViewColumn, ViewEntity } from 'typeorm';
import { ViewDeviceBook } from './ViewDeviceBook';

@ViewEntity({ name: 'v_device_book' })
export class ViewDeviceBookEntity implements ViewDeviceBook {
  @ViewColumn()
  id!: string;

  @ViewColumn({ name: 'device_id' })
  deviceId!: string;

  @ViewColumn({ name: 'book_id' })
  bookId!: string;

  @ViewColumn()
  name!: string;

  @ViewColumn()
  code!: string;

  @ViewColumn()
  symbol!: string;

  @ViewColumn({ name: 'date_created' })
  dateCreated!: string;

  @ViewColumn({ name: 'last_date_updated' })
  lastDateUpdated!: string;
}
