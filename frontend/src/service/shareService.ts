import bookEndpoint from 'src/api/bookEndpoint';
import { appendBook } from 'src/redux/bookSlice';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getLocalBooks } from 'src/util/localStorage';

export const init = async (id: string) => {
  try {
    dispatch(startWaiting());
    const localBooks = getLocalBooks();
    if (localBooks.find((v) => v.id === id)) return;

    const res = await bookEndpoint.getBookIdName(id);

    return res.data.name;
  } finally {
    dispatch(finishWaiting());
  }
};

export const addBook = async (id: string, code: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = localStorage.getItem('deviceId');
    if (deviceId === null) return;

    const res = await bookEndpoint.postBookId(id, code, deviceId);
    dispatch(appendBook({ ...res.data, txCount: Number(res.headers['x-pagination-count']) }));
  } finally {
    dispatch(finishWaiting());
  }
};
