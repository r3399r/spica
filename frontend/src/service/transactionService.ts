import { Member, ShareDetail, ShareMethod, Transaction } from '@y-celestial/spica-service';
import bookEndpoint from 'src/api/bookEndpoint';
import { setBooks } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getMaxIndex, getMinIndex } from 'src/util/algorithm';
import { bn } from 'src/util/bignumber';
import { getLocalBookById, getLocalBooks } from 'src/util/localStorage';
import { randomPick } from 'src/util/random';

export const deleteTx = async (bookId: string, type: 'in' | 'out' | 'transfer', txId: string) => {
  try {
    dispatch(startWaiting());

    const localBooks = getLocalBooks();
    const code = localBooks.find((v) => bookId === v.id)?.code ?? 'xx';
    let members: Member[];
    let transaction: Transaction;
    if (type === 'transfer') {
      const res = await bookEndpoint.deleteBookIdTransfer(bookId, txId, code);
      members = res.data.members;
      transaction = res.data.transaction;
    } else {
      const res = await bookEndpoint.deleteBookIdBill(bookId, txId, code);
      members = res.data.members;
      transaction = res.data.transaction;
    }

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) =>
      v.id === bookId
        ? {
            ...v,
            members,
            transactions: (v.transactions ?? []).map((o) => (o.id === txId ? transaction : o)),
          }
        : v,
    );
    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};

export const isTxSubmittable = () => {
  const { billFormData } = getState().form;
  if (!billFormData.descr) return false;
  if (!billFormData.amount) return false;

  return true;
};

export const calculateAmount = (
  total: number,
  detail: { id: string; method: ShareMethod; value: number }[],
): ShareDetail[] => {
  let rest = bn(total);

  const resPercentage = detail
    .filter((v) => v.method === ShareMethod.Percentage)
    .map((v) => ({ id: v.id, method: v.method, amount: rest.times(v.value).div(100).dp(2) }));
  rest = rest.minus(resPercentage.reduce((prev, current) => prev.plus(current.amount), bn(0)));

  const resAmount = detail
    .filter((v) => v.method === ShareMethod.Amount)
    .map((v) => ({ id: v.id, method: v.method, value: v.value, amount: bn(v.value) }));
  rest = rest.minus(resAmount.reduce((prev, current) => prev.plus(current.amount), bn(0)));

  const totalWeight = detail
    .filter((v) => v.method === ShareMethod.Weight)
    .reduce((prev, current) => prev.plus(current.value), bn(0));
  const resultWeight = detail
    .filter((v) => v.method === ShareMethod.Weight)
    .map((v) => ({
      id: v.id,
      method: v.method,
      value: v.value,
      amount: rest.times(v.value).div(totalWeight).dp(2),
    }));
  rest = rest.minus(resultWeight.reduce((prev, current) => prev.plus(current.amount), bn(0)));

  let result = [...resPercentage, ...resAmount, ...resultWeight];
  const n = rest.abs().times(100).integerValue().toNumber();
  for (let i = 0; i < n; i++)
    if (rest.gt(0)) {
      const minIndex = getMinIndex(result.map((v) => v.amount));
      const index = minIndex.length === 1 ? minIndex[0] : randomPick(minIndex);
      result = result.map((v, i) => ({
        ...v,
        amount: i === index ? v.amount.plus(0.01) : v.amount,
      }));
    } else {
      const maxIndex = getMaxIndex(result.map((v) => v.amount));
      const index = maxIndex.length === 1 ? maxIndex[0] : randomPick(maxIndex);
      result = result.map((v, i) => ({
        ...v,
        amount: i === index ? v.amount.minus(0.01) : v.amount,
      }));
    }

  return result.map((v) => ({ ...v, amount: v.amount.toNumber() }));
};

export const addBill = async (bookId: string) => {
  try {
    dispatch(startWaiting());

    const { billFormData } = getState().form;
    const book = getLocalBookById(bookId);
    if (
      billFormData.date === undefined ||
      billFormData.type === undefined ||
      billFormData.descr === undefined ||
      billFormData.amount === undefined ||
      billFormData.former === undefined ||
      billFormData.latter === undefined
    )
      return;

    const res = await bookEndpoint.postBookIdBill(
      bookId,
      {
        date: billFormData.date,
        type: billFormData.type,
        descr: billFormData.descr,
        amount: billFormData.amount,
        former: billFormData.former,
        latter: billFormData.latter,
        memo: billFormData.memo,
      },
      book?.code ?? 'xx',
    );

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) =>
      v.id === bookId
        ? {
            ...v,
            members: res.data.members,
            transactions: [res.data.transaction, ...(v.transactions ?? [])],
          }
        : v,
    );
    dispatch(setBooks(updatedBooks));

    return res.data.transaction.id;
  } finally {
    dispatch(finishWaiting());
  }
};
