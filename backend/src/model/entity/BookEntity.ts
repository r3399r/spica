import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Book } from './Book';

@Entity({ name: 'book' })
export class BookEntity implements Book {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'text', default: null })
  code: string | null = null;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  symbol!: string;

  @Column({ type: 'bool', name: 'is_pro', default: false })
  isPro: boolean = false;

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
