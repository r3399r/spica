import {
  DeleteBookBillResponse,
  DeleteBookTransferResponse,
  GetBookIdParams,
  GetBookIdResponse,
  GetBookNameResponse,
  GetBookResponse,
  PostBookBillRequest,
  PostBookBillResponse,
  PostBookIdRequest,
  PostBookIdResponse,
  PostBookMemberRequest,
  PostBookMemberResponse,
  PostBookRequest,
  PostBookResponse,
  PostBookTransferRequest,
  PostBookTransferResponse,
  PutBookBillRequest,
  PutBookBillResponse,
  PutBookMemberRequest,
  PutBookMemberResponse,
  PutBookRequest,
  PutBookResponse,
  PutBookShowDeleteResponse,
  PutBookTransferRequest,
  PutBookTransferResponse,
} from '@y-celestial/spica-service';
import http from 'src/celestial-ui/util/http';

const getBook = async (deviceId: string) =>
  await http.get<GetBookResponse>('book', { headers: { 'x-api-device': deviceId } });

const postBook = async (data: PostBookRequest, deviceId: string) =>
  await http.post<PostBookResponse>('book', { data, headers: { 'x-api-device': deviceId } });

const getBookId = async (id: string, deviceId: string, params?: GetBookIdParams) =>
  await http.get<GetBookIdResponse>(`book/${id}`, {
    headers: { 'x-api-device': deviceId },
    params,
  });

const postBookId = async (id: string, data: PostBookIdRequest, deviceId: string) =>
  await http.post<PostBookIdResponse>(`book/${id}`, {
    data,
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

const getBookIdName = async (id: string, deviceId: string) =>
  await http.get<GetBookNameResponse>(`book/${id}/name`, {
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
  getBookIdName,
  putBookIdShowDelete,
  postBookIdTransfer,
  putBookIdTransfer,
  deleteBookIdTransfer,
};
