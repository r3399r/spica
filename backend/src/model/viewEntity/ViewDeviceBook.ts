export type ViewDeviceBook = {
  id: string;
  deviceId: string;
  bookId: string;
  name: string;
  code: string;
  symbol: string;
  showDelete: boolean;
  dateCreated: string | null;
  lastDateUpdated: string;
};
