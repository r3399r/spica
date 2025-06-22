import bookEndpoint from 'src/api/bookEndpoint';
import { setBooks } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getLocalDeviceId } from 'src/util/localStorage';

export const renameBook = async (id: string, name: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.putBookId(id, { name }, deviceId);

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

export const resetSymbol = async (id: string, symbol: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.putBookId(id, { symbol }, deviceId);

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) =>
      v.id === id
        ? {
            ...v,
            symbol: res.data.symbol,
          }
        : v,
    );

    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};

export const toggleShowDelete = async (id: string) => {
  try {
    dispatch(startWaiting());
    const { books } = getState().book;

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.putBookIdShowDelete(id, deviceId);

    const updatedBooks = (books ?? []).map((v) => {
      if (v.id === id) return { ...v, showDelete: res.data.showDelete };

      return v;
    });
    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};

export const deleteBook = async (id: string) => {
  try {
    dispatch(startWaiting());
    const { books } = getState().book;

    const deviceId = getLocalDeviceId();
    await bookEndpoint.deleteBookId(id, deviceId);

    const updatedBooks = (books ?? []).filter((v) => v.id !== id);
    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};
