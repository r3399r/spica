import axios from 'axios';
import { t } from 'i18next';
import { ErrorMessage } from 'src/constant/backend/ErrorMessage';
import {
  DeleteBookBillResponse,
  DeleteBookTransferResponse,
  GetBookIdParams,
  GetBookIdResponse,
  GetBookResponse,
  PostBookBillRequest,
  PostBookBillResponse,
  PostBookCurrencyRequest,
  PostBookCurrencyResponse,
  PostBookIdInviteRequest,
  PostBookIdRequest,
  PostBookMemberRequest,
  PostBookMemberResponse,
  PostBookRequest,
  PostBookResponse,
  PostBookTransferRequest,
  PostBookTransferResponse,
  PutBookBillRequest,
  PutBookBillResponse,
  PutBookCurrencyPrimaryResponse,
  PutBookCurrencyRequest,
  PutBookCurrencyResponse,
  PutBookMemberRequest,
  PutBookMemberResponse,
  PutBookRequest,
  PutBookResponse,
  PutBookShowDeleteResponse,
  PutBookTransferRequest,
  PutBookTransferResponse,
} from 'src/model/backend/api/Book';
import http from 'src/util/http';

const getBook = async (deviceId: string) => {
  try {
    return await http.get<GetBookResponse>('book', { headers: { 'x-api-device': deviceId } });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const postBook = async (data: PostBookRequest, deviceId: string) => {
  try {
    return await http.post<PostBookResponse>('book', {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const getBookId = async (id: string, deviceId: string, params?: GetBookIdParams) => {
  try {
    return await http.get<GetBookIdResponse>(`book/${id}`, {
      headers: { 'x-api-device': deviceId },
      params,
    });
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.data.message === ErrorMessage.BOOK_NOT_FOUND)
      alert(t('error.bookNotFound'));
    else alert(t('error.default'));
    throw e;
  }
};

const postBookId = async (id: string, deviceId: string, data: PostBookIdRequest) => {
  try {
    return await http.post<void, PostBookIdRequest>(`book/${id}`, {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.data.message === ErrorMessage.INVALID_EMAIL)
      throw ErrorMessage.INVALID_EMAIL;
    else alert(t('error.default'));
    throw e;
  }
};

const postBookIdInvite = async (id: string, deviceId: string, data: PostBookIdInviteRequest) => {
  try {
    return await http.post<void, PostBookIdInviteRequest>(`book/${id}/invite`, {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const putBookId = async (id: string, data: PutBookRequest, deviceId: string) => {
  try {
    return await http.put<PutBookResponse>(`book/${id}`, {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const deleteBookId = async (id: string, deviceId: string) => {
  try {
    return await http.delete(`book/${id}`, { headers: { 'x-api-device': deviceId } });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const postBookIdBill = async (id: string, data: PostBookBillRequest, deviceId: string) => {
  try {
    return await http.post<PostBookBillResponse>(`book/${id}/bill`, {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const putBookIdBill = async (
  id: string,
  bid: string,
  data: PutBookBillRequest,
  deviceId: string,
) => {
  try {
    return await http.put<PutBookBillResponse>(`book/${id}/bill/${bid}`, {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const deleteBookIdBill = async (id: string, bid: string, deviceId: string) => {
  try {
    return await http.delete<DeleteBookBillResponse>(`book/${id}/bill/${bid}`, {
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const postBookIdMember = async (id: string, data: PostBookMemberRequest, deviceId: string) => {
  try {
    return await http.post<PostBookMemberResponse>(`book/${id}/member`, {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const putBookIdMember = async (
  id: string,
  mid: string,
  data: PutBookMemberRequest,
  deviceId: string,
) => {
  try {
    return await http.put<PutBookMemberResponse>(`book/${id}/member/${mid}`, {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const deleteBookIdMember = async (id: string, mid: string, deviceId: string) => {
  try {
    return await http.delete(`book/${id}/member/${mid}`, {
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const putBookIdMemberSelf = async (id: string, mid: string, deviceId: string) => {
  try {
    return await http.put<PutBookMemberResponse>(`book/${id}/member/${mid}/self`, {
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const putBookIdShowDelete = async (id: string, deviceId: string) => {
  try {
    return await http.put<PutBookShowDeleteResponse>(`book/${id}/showDelete`, {
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const postBookIdTransfer = async (id: string, data: PostBookTransferRequest, deviceId: string) => {
  try {
    return await http.post<PostBookTransferResponse>(`book/${id}/transfer`, {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const putBookIdTransfer = async (
  id: string,
  tid: string,
  data: PutBookTransferRequest,
  deviceId: string,
) => {
  try {
    return await http.put<PutBookTransferResponse>(`book/${id}/transfer/${tid}`, {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const deleteBookIdTransfer = async (id: string, tid: string, deviceId: string) => {
  try {
    return await http.delete<DeleteBookTransferResponse>(`book/${id}/transfer/${tid}`, {
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const postBookIdCurrency = async (id: string, data: PostBookCurrencyRequest, deviceId: string) => {
  try {
    return await http.post<PostBookCurrencyResponse>(`book/${id}/currency`, {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const putBookIdCurrency = async (
  id: string,
  cid: string,
  data: PutBookCurrencyRequest,
  deviceId: string,
) => {
  try {
    return await http.put<PutBookCurrencyResponse>(`book/${id}/currency/${cid}`, {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const deleteBookIdCurrency = async (id: string, cid: string, deviceId: string) => {
  try {
    return await http.delete(`book/${id}/currency/${cid}`, {
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const putBookIdCurrencyPrimary = async (id: string, cid: string, deviceId: string) => {
  try {
    return await http.put<PutBookCurrencyPrimaryResponse>(`book/${id}/currency/${cid}/primary`, {
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

export default {
  getBook,
  postBook,
  getBookId,
  postBookId,
  postBookIdInvite,
  putBookId,
  deleteBookId,
  postBookIdBill,
  putBookIdBill,
  deleteBookIdBill,
  postBookIdMember,
  putBookIdMember,
  deleteBookIdMember,
  putBookIdMemberSelf,
  putBookIdShowDelete,
  postBookIdTransfer,
  putBookIdTransfer,
  deleteBookIdTransfer,
  postBookIdCurrency,
  putBookIdCurrency,
  deleteBookIdCurrency,
  putBookIdCurrencyPrimary,
};
