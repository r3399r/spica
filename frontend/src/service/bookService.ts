import bookEndpoint from 'src/api/bookEndpoint';
import { addBook, addBookName, setBookNameList, updateBookList } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getLocalBooks } from 'src/util/localStorage';

export const getBookList = async () => {
  try {
    dispatch(startWaiting());

    const {
      book: { bookNameList: storeBooks },
    } = getState();

    const localBooks = getLocalBooks();

    const reduxSet = new Set([...(storeBooks ?? []).map((v) => v.id)]);
    const localSet = new Set([...localBooks.map((v) => v.id)]);

    if (localSet.size === 0) {
      dispatch(setBookNameList([]));

      return;
    }
    if (reduxSet.size === localSet.size && [...reduxSet].every((x) => localSet.has(x))) return;

    const ids = localBooks.map((v) => v.id).join();
    const code = localBooks.map((v) => v.code).join();
    const res = await bookEndpoint.getBook({ ids }, code);

    dispatch(setBookNameList(res.data));
    localStorage.setItem('book', JSON.stringify(res.data.map((v) => ({ id: v.id, code: v.code }))));
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

    dispatch(addBookName(res.data));
    localStorage.setItem('book', JSON.stringify([...localBooks, { id: book.id, code: book.code }]));

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
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
