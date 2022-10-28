import { ViewColumn, ViewEntity } from 'typeorm';
import { ViewLastUpdate } from './ViewLastUpdate';

@ViewEntity({ name: 'v_last_update' })
export class ViewLastUpdateEntity implements ViewLastUpdate {
  @ViewColumn()
  id!: string;

  @ViewColumn({ name: 'date_last_update' })
  dateLastUpdate!: Date;
}
