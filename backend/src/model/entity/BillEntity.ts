import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Bill } from './Bill';

@Entity({ name: 'bill' })
export class BillEntity implements Bill {
  @Column({ primary: true, type: 'bigint' })
  @Generated('rowid')
  id!: string;

  @Column({ primary: true, type: 'int8' })
  ver!: number;

  @Column({ type: 'int8', name: 'book_id' })
  bookId!: string;

  @Column({ type: 'timestamp' })
  date!: Date;

  @Column({ type: 'text' })
  type!: string;

  @Column({ type: 'text' })
  descr!: string;

  @Column({ type: 'float' })
  amount!: number;

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

  @BeforeUpdate()
  setDateUpdated(): void {
    this.dateUpdated = new Date();
  }
}
