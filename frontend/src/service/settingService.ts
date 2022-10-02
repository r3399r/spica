import bookEndpoint from 'src/api/bookEndpoint';
import { updateBookName } from 'src/redux/bookSlice';
import { dispatch } from 'src/redux/store';
import { getLocalBooks } from 'src/util/localStorage';

export const renameBook = async (id: string, name: string) => {
  const localBooks = getLocalBooks();

  const code = localBooks.find((v) => id === v.id)?.code ?? 'xx';
  const res = await bookEndpoint.putBookId(id, { name }, code);

  dispatch(updateBookName(res.data));
};
