import { Currency } from './Currency';

export type MemberSettlement = {
  id: string;
  memberId: string;
  currencyId: string;
  currency: Currency;
  balance: number;
  total: number;
  dateCreated: string | null;
  dateUpdated: string | null;
};
