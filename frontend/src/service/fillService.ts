import bookEndpoint from 'src/api/bookEndpoint';
import { AddTransferForm } from 'src/model/Form';
import { getState } from 'src/redux/store';

export const addTransfer = async (bookId: string, formData: AddTransferForm) => {
  const {
    book: { bookList: storeBooks },
  } = getState();
  const book = storeBooks.find((v) => v.id === bookId);
  if (book === undefined) throw new Error('not found');

  await bookEndpoint.postBookIdTransfer(
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

  // const updatedBook = { ...book,
  //     members:book.members.map(v=>{
  //         if(v.id===formData.from) return {...v,balance:v.balance+Number(formData.amount),deletable:false}
  //         if(v.id===formData.to) return {...v,balance:v.balance-Number(formData.amount),deletable:false}
  //         return v
  //     }),
  //      transactions:[...book.transactions,res.data] };
  // dispatch(updateBookList(updatedBook));
};
