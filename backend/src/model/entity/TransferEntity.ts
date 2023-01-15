import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Transfer } from './Transfer';

@Entity({ name: 'transfer' })
export class TransferEntity implements Transfer {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ primary: true, type: 'int8' })
  ver!: string;

  @Column({ type: 'uuid', name: 'book_id' })
  bookId!: string;

  @Column({ type: 'timestamp' })
  date!: string;

  @Column({ type: 'float' })
  amount!: number;

  @Column({ type: 'uuid', name: 'src_member_id' })
  srcMemberId!: string;

  @Column({ type: 'uuid', name: 'dst_member_id' })
  dstMemberId!: string;

  @Column({ type: 'text', default: null })
  memo: string | null = null;

  @Column({ type: 'timestamp', name: 'date_created', default: null })
  dateCreated!: string;

  @Column({ type: 'timestamp', name: 'date_updated', default: null })
  dateUpdated: string | null = null;

  @Column({ type: 'timestamp', name: 'date_deleted', default: null })
  dateDeleted: string | null = null;

  @BeforeInsert()
  setDateCreated(): void {
    this.dateCreated = new Date().toISOString();
  }

  @BeforeUpdate()
  setDateUpdated(): void {
    this.dateUpdated = new Date().toISOString();
  }
}
