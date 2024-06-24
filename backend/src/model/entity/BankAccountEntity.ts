import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { BankAccount } from './BankAccount';

@Entity({ name: 'bank_account' })
export class BankAccountEntity implements BankAccount {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'device_id' })
  deviceId!: string;

  @Column({ type: 'text', name: 'bank_code' })
  bankCode!: string;

  @Column({ type: 'text', name: 'account_number' })
  accountNumber!: string;

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
