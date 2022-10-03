import {
  GetBookIdResponse,
  GetBookNameResponse,
  GetBookParams,
  GetBookResponse,
  PostBookMemberRequest,
  PostBookMemberResponse,
  PostBookRequest,
  PostBookResponse,
  PutBookMemberRequest,
  PutBookMemberResponse,
  PutBookRequest,
  PutBookResponse,
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

export default {
  getBook,
  postBook,
  putBookId,
  getBookId,
  postBookIdMember,
  deleteBookIdMember,
  getBookIdName,
  putBookIdName,
};
