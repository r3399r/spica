import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { ShareMethod } from 'src/constant/Book';
import { BillShare } from './BillShare';

@Entity({ name: 'bill_share' })
export class BillShareEntity implements BillShare {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'bill_id' })
  billId!: string;

  @Column({ type: 'int8' })
  ver!: string;

  @Column({ type: 'uuid', name: 'member_id' })
  memberId!: string;

  @Column({ type: 'text' })
  method!: ShareMethod;

  @Column({ type: 'float' })
  value: number | null = null;

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
