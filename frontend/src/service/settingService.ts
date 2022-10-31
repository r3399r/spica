import bookEndpoint from 'src/api/bookEndpoint';
import { updateBookName, updateMember } from 'src/redux/bookSlice';
import { dispatch } from 'src/redux/store';
import { getLocalBooks } from 'src/util/localStorage';

export const renameBook = async (id: string, name: string) => {
  const localBooks = getLocalBooks();

  const code = localBooks.find((v) => id === v.id)?.code ?? 'xx';
  const res = await bookEndpoint.putBookId(id, { name }, code);

  dispatch(updateBookName({ ...res.data, lastDateUpdated: new Date() }));
};

export const renameMember = async (bookId: string, memberId: string, nickname: string) => {
  const localBooks = getLocalBooks();

  const code = localBooks.find((v) => bookId === v.id)?.code ?? 'xx';
  const res = await bookEndpoint.putBookIdName(bookId, memberId, { nickname }, code);

  dispatch(updateMember(res.data));
};
