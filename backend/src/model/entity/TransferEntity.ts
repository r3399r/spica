import { BeforeInsert, Column, Entity, Generated } from 'typeorm';
import { Transfer } from './Transfer';

@Entity({ name: 'transfer' })
export class TransferEntity implements Transfer {
  @Column({ primary: true, type: 'bigint' })
  @Generated('rowid')
  id!: string;

  @Column({ type: 'number' })
  amount!: number;

  @Column({ type: 'int8', name: 'src_member_id' })
  srcMemberId!: string;

  @Column({ type: 'int8', name: 'dest_member_id' })
  destMemberId!: string;

  @Column({ type: 'text', default: null })
  memo: string | null = null;

  @Column({ type: 'timestamp', name: 'date_created', default: null })
  dateCreated!: Date;

  @Column({ type: 'timestamp', name: 'date_updated', default: null })
  dateUpdated: Date | null = null;

  @Column({ type: 'timestamp', name: 'date_deleted', default: null })
  dateDeleted: Date | null = null;

  @BeforeInsert()
  setDateCreated(): void {
    this.dateCreated = new Date();
  }
}
