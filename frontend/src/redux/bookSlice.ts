import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetBookIdResponse as Book, GetBookResponse } from '@y-celestial/spica-service';

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
    setBookList: (state: BookState, action: PayloadAction<Book[]>) => {
      state.bookList = action.payload;
    },
    addBook: (state: BookState, action: PayloadAction<Book>) => {
      state.bookList = [...state.bookList, action.payload];
    },
  },
});

export const { setBookNameList, addBookName, updateBookName, setBookList, addBook } =
  bookSlice.actions;

export default bookSlice.reducer;
