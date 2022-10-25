import bookEndpoint from 'src/api/bookEndpoint';
import { setBooks } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const addMember = async (id: string, nickname: string) => {
  try {
    dispatch(startWaiting());
    const { books } = getState().book;
    const book = books?.find((v) => v.id === id);
    if (book === undefined) return;

    const res = await bookEndpoint.postBookIdMember(id, { nickname }, book.code);

    const updatedBooks = (books ?? []).map((v) => {
      if (v.id === id)
        return {
          ...v,
          members: [...(v.members ?? []), res.data],
        };

      return v;
    });

    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};
