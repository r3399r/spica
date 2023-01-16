import { Transaction } from '@y-celestial/spica-service';
import { format } from 'date-fns';
import bookEndpoint from 'src/api/bookEndpoint';
import { compare } from 'src/celestial-ui/util/compare';
import { appendBook, setBooks } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getLocalBookById, getLocalBooks } from 'src/util/localStorage';

export const loadBookList = async () => {
  try {
    dispatch(startWaiting());

    const { books } = getState().book;
    const deviceId = localStorage.getItem('deviceId');
    if (deviceId === null) return;

    const res = await bookEndpoint.getBook(deviceId);
    const updatedBooks = res.data.map((v) => {
      const savedBook = books?.find((o) => o.id === v.bookId);

      return {
        id: v.bookId,
        name: v.name,
        code: v.code,
        symbol: v.symbol,
        dateCreated: v.dateCreated,
        lastDateUpdated: v.lastDateUpdated,
        members: null,
        transactions: null,
        txCount: null,
        ...savedBook,
      };
    });

    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};

export const createBook = async (name: string) => {
  try {
    dispatch(startWaiting());

    const res = await bookEndpoint.postBook({ name });
    const book = res.data;
    const localBooks = getLocalBooks();

    dispatch(
      appendBook({
        ...book,
        lastDateUpdated: new Date().toISOString(),
        members: null,
        transactions: null,
        txCount: 0,
      }),
    );
    localStorage.setItem(
      'book',
      JSON.stringify([...localBooks, { id: book.id, code: book.code, showDeleted: false }]),
    );

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const loadBookById = async (id: string) => {
  try {
    dispatch(startWaiting());
    const { books } = getState().book;

    const savedBook = books?.find((v) => v.id === id);
    if (savedBook && savedBook.members !== null && savedBook.transactions !== null) return;

    const deviceId = localStorage.getItem('deviceId');
    if (deviceId === null) return;

    const res = await bookEndpoint.getBookId(id, deviceId, { limit: '50', offset: '0' });

    const index = books?.findIndex((v) => v.id === id) ?? -1;
    if (books === null || index === -1)
      dispatch(appendBook({ ...res.data, txCount: Number(res.headers['x-pagination-count']) }));
    else {
      const tmp = [...books];
      tmp[index] = { ...res.data, txCount: Number(res.headers['x-pagination-count']) };
      dispatch(setBooks(tmp));
    }
  } finally {
    dispatch(finishWaiting());
  }
};

export const loadMoreBookById = async (id: string) => {
  try {
    dispatch(startWaiting());
    const { books } = getState().book;

    const savedBook = books?.find((v) => v.id === id);

    const code = getLocalBookById(id)?.code ?? '';
    const res = await bookEndpoint.getBookId(id, code, {
      limit: '50',
      offset: String(savedBook?.transactions?.length),
    });

    const index = books?.findIndex((v) => v.id === id) ?? -1;
    if (books === null || index === -1)
      dispatch(appendBook({ ...res.data, txCount: Number(res.headers['x-pagination-count']) }));
    else {
      const tmp = [...books];
      tmp[index] = {
        ...res.data,
        transactions: [...(tmp[index].transactions ?? []), ...res.data.transactions],
        txCount: Number(res.headers['x-pagination-count']),
      };
      dispatch(setBooks(tmp));
    }
  } finally {
    dispatch(finishWaiting());
  }
};

export const getBookIndex = (id: string) => {
  const books = getLocalBooks();

  return books.findIndex((v) => v.id === id);
};

export const aggregateTransactions = (id: string, transactions: Transaction[]) => {
  const showDeleted = getLocalBookById(id)?.showDeleted;
  const tmp = [...transactions];
  const map: { [key: string]: Transaction[] } = {};

  tmp.sort(compare('date', 'desc')).forEach((v) => {
    if (v.dateDeleted !== null && !showDeleted) return;

    const date = format(new Date(v.date), 'yyyy-MM-dd');
    if (map[date] === undefined) map[date] = [v];
    else map[date] = [...map[date], v];
  });

  return map;
};

export const saveDeviceId = (id: string) => {
  localStorage.setItem('deviceId', id);
};
