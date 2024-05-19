import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { MemberSettlement } from './MemberSettlement';

@Entity({ name: 'member_settlement' })
export class MemberSettlementEntity implements MemberSettlement {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'member_id' })
  memberId!: string;

  @Column({ type: 'uuid', name: 'currency_id' })
  currencyId!: string;

  @Column({ type: 'float' })
  balance!: number;

  @Column({ type: 'float' })
  total!: number;

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
