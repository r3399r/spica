import { Bank } from 'src/model/entity/Bank';
import { BankAccount } from 'src/model/entity/BankAccount';

export type PostBankAccountRequest = {
  bankCode: string;
  accountNumber: string;
};

export type PostBankAccountResponse = BankAccount[];

export type GetBankAccountResponse = BankAccount[];

export type PutBankAccountRequest = {
  bankCode?: string;
  accountNumber?: string;
};

export type PutBankAccountResponse = BankAccount[];

export type DeleteBankAccountResponse = BankAccount[];

export type GetBankAccountBankResponse = Bank[];
