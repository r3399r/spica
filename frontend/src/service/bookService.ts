import { Transaction } from '@y-celestial/spica-service';
import { format } from 'date-fns';
import bookEndpoint from 'src/api/bookEndpoint';
import { addBook, appendBook, setBooks, updateBookList } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getLocalBookById, getLocalBooks } from 'src/util/localStorage';

export const loadBookList = async () => {
  try {
    dispatch(startWaiting());

    const { books } = getState().book;

    const localBooks = getLocalBooks();

    const reduxSet = new Set([...(books ?? []).map((v) => v.id)]);
    const localSet = new Set([...localBooks.map((v) => v.id)]);

    if (localSet.size === 0) {
      dispatch(setBooks([]));

      return;
    }
    if (reduxSet.size === localSet.size && [...reduxSet].every((x) => localSet.has(x))) return;

    const ids = localBooks.map((v) => v.id).join();
    const code = localBooks.map((v) => v.code).join();
    const res = await bookEndpoint.getBook({ ids }, code);

    const updatedBooks = res.data.map((v) => {
      const savedBook = books?.find((o) => o.id === v.id);

      return { ...v, members: null, transactions: null, ...savedBook };
    });

    dispatch(setBooks(updatedBooks));
    localStorage.setItem(
      'book',
      JSON.stringify(res.data.map((v) => ({ id: v.id, code: v.code, showDeleted: false }))),
    );
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

    const code = getLocalBookById(id)?.code ?? '';
    const res = await bookEndpoint.getBookId(id, code);

    const index = books?.findIndex((v) => v.id === id) ?? -1;
    if (books === null || index === -1) dispatch(appendBook(res.data));
    else {
      const tmp = [...books];
      tmp[index] = res.data;
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

export const getBookById = async (id: string) => {
  const {
    book: { bookList: storeBooks },
  } = getState();
  const book = storeBooks.find((v) => v.id === id);

  if (book !== undefined) return book;

  const localBooks = getLocalBooks();
  const code = localBooks.find((v) => v.id === id)?.code ?? '';
  const res = await bookEndpoint.getBookId(id, code);

  dispatch(addBook(res.data));

  return res.data;
};

export const addMember = async (id: string, nickname: string) => {
  const {
    book: { bookList: storeBooks },
  } = getState();
  const book = storeBooks.find((v) => v.id === id);
  if (book === undefined) throw new Error('not found');

  const res = await bookEndpoint.postBookIdMember(id, { nickname }, book.code);

  const updatedBook = { ...book, members: [...book.members, res.data] };
  dispatch(updateBookList(updatedBook));
};

export const deleteMember = async (memberId: string, bookId: string) => {
  const {
    book: { bookList: storeBooks },
  } = getState();
  const book = storeBooks.find((v) => v.id === bookId);

  if (book === undefined) throw new Error('not found');

  await bookEndpoint.deleteBookIdMember(bookId, memberId, book.code);

  const updatedBook = { ...book, members: book.members.filter((v) => v.id !== memberId) };
  dispatch(updateBookList(updatedBook));
};

export const aggregateTransactions = (id: string, transactions: Transaction[]) => {
  const showDeleted = getLocalBookById(id)?.showDeleted;

  const map: { [key: string]: Transaction[] } = {};
  transactions.forEach((v) => {
    if (v.dateDeleted !== null && !showDeleted) return;

    const date = format(new Date(v.date), 'yyyy-MM-dd');
    if (map[date] === undefined) map[date] = [v];
    else map[date] = [...map[date], v];
  });

  return map;
};
