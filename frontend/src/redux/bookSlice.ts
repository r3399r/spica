import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  GetBookIdResponse as Book,
  GetBookIdResponse,
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
    updateMembers: (state: BookState, action: PayloadAction<PutBookMemberResponse[]>) => {
      for (const member of action.payload)
        state.bookList = state.bookList.map((v) => {
          if (v.id !== member.bookId) return v;

          return {
            ...v,
            members: v.members.map((o) => (o.id === member.id ? member : o)),
          };
        });
    },
    addTransactions: (
      state: BookState,
      action: PayloadAction<GetBookIdResponse['transactions']>,
    ) => {
      for (const transaction of action.payload)
        state.bookList = state.bookList.map((v) => {
          if (v.id !== transaction.bookId) return v;

          return {
            ...v,
            transactions: [transaction, ...v.transactions],
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
  updateMembers,
  addTransactions,
} = bookSlice.actions;

export default bookSlice.reducer;
