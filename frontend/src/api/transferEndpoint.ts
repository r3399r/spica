import { PostTransferResponse, PutTransferRequest } from 'src/model/backend/api/Transfer';
import http from 'src/util/http';

const postTransfer = async (deviceId: string) =>
  await http.post<PostTransferResponse>('transfer', { headers: { 'x-api-device': deviceId } });

const putTransfer = async (data: PutTransferRequest, deviceId: string) =>
  await http.put<void>('transfer', { data, headers: { 'x-api-device': deviceId } });

export default {
  postTransfer,
  putTransfer,
};
