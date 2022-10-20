import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Member } from './Member';

@Entity({ name: 'member' })
export class MemberEntity implements Member {
  @Column({ primary: true, type: 'bigint' })
  @Generated('rowid')
  id!: string;

  @Column({ type: 'int8', name: 'book_id' })
  bookId!: string;

  @Column({ type: 'text' })
  nickname!: string;

  @Column({ type: 'float' })
  total!: number;

  @Column({ type: 'float' })
  balance!: number;

  @Column({ type: 'bool' })
  deletable!: boolean;

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
