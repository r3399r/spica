import { configureStore, PayloadAction, Store } from '@reduxjs/toolkit';
import bookReducer, { BookState } from './bookSlice';

export type RootState = {
  book: BookState;
};

let store: Store<RootState>;

export const configStore = () => {
  store = configureStore({
    reducer: {
      book: bookReducer,
    },
  });

  return store;
};

export const getState = () => store.getState();

export const dispatch = <T>(action: PayloadAction<T>) => store.dispatch(action);
