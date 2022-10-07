import bookEndpoint from 'src/api/bookEndpoint';
import { addBook } from 'src/redux/bookSlice';
import { dispatch } from 'src/redux/store';
import { getLocalBooks } from 'src/util/localStorage';
import { getBookById } from './bookService';

export const init = async (id: string) => {
  try {
    await getBookById(id);

    return 'ALREADY_OWN';
  } catch {
    const res = await bookEndpoint.getBookIdName(id);

    return res.data.name;
  }
};

export const setShareBook = async (id: string, code: string) => {
  const res = await bookEndpoint.getBookId(id, code);
  dispatch(addBook(res.data));

  const localBooks = getLocalBooks();
  localStorage.setItem('book', JSON.stringify([...localBooks, { id, code }]));
};
