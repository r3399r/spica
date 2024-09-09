import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { EmailBind } from './EmailBind';

@Entity({ name: 'email_bind' })
export class EmailBindEntity implements EmailBind {
  @Column({ primary: true, type: 'text' })
  email!: string;

  @Column({ type: 'text', name: 'device_id' })
  deviceId!: string;

  @Column({ type: 'text' })
  code!: string;

  @Column({ type: 'timestamp', name: 'code_generated' })
  codeGenerated!: string;

  @Column({ type: 'int8' })
  count!: string;

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
