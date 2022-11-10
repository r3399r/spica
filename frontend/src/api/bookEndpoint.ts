import {
  DeleteBookBillResponse,
  DeleteBookTransferResponse,
  GetBookIdResponse,
  GetBookNameResponse,
  GetBookParams,
  GetBookResponse,
  PostBookBillRequest,
  PostBookBillResponse,
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
  PutBookTransferRequest,
  PutBookTransferResponse,
} from '@y-celestial/spica-service';
import http from 'src/util/http';

const getBook = async (params: GetBookParams, code: string) =>
  await http.get<GetBookResponse>('book', { params, headers: { 'x-api-code': code } });

const postBook = async (data: PostBookRequest) =>
  await http.post<PostBookResponse>('book', { data });

const putBookId = async (id: string, data: PutBookRequest, code: string) =>
  await http.put<PutBookResponse>(`book/${id}`, { data, headers: { 'x-api-code': code } });

const getBookId = async (id: string, code: string) =>
  await http.get<GetBookIdResponse>(`book/${id}`, { headers: { 'x-api-code': code } });

const postBookIdBill = async (id: string, data: PostBookBillRequest, code: string) =>
  await http.post<PostBookBillResponse>(`book/${id}/bill`, {
    data,
    headers: { 'x-api-code': code },
  });

const putBookIdBill = async (id: string, bid: string, data: PutBookBillRequest, code: string) =>
  await http.put<PutBookBillResponse>(`book/${id}/bill/${bid}`, {
    data,
    headers: { 'x-api-code': code },
  });

const deleteBookIdBill = async (id: string, bid: string, code: string) =>
  await http.delete<DeleteBookBillResponse>(`book/${id}/bill/${bid}`, {
    headers: { 'x-api-code': code },
  });

const postBookIdMember = async (id: string, data: PostBookMemberRequest, code: string) =>
  await http.post<PostBookMemberResponse>(`book/${id}/member`, {
    data,
    headers: { 'x-api-code': code },
  });

const deleteBookIdMember = async (id: string, mid: string, code: string) =>
  await http.delete(`book/${id}/member/${mid}`, {
    headers: { 'x-api-code': code },
  });

const getBookIdName = async (id: string) => await http.get<GetBookNameResponse>(`book/${id}/name`);

const putBookIdName = async (id: string, mid: string, data: PutBookMemberRequest, code: string) =>
  await http.put<PutBookMemberResponse>(`book/${id}/member/${mid}`, {
    data,
    headers: { 'x-api-code': code },
  });

const postBookIdTransfer = async (id: string, data: PostBookTransferRequest, code: string) =>
  await http.post<PostBookTransferResponse>(`book/${id}/transfer`, {
    data,
    headers: { 'x-api-code': code },
  });

const putBookIdTransfer = async (
  id: string,
  tid: string,
  data: PutBookTransferRequest,
  code: string,
) =>
  await http.put<PutBookTransferResponse>(`book/${id}/transfer/${tid}`, {
    data,
    headers: { 'x-api-code': code },
  });

const deleteBookIdTransfer = async (id: string, tid: string, code: string) =>
  await http.delete<DeleteBookTransferResponse>(`book/${id}/transfer/${tid}`, {
    headers: { 'x-api-code': code },
  });

export default {
  getBook,
  postBook,
  putBookId,
  getBookId,
  postBookIdBill,
  putBookIdBill,
  deleteBookIdBill,
  postBookIdMember,
  deleteBookIdMember,
  getBookIdName,
  putBookIdName,
  postBookIdTransfer,
  putBookIdTransfer,
  deleteBookIdTransfer,
};
