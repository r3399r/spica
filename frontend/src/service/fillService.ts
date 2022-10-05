import { BillType } from '@y-celestial/spica-service/lib/src/constant/Book';
import { BigNumber } from 'bignumber.js';
import bookEndpoint from 'src/api/bookEndpoint';
import { BillForm, TransferForm } from 'src/model/Form';
import { addTransactions, updateMembers } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { getMaxIndex, getMinIndex } from 'src/util/algorithm';
import { bn } from 'src/util/bignumber';
import { randomPick } from 'src/util/random';

export const addTransfer = async (bookId: string, formData: TransferForm) => {
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

export const addBill = async (
  bookId: string,
  formData: BillForm,
  former: { id: string; amount: number }[],
  latter: { id: string; amount: number }[],
) => {
  const {
    book: { bookList: storeBooks },
  } = getState();
  const book = storeBooks.find((v) => v.id === bookId);
  if (book === undefined) throw new Error('not found');

  const res = await bookEndpoint.postBookIdBill(
    bookId,
    {
      date: formData.date.toISOString(),
      type: formData.type as BillType,
      descr: formData.descr,
      amount: Number(formData.amount),
      detail: [
        ...former.map((v) =>
          formData.type === 'expense' ? v : { id: v.id, amount: bn(v.amount).negated().toNumber() },
        ),
        ...latter.map((v) =>
          formData.type === 'expense' ? { id: v.id, amount: bn(v.amount).negated().toNumber() } : v,
        ),
      ],
      memo: formData.memo === '' ? undefined : formData.memo,
    },
    book.code,
  );
  dispatch(updateMembers(res.data.members));
  dispatch(addTransactions([res.data.transaction]));
};

export const calculateAmount = (amount: string, detail: BillForm['detail']) => {
  const amountResult = detail
    .filter((v) => v.type === 'amount')
    .map((v) => ({ id: v.id, amount: bn(v.value === '' ? 0 : v.value) }));
  const pctResult = detail
    .filter((v) => v.type === 'pct')
    .map((v) => ({
      id: v.id,
      amount: bn(amount)
        .times(v.value === '' ? 0 : v.value)
        .div(100)
        .dp(2),
    }));

  const rest = bn(amount).minus(
    BigNumber.sum(0, ...amountResult.map((v) => v.amount), ...pctResult.map((v) => v.amount)),
  );
  const totalWeight = detail
    .filter((v) => v.type === 'weight')
    .reduce((prev, current) => prev.plus(current.value), bn(0));
  const weightResult = detail
    .filter((v) => v.type === 'weight')
    .map((v) => ({
      id: v.id,
      amount: rest
        .times(v.value === '' ? 0 : v.value)
        .dividedBy(totalWeight)
        .dp(2),
    }));

  const remainder = bn(rest).minus(BigNumber.sum(...weightResult.map((v) => v.amount)));

  let result = [...amountResult, ...pctResult, ...weightResult];
  const n = remainder.abs().times(100).integerValue().toNumber();
  for (let i = 0; i < n; i++)
    if (remainder.gt(0)) {
      const minIndex = getMinIndex(result.map((v) => v.amount));
      const index = minIndex.length === 1 ? minIndex[0] : randomPick(minIndex);
      result = result.map((v, i) => ({
        id: v.id,
        amount: i === index ? v.amount.plus(0.01) : v.amount,
      }));
    } else {
      const maxIndex = getMaxIndex(result.map((v) => v.amount));
      const index = maxIndex.length === 1 ? maxIndex[0] : randomPick(maxIndex);
      result = result.map((v, i) => ({
        id: v.id,
        amount: i === index ? v.amount.minus(0.01) : v.amount,
      }));
    }

  return result.map((v) => ({ id: v.id, amount: v.amount.toNumber() }));
};
