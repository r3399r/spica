import { Member } from '@y-celestial/spica-service';
import bookEndpoint from 'src/api/bookEndpoint';
import { setBooks } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getLocalBooks } from 'src/util/localStorage';

export const deleteTx = async (bookId: string, type: 'in' | 'out' | 'transfer', txId: string) => {
  try {
    dispatch(startWaiting());

    const localBooks = getLocalBooks();
    const code = localBooks.find((v) => bookId === v.id)?.code ?? 'xx';
    let members: Member[];
    let dateDeleted: string;
    if (type === 'transfer') {
      const res = await bookEndpoint.deleteBookIdTransfer(bookId, txId, code);
      members = res.data.updatedMembers;
      dateDeleted = res.data.dateDeleted;
    } else {
      const res = await bookEndpoint.deleteBookIdBill(bookId, txId, code);
      members = res.data.updatedMembers;
      dateDeleted = res.data.dateDeleted;
    }

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) => {
      if (v.id === bookId) {
        const updatedMemberId = members.map((v) => v.id);

        return {
          ...v,
          members: [
            ...(v.members ?? []).filter((v) => !updatedMemberId.includes(v.id)),
            ...members,
          ],
          transactions: (v.transactions ?? []).map((o) =>
            o.id === txId ? { ...o, dateDeleted } : o,
          ),
        };
      }

      return v;
    });

    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};
