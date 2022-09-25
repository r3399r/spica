import {
  GetBookIdResponse,
  GetBookParams,
  GetBookResponse,
  PostBookRequest,
  PostBookResponse,
} from '@y-celestial/spica-service';
import http from 'src/util/http';

const getBook = async (params: GetBookParams, code: string) =>
  await http.get<GetBookResponse>('book', { params, headers: { 'x-api-code': code } });

const postBook = async (data: PostBookRequest) =>
  await http.post<PostBookResponse>('book', { data });

const getBookId = async (id: string, code: string) =>
  await http.get<GetBookIdResponse>(`book/${id}`, { headers: { 'x-api-code': code } });

export default {
  getBook,
  postBook,
  getBookId,
};
