import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Member } from './Member';

@Entity({ name: 'member' })
export class MemberEntity implements Member {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'book_id' })
  bookId!: string;

  @Column({ type: 'text' })
  nickname!: string;

  @Column({ type: 'uuid', name: 'device_id' })
  deviceId!: string;

  @Column({ type: 'float' })
  total!: number;

  @Column({ type: 'float' })
  balance!: number;

  @Column({ type: 'bool' })
  deletable!: boolean;

  @Column({ type: 'bool' })
  visible!: boolean;

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
