import axios from 'axios';
import { t } from 'i18next';
import { ErrorMessage } from 'src/constant/backend/ErrorMessage';
import {
  PostDataSyncBindRequest,
  PostDataSyncBindResponse,
  PostDataSyncRequest,
  PostDataSyncUnbindResponse,
} from 'src/model/backend/api/DataSync';
import http from 'src/util/http';

const postDataSync = async (data: PostDataSyncRequest, deviceId: string) => {
  try {
    return await http.post<void, PostDataSyncRequest>('dataSync', {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.data.message === ErrorMessage.TOO_FREQUENT)
      alert(t('error.tooFrequent'));
    else alert(t('error.default'));
    throw e;
  }
};

const postDataSyncBind = async (data: PostDataSyncBindRequest, deviceId: string) => {
  try {
    return await http.post<PostDataSyncBindResponse, PostDataSyncBindRequest>('dataSync/bind', {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.data.message === ErrorMessage.INVALID_CODE)
      alert(t('error.invalidCode'));
    else alert(t('error.default'));
    throw e;
  }
};

const postDataSyncUnbind = async (deviceId: string) => {
  try {
    return await http.post<PostDataSyncUnbindResponse>('dataSync/unbind', {
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

export default {
  postDataSync,
  postDataSyncBind,
  postDataSyncUnbind,
};
