import bookEndpoint from 'src/api/bookEndpoint';
import { appendBook } from 'src/redux/bookSlice';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const init = async (id: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = localStorage.getItem('deviceId');
    if (deviceId === null) return;

    const res = await bookEndpoint.getBookIdName(id, deviceId);

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
