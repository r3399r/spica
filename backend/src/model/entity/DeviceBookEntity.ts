import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { DeviceBook } from './DeviceBook';

@Entity({ name: 'device_book' })
export class DeviceBookEntity implements DeviceBook {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'device_id' })
  deviceId!: string;

  @Column({ type: 'uuid', name: 'book_id' })
  bookId!: string;

  @Column({ type: 'bool', name: 'show_delete' })
  showDelete!: boolean;

  @Column({ type: 'timestamp', name: 'date_created', default: null })
  dateCreated!: string;

  @Column({ type: 'timestamp', name: 'date_updated', default: null })
  dateUpdated: string | null = null;

  @BeforeInsert()
  setDateCreated(): void {
    this.dateCreated = new Date().toISOString();
  }

  @BeforeUpdate()
  setDateUpdated(): void {
    this.dateUpdated = new Date().toISOString();
  }
}
