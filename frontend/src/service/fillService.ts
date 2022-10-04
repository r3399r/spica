import bookEndpoint from 'src/api/bookEndpoint';
import { AddTransferForm } from 'src/model/Form';
import { addTransactions, updateMembers } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';

export const addTransfer = async (bookId: string, formData: AddTransferForm) => {
  const {
    book: { bookList: storeBooks },
  } = getState();
  const book = storeBooks.find((v) => v.id === bookId);
  if (book === undefined) throw new Error('not found');

  const res = await bookEndpoint.postBookIdTransfer(
    bookId,
    {
      date: formData.date.toISOString(),
      amount: Number(formData.amount),
      srcMemberId: formData.from,
      dstMemberId: formData.to,
      memo: formData.memo === '' ? undefined : formData.memo,
    },
    book.code,
  );
  dispatch(updateMembers(res.data.members));
  dispatch(addTransactions([res.data.transaction]));
};
