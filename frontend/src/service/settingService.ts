import bookEndpoint from 'src/api/bookEndpoint';
import { setBooks } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getLocalBooks } from 'src/util/localStorage';

export const renameBook = async (id: string, name: string) => {
  try {
    dispatch(startWaiting());
    const localBooks = getLocalBooks();
    const code = localBooks.find((v) => id === v.id)?.code ?? 'xx';
    const res = await bookEndpoint.putBookId(id, { name }, code);

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) => {
      if (v.id === id)
        return {
          ...v,
          name: res.data.name,
        };

      return v;
    });

    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};
