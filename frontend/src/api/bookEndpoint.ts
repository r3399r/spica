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
  PostBookIdResponse,
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

const getBook = async (deviceId: string) =>
  await http.get<GetBookResponse>('book', { headers: { 'x-api-device': deviceId } });

const postBook = async (data: PostBookRequest, deviceId: string) =>
  await http.post<PostBookResponse>('book', { data, headers: { 'x-api-device': deviceId } });

const getBookId = async (id: string, deviceId: string, params?: GetBookIdParams) =>
  await http.get<GetBookIdResponse>(`book/${id}`, {
    headers: { 'x-api-device': deviceId },
    params,
  });

const postBookId = async (id: string, deviceId: string) =>
  await http.post<PostBookIdResponse>(`book/${id}`, {
    headers: { 'x-api-device': deviceId },
  });

const putBookId = async (id: string, data: PutBookRequest, deviceId: string) =>
  await http.put<PutBookResponse>(`book/${id}`, { data, headers: { 'x-api-device': deviceId } });

const deleteBookId = async (id: string, deviceId: string) =>
  await http.delete(`book/${id}`, { headers: { 'x-api-device': deviceId } });

const postBookIdBill = async (id: string, data: PostBookBillRequest, deviceId: string) =>
  await http.post<PostBookBillResponse>(`book/${id}/bill`, {
    data,
    headers: { 'x-api-device': deviceId },
  });

const putBookIdBill = async (id: string, bid: string, data: PutBookBillRequest, deviceId: string) =>
  await http.put<PutBookBillResponse>(`book/${id}/bill/${bid}`, {
    data,
    headers: { 'x-api-device': deviceId },
  });

const deleteBookIdBill = async (id: string, bid: string, deviceId: string) =>
  await http.delete<DeleteBookBillResponse>(`book/${id}/bill/${bid}`, {
    headers: { 'x-api-device': deviceId },
  });

const postBookIdMember = async (id: string, data: PostBookMemberRequest, deviceId: string) =>
  await http.post<PostBookMemberResponse>(`book/${id}/member`, {
    data,
    headers: { 'x-api-device': deviceId },
  });

const putBookIdMember = async (
  id: string,
  mid: string,
  data: PutBookMemberRequest,
  deviceId: string,
) =>
  await http.put<PutBookMemberResponse>(`book/${id}/member/${mid}`, {
    data,
    headers: { 'x-api-device': deviceId },
  });

const deleteBookIdMember = async (id: string, mid: string, deviceId: string) =>
  await http.delete(`book/${id}/member/${mid}`, {
    headers: { 'x-api-device': deviceId },
  });

const putBookIdMemberSelf = async (id: string, mid: string, deviceId: string) =>
  await http.put<PutBookMemberResponse>(`book/${id}/member/${mid}/self`, {
    headers: { 'x-api-device': deviceId },
  });

const putBookIdShowDelete = async (id: string, deviceId: string) =>
  await http.put<PutBookShowDeleteResponse>(`book/${id}/showDelete`, {
    headers: { 'x-api-device': deviceId },
  });

const postBookIdTransfer = async (id: string, data: PostBookTransferRequest, deviceId: string) =>
  await http.post<PostBookTransferResponse>(`book/${id}/transfer`, {
    data,
    headers: { 'x-api-device': deviceId },
  });

const putBookIdTransfer = async (
  id: string,
  tid: string,
  data: PutBookTransferRequest,
  deviceId: string,
) =>
  await http.put<PutBookTransferResponse>(`book/${id}/transfer/${tid}`, {
    data,
    headers: { 'x-api-device': deviceId },
  });

const deleteBookIdTransfer = async (id: string, tid: string, deviceId: string) =>
  await http.delete<DeleteBookTransferResponse>(`book/${id}/transfer/${tid}`, {
    headers: { 'x-api-device': deviceId },
  });

const postBookIdCurrency = async (id: string, data: PostBookCurrencyRequest, deviceId: string) =>
  await http.post<PostBookCurrencyResponse>(`book/${id}/currency`, {
    data,
    headers: { 'x-api-device': deviceId },
  });

const putBookIdCurrency = async (
  id: string,
  cid: string,
  data: PutBookCurrencyRequest,
  deviceId: string,
) =>
  await http.put<PutBookCurrencyResponse>(`book/${id}/currency/${cid}`, {
    data,
    headers: { 'x-api-device': deviceId },
  });

const deleteBookIdCurrency = async (id: string, cid: string, deviceId: string) =>
  await http.delete(`book/${id}/currency/${cid}`, {
    headers: { 'x-api-device': deviceId },
  });

const putBookIdCurrencyPrimary = async (id: string, cid: string, deviceId: string) =>
  await http.put<PutBookCurrencyPrimaryResponse>(`book/${id}/currency/${cid}/primary`, {
    headers: { 'x-api-device': deviceId },
  });

export default {
  getBook,
  postBook,
  getBookId,
  postBookId,
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
