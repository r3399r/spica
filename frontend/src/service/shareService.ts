import bookEndpoint from 'src/api/bookEndpoint';
import { appendBook } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getLocalDeviceId } from 'src/util/localStorage';
import { loadBookList } from './bookService';

export const addBook = async (id: string, code: string) => {
  try {
    dispatch(startWaiting());

    await loadBookList();
    const { books } = getState().book;
    if (books?.find((v) => v.id === id) !== undefined) return;

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.postBookId(id, { code }, deviceId);
    dispatch(
      appendBook({
        ...res.data,
        showDelete: false,
        txCount: Number(res.headers['x-pagination-count']),
      }),
    );
  } finally {
    dispatch(finishWaiting());
  }
};
