import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { BillType } from 'src/constant/Book';
import { Bill } from './Bill';

@Entity({ name: 'bill' })
export class BillEntity implements Bill {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ primary: true, type: 'int8' })
  ver!: string;

  @Column({ type: 'uuid', name: 'book_id' })
  bookId!: string;

  @Column({ type: 'timestamp' })
  date!: string;

  @Column({ type: 'text' })
  type!: BillType;

  @Column({ type: 'text' })
  descr!: string;

  @Column({ type: 'uuid', name: 'currency_id' })
  currencyId!: string;

  @Column({ type: 'float' })
  amount!: number;

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
