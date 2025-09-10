import { format } from 'date-fns';
import bookEndpoint from 'src/api/bookEndpoint';
import exportPdfEndpoint from 'src/api/exportPdfEndpoint';
import { PostBookRequest } from 'src/model/backend/api/Book';
import { Transaction } from 'src/model/backend/type/Book';
import { appendBook, setBooks } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { compare } from 'src/util/compare';
import { getLocalDeviceId } from 'src/util/localStorage';
import { exportPdf } from 'src/util/pdfHelper';

export const loadBookList = async (id?: string) => {
  const { books } = getState().book;
  const hasSavedBook = books?.find((v) => v.id === id) !== undefined;
  if (id && books !== null && hasSavedBook) return books;

  const deviceId = getLocalDeviceId();

  const res = await bookEndpoint.getBook(deviceId);
  const updatedBooks = res.data.map((v) => {
    const savedBook = books?.find((o) => o.id === v.bookId);

    return {
      id: v.bookId,
      name: v.name,
      code: v.code,
      symbol: v.symbol,
      showDelete: v.showDelete,
      dateCreated: v.dateCreated,
      lastDateUpdated: v.lastDateUpdated,
      members: null,
      transactions: null,
      currencies: null,
      txCount: null,
      ...savedBook,
    };
  });

  dispatch(setBooks(updatedBooks));

  return updatedBooks;
};

export const createBook = async (data: PostBookRequest) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.postBook(data, deviceId);
    const book = res.data;

    dispatch(
      appendBook({
        ...book,
        showDelete: false,
        lastDateUpdated: new Date().toISOString(),
        members: null,
        transactions: null,
        currencies: [],
        txCount: 0,
      }),
    );

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const loadBookById = async (id: string) => {
  try {
    dispatch(startWaiting());
    const books = await loadBookList(id);

    const savedBook = books?.find((v) => v.id === id);
    if (
      savedBook &&
      savedBook.members !== null &&
      savedBook.transactions !== null &&
      savedBook.members !== null
    )
      return;

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.getBookId(id, deviceId, { limit: '50', offset: '0' });

    if (books.find((v) => v.id === id) === undefined)
      dispatch(
        appendBook({
          ...res.data,
          showDelete: false,
          txCount: Number(res.headers['x-pagination-count']),
        }),
      );
    else {
      const tmp = books.map((v) =>
        v.id === id
          ? {
              ...res.data,
              showDelete: v.showDelete,
              txCount: Number(res.headers['x-pagination-count']),
            }
          : v,
      );
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

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.getBookId(id, deviceId, {
      limit: '60',
      offset: String(savedBook?.transactions?.length),
    });

    const index = books?.findIndex((v) => v.id === id) ?? -1;
    if (books === null || index === -1)
      dispatch(
        appendBook({
          ...res.data,
          showDelete: false,
          txCount: Number(res.headers['x-pagination-count']),
        }),
      );
    else {
      const tmp = [...books];
      tmp[index] = {
        ...res.data,
        showDelete: tmp[index].showDelete,
        transactions: [...(tmp[index].transactions ?? []), ...res.data.transactions],
        txCount: Number(res.headers['x-pagination-count']),
      };
      dispatch(setBooks(tmp));
    }
  } finally {
    dispatch(finishWaiting());
  }
};

export const loadAllBookById = async (id: string) => {
  try {
    dispatch(startWaiting());
    const deviceId = getLocalDeviceId();
    const { books } = getState().book;
    const savedBook = books?.find((v) => v.id === id);
    const txCount = savedBook?.txCount;

    if (savedBook === undefined || !txCount) throw new Error('unexpected');

    let savedTx = savedBook.transactions ?? [];
    let savedCount = savedTx.length;
    while (savedCount < txCount) {
      const res = await bookEndpoint.getBookId(id, deviceId, {
        limit: '60',
        offset: String(savedCount),
      });

      savedTx = [...savedTx, ...res.data.transactions];
      savedCount += res.data.transactions.length;
    }

    const index = books?.findIndex((v) => v.id === id) ?? -1;
    if (books === null || index === -1) throw new Error('unexpected');
    else {
      const tmp = [...books];
      tmp[index] = {
        ...tmp[index],
        transactions: savedTx,
      };
      dispatch(setBooks(tmp));
    }
  } finally {
    dispatch(finishWaiting());
  }
};

export const getBookIndex = (id: string) => {
  const { books } = getState().book;
  if (books === null) return 0;

  return books.findIndex((v) => v.id === id);
};

export const aggregateTransactions = (id: string, transactions: Transaction[]) => {
  const { books } = getState().book;
  const showDeleted = books?.find((v) => v.id === id)?.showDelete;
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

export const exportPersonalPdf = async (id: string, userId: string) => {
  try {
    dispatch(startWaiting());
    const { books } = getState().book;
    const savedBook = books?.find((v) => v.id === id);
    const user = savedBook?.members?.find((v) => v.id === userId);
    if (savedBook === undefined || user === undefined) return;

    const deviceId = getLocalDeviceId();
    await exportPdfEndpoint.patchExportPdfIdMemberMid(id, userId, deviceId);

    await exportPdf('pdf-personal-content', `${savedBook.name}-${user.nickname}.pdf`);
  } finally {
    dispatch(finishWaiting());
  }
};

export const exportOverallPdf = async (id: string) => {
  try {
    dispatch(startWaiting());
    const { books } = getState().book;
    const savedBook = books?.find((v) => v.id === id);
    if (savedBook === undefined) return;

    const deviceId = getLocalDeviceId();
    await exportPdfEndpoint.patchExportPdfId(id, deviceId);

    await exportPdf('pdf-overall-content', `${savedBook.name}.pdf`);
  } finally {
    dispatch(finishWaiting());
  }
};
