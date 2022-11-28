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

export const setShareBook = async (id: string, code: string) => {
  try {
    dispatch(startWaiting());
    const res = await bookEndpoint.getBookId(id, code, { limit: '50', offset: '0' });
    dispatch(appendBook({ ...res.data, txCount: Number(res.headers['x-pagination-count']) }));

    const localBooks = getLocalBooks();
    localStorage.setItem('book', JSON.stringify([...localBooks, { id, code }]));
  } finally {
    dispatch(finishWaiting());
  }
};
