import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  GetBookIdResponse,
  GetBookResponse,
  PutBookMemberResponse,
  Transaction,
} from '@y-celestial/spica-service';
import { Book } from '@y-celestial/spica-service/lib/src/model/entity/Book';
import { Member } from '@y-celestial/spica-service/lib/src/model/entity/Member';

type SavedBook = Book & {
  members: Member[] | null;
  transactions: Transaction[] | null;
};

export type BookState = {
  bookNameList: GetBookResponse | null;
  bookList: GetBookIdResponse[];
  books: SavedBook[] | null;
};

const initialState: BookState = {
  bookNameList: null,
  bookList: [],
  books: null,
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setBooks: (state: BookState, action: PayloadAction<SavedBook[]>) => {
      state.books = action.payload;
    },
    appendBook: (state: BookState, action: PayloadAction<SavedBook>) => {
      state.books = [...(state.books ?? []), action.payload];
    },
    updateBookName: (state: BookState, action: PayloadAction<GetBookResponse[0]>) => {
      state.bookNameList = (state.bookNameList ?? []).map((v) => ({
        ...v,
        name: v.id === action.payload.id ? action.payload.name : v.name,
      }));
      state.bookList = state.bookList.map((v) => ({
        ...v,
        name: v.id === action.payload.id ? action.payload.name : v.name,
      }));
    },
    updateBookList: (state: BookState, action: PayloadAction<GetBookIdResponse>) => {
      state.bookList = state.bookList.map((v) => (v.id === action.payload.id ? action.payload : v));
    },
    addBook: (state: BookState, action: PayloadAction<GetBookIdResponse>) => {
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
    updateTransactions: (
      state: BookState,
      action: PayloadAction<GetBookIdResponse['transactions']>,
    ) => {
      for (const transaction of action.payload)
        state.bookList = state.bookList.map((v) => {
          if (v.id !== transaction.bookId) return v;

          return {
            ...v,
            transactions: v.transactions.map((o) => (o.id === transaction.id ? transaction : o)),
          };
        });
    },
  },
});

export const {
  setBooks,
  appendBook,
  updateBookName,
  updateBookList,
  addBook,
  updateMember,
  updateMembers,
  addTransactions,
  updateTransactions,
} = bookSlice.actions;

export default bookSlice.reducer;
