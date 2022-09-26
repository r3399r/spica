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
    setBookList: (state: BookState, action: PayloadAction<Book[]>) => {
      state.bookList = action.payload;
    },
    addBook: (state: BookState, action: PayloadAction<Book>) => {
      state.bookList = [...state.bookList, action.payload];
    },
  },
});

export const { setBookNameList, addBookName, setBookList, addBook } = bookSlice.actions;

export default bookSlice.reducer;
