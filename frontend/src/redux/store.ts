import { configureStore, PayloadAction, Store } from '@reduxjs/toolkit';
import bookReducer, { BookState } from './bookSlice';
import formReducer, { FormState } from './formSlice';
import uiReducer, { UiState } from './uiSlice';

export type RootState = {
  book: BookState;
  form: FormState;
  ui: UiState;
};

let store: Store<RootState>;

export const configStore = () => {
  store = configureStore({
    reducer: {
      book: bookReducer,
      form: formReducer,
      ui: uiReducer,
    },
  });

  return store;
};

export const getState = () => store.getState();

export const dispatch = <T>(action: PayloadAction<T>) => store.dispatch(action);
