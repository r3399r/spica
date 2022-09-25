import bookEndpoint from 'src/api/bookEndpoint';
import { getLocalBooks } from 'src/util/localStorage';

export const getBookList = async () => {
  const localBooks = getLocalBooks();

  if (localBooks.length === 0) return [];

  const ids = localBooks.map((v) => v.id).join();
  const code = localBooks.map((v) => v.code).join();
  const res = await bookEndpoint.getBook({ ids }, code);

  localStorage.setItem('book', JSON.stringify(res.data.map((v) => ({ id: v.id, code: v.code }))));

  return res.data;
};

export const createBook = async (name: string) => {
  const res = await bookEndpoint.postBook({ name });
  const book = res.data;
  const localBooks = getLocalBooks();

  localStorage.setItem('book', JSON.stringify([...localBooks, { id: book.id, code: book.code }]));

  return res.data;
};
