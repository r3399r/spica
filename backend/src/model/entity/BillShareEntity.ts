import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { BillShare } from './BillShare';

@Entity({ name: 'bill_share' })
export class BillShareEntity implements BillShare {
  @Column({ primary: true, type: 'bigint' })
  @Generated('rowid')
  id!: string;

  @Column({ type: 'int8', name: 'bill_id' })
  billId!: string;

  @Column({ type: 'int8' })
  ver!: string;

  @Column({ type: 'int8', name: 'member_id' })
  memberId!: string;

  @Column({ type: 'float' })
  amount!: number;

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
