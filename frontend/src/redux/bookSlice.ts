import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  GetBookIdResponse as Book,
  GetBookResponse,
  PutBookMemberResponse,
} from '@y-celestial/spica-service';

export type BookState = {
  bookNameList: GetBookResponse;
  bookList: Book[];
};

const initialState: BookState = {
  bookNameList: [],
  bookList: [],
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setBookNameList: (state: BookState, action: PayloadAction<GetBookResponse>) => {
      state.bookNameList = action.payload;
    },
    addBookName: (state: BookState, action: PayloadAction<GetBookResponse[0]>) => {
      state.bookNameList = [...state.bookNameList, action.payload];
    },
    updateBookName: (state: BookState, action: PayloadAction<GetBookResponse[0]>) => {
      state.bookNameList = state.bookNameList.map((v) => ({
        ...v,
        name: v.id === action.payload.id ? action.payload.name : v.name,
      }));
      state.bookList = state.bookList.map((v) => ({
        ...v,
        name: v.id === action.payload.id ? action.payload.name : v.name,
      }));
    },
    updateBookList: (state: BookState, action: PayloadAction<Book>) => {
      state.bookList = state.bookList.map((v) => (v.id === action.payload.id ? action.payload : v));
    },
    addBook: (state: BookState, action: PayloadAction<Book>) => {
      state.bookList = [...state.bookList, action.payload];
    },
    updateMember: (state: BookState, action: PayloadAction<PutBookMemberResponse>) => {
      state.bookList = state.bookList.map((v) => {
        if (v.id !== action.payload.bookId) return v;

        return {
          ...v,
          members: v.members.map((o) => (o.id === action.payload.id ? action.payload : o)),
        };
      });
    },
  },
});

export const {
  setBookNameList,
  addBookName,
  updateBookName,
  updateBookList,
  addBook,
  updateMember,
} = bookSlice.actions;

export default bookSlice.reducer;
