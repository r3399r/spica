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
    const updatedBooks = (books ?? []).map((v) =>
      v.id === id
        ? {
            ...v,
            name: res.data.name,
          }
        : v,
    );

    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};

export const deleteBook = (id: string) => {
  const { books } = getState().book;
  const updatedBooks = (books ?? []).filter((v) => v.id !== id);
  dispatch(setBooks(updatedBooks));

  const localBooks = getLocalBooks();
  localStorage.setItem('book', JSON.stringify(localBooks.filter((v) => v.id !== id)));
};
