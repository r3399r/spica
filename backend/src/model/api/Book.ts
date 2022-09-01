import { Book } from 'src/model/entity/Book';

export type PostBookRequest = {
  name: string;
};

export type PostBookResponse = Book;

export type PutBookRequest = {
  name: string;
};

export type PostBookMemberRequest = {
  nickname: string;
};

export type PutBookMemberRequest = {
  nickname: string;
};
