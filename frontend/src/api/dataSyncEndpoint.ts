import {
  PostDataSyncBindRequest,
  PostDataSyncBindResponse,
  PostDataSyncRequest,
  PostDataSyncUnbindResponse,
} from 'src/model/backend/api/DataSync';
import http from 'src/util/http';

const postDataSync = async (data: PostDataSyncRequest, deviceId: string) =>
  await http.post<void, PostDataSyncRequest>('dataSync', {
    data,
    headers: { 'x-api-device': deviceId },
  });

const postDataSyncBind = async (data: PostDataSyncBindRequest, deviceId: string) =>
  await http.post<PostDataSyncBindResponse, PostDataSyncBindRequest>('dataSync/bind', {
    data,
    headers: { 'x-api-device': deviceId },
  });

const postDataSyncUnbind = async (deviceId: string) =>
  await http.post<PostDataSyncUnbindResponse>('dataSync/unbind', {
    headers: { 'x-api-device': deviceId },
  });

export default {
  postDataSync,
  postDataSyncBind,
  postDataSyncUnbind,
};
