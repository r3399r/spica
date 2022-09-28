import bookEndpoint from 'src/api/bookEndpoint';
import { addBook } from 'src/redux/bookSlice';
import { dispatch } from 'src/redux/store';
import { getLocalBooks } from 'src/util/localStorage';

export const init = async (id: string) => {
  const localBooks = getLocalBooks();

  if (localBooks.map((v) => v.id).includes(id)) throw 'ALREADY_OWN';

  const res = await bookEndpoint.getBookIdName(id);

  return res.data;
};

export const setShareBook = async (id: string, code: string) => {
  const res = await bookEndpoint.getBookId(id, code);
  dispatch(addBook(res.data));

  const localBooks = getLocalBooks();
  localStorage.setItem('book', JSON.stringify([...localBooks, { id, code }]));
};
