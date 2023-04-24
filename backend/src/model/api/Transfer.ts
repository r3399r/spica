import { DeviceToken } from 'src/model/entity/DeviceToken';

export type PostTransferResponse = DeviceToken;

export type PutTransferRequest = {
  token: string;
};
