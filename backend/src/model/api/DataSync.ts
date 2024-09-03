export type PostDataSyncRequest = {
  email: string;
  language: string;
};

export type PostDataSyncBindRequest = {
  email: string;
  code: string;
};

export type PostDataSyncBindResponse = {
  newDeviceId: string;
};

export type PostDataSyncUnbindResponse = {
  newDeviceId: string;
};
