export type MemberSettlement = {
  id: string;
  memberId: string;
  currencyId: string;
  balance: number;
  total: number;
  dateCreated: string | null;
  dateUpdated: string | null;
};
