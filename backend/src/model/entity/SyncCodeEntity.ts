import { Column, Entity } from 'typeorm';
import { SyncCode } from './SyncCode';

@Entity({ name: 'sync_code' })
export class SyncCodeEntity implements SyncCode {
  @Column({ primary: true, type: 'text' })
  email!: string;

  @Column({ type: 'text' })
  code!: string;

  @Column({ type: 'text', name: 'device_id' })
  deviceId!: string;

  @Column({ type: 'timestamp', name: 'date_created', default: null })
  dateCreated!: string;
}
