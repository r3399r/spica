export type ViewDeviceBook = {
  id: string;
  deviceId: string;
  bookId: string;
  name: string;
  code: string;
  symbol: string;
  isPro: boolean;
  showDelete: boolean;
  dateCreated: string | null;
  lastDateUpdated: string;
};
