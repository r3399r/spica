import bookEndpoint from 'src/api/bookEndpoint';
import { getLocalBooks } from 'src/util/localStorage';

export const getBookById = async (id: string) => {
  const localBooks = getLocalBooks();
  const code = localBooks.find((v) => v.id === id)?.code ?? '';
  const res = await bookEndpoint.getBookId(id, code);

  return res.data;
};
