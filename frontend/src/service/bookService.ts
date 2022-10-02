import bookEndpoint from 'src/api/bookEndpoint';
import { addBook, addBookName, setBookList, setBookNameList } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { getLocalBooks } from 'src/util/localStorage';

export const getBookList = async () => {
  const {
    book: { bookNameList: storeBooks },
  } = getState();
  if (storeBooks.length > 0) return storeBooks;

  const localBooks = getLocalBooks();

  if (localBooks.length === 0) return [];

  const ids = localBooks.map((v) => v.id).join();
  const code = localBooks.map((v) => v.code).join();
  const res = await bookEndpoint.getBook({ ids }, code);

  dispatch(setBookNameList(res.data));
  localStorage.setItem('book', JSON.stringify(res.data.map((v) => ({ id: v.id, code: v.code }))));

  return res.data;
};

export const createBook = async (name: string) => {
  const res = await bookEndpoint.postBook({ name });
  const book = res.data;
  const localBooks = getLocalBooks();

  dispatch(addBookName(res.data));
  localStorage.setItem('book', JSON.stringify([...localBooks, { id: book.id, code: book.code }]));

  return res.data;
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

  const res = await bookEndpoint.postBookIdMember(id, { nickname }, book.id);

  const updatedBook = { ...book, members: [...book.members, res.data] };
  dispatch(setBookList([...storeBooks.filter((v) => v.id !== id), updatedBook]));
};
