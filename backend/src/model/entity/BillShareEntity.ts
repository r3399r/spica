import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { BillShareType } from 'src/constant/Book';
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

  @Column({ type: 'text' })
  side!: string;

  @Column({ type: 'text' })
  type!: BillShareType;

  @Column({ type: 'float' })
  value!: number;

  @Column({ type: 'bool', name: 'take_remainder' })
  takeRemainder!: boolean;

  @Column({ type: 'timestamp', name: 'date_created', default: null })
  dateCreated!: Date;

  @Column({ type: 'timestamp', name: 'date_updated', default: null })
  dateUpdated: Date | null = null;

  @BeforeInsert()
  setDateCreated(): void {
    this.dateCreated = new Date();
  }

  @BeforeUpdate()
  setDateUpdated(): void {
    this.dateUpdated = new Date();
  }
}
