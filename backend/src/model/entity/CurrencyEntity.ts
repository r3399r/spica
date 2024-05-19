import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Currency } from './Currency';

@Entity({ name: 'currency' })
export class CurrencyEntity implements Currency {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'book_id' })
  bookId!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  symbol!: string;

  @Column({ type: 'float', name: 'exchange_rate' })
  exchangeRate!: number | null;

  @Column({ type: 'bool', name: 'is_primary' })
  isPrimary!: boolean;

  @Column({ type: 'bool' })
  deletable!: boolean;

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
