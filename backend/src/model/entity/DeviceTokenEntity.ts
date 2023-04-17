import { BeforeInsert, Column, Entity, Generated } from 'typeorm';
import { DeviceToken } from './DeviceToken';

@Entity({ name: 'device_token' })
export class DeviceTokenEntity implements DeviceToken {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'device_id' })
  deviceId!: string;

  @Column({ type: 'text' })
  token!: string;

  @Column({ type: 'timestamp', name: 'date_expired' })
  dateExpired!: string;

  @Column({ type: 'timestamp', name: 'date_created', default: null })
  dateCreated!: string;

  @BeforeInsert()
  setDateCreated(): void {
    this.dateCreated = new Date().toISOString();
  }
}
