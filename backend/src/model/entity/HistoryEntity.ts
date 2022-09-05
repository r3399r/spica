import { BeforeInsert, Column, Entity, Generated } from 'typeorm';
import { Type } from 'src/constant/History';
import { History } from './History';

@Entity({ name: 'history' })
export class HistoryEntity implements History {
  @Column({ primary: true, type: 'bigint' })
  @Generated('rowid')
  id!: string;

  @Column({ type: 'int8', name: 'bill_id' })
  billId!: string;

  @Column({ type: 'text' })
  type!: Type;

  @Column({ type: 'timestamp', name: 'date_created', default: null })
  dateCreated!: Date;

  @BeforeInsert()
  setDateCreated(): void {
    this.dateCreated = new Date();
  }
}
