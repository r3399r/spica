import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetBookIdResponse } from '@y-celestial/spica-service';
import { SavedBook } from 'src/model/Book';

export type BookState = {
  bookList: GetBookIdResponse[];
  books: SavedBook[] | null;
};

const initialState: BookState = {
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
  },
});

export const { setBooks, appendBook } = bookSlice.actions;

export default bookSlice.reducer;
