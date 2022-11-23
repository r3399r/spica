import {
  BillType,
  Member,
  ShareDetail,
  ShareMethod,
  Transaction,
} from '@y-celestial/spica-service';
import bookEndpoint from 'src/api/bookEndpoint';
import { Detail } from 'src/model/Book';
import { setBooks } from 'src/redux/bookSlice';
import { saveBillFormData } from 'src/redux/formSlice';
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
  if (
    !billFormData.former ||
    !billFormData.former
      .reduce((prev, current) => prev.plus(current.amount), bn(0))
      .eq(billFormData.amount)
  )
    return false;
  if (
    !billFormData.latter ||
    !billFormData.latter
      .reduce((prev, current) => prev.plus(current.amount), bn(0))
      .eq(billFormData.amount)
  )
    return false;

  return true;
};

export const calculateAmount = (total: number, detail: Detail[]): ShareDetail[] => {
  let rest = bn(total);

  const resPercentage = detail
    .filter((v) => v.method === ShareMethod.Percentage)
    .map((v) => ({
      id: v.id,
      method: v.method,
      value: v.value,
      amount: rest.times(v.value).div(100).dp(2),
    }));
  rest = rest.minus(resPercentage.reduce((prev, current) => prev.plus(current.amount), bn(0)));

  const resAmount = detail
    .filter((v) => v.method === ShareMethod.Amount)
    .map((v) => ({
      id: v.id,
      method: v.method,
      amount: bn(v.value),
    }));
  rest = rest.minus(resAmount.reduce((prev, current) => prev.plus(current.amount), bn(0)));

  const totalWeight = detail
    .filter((v) => v.method === ShareMethod.Weight)
    .reduce((prev, current) => prev.plus(current.value), bn(0));
  const resultWeight = detail
    .filter((v) => v.method === ShareMethod.Weight)
    .map((v) => {
      const amount = rest.times(v.value).div(totalWeight).dp(2);

      return {
        id: v.id,
        method: v.method,
        value: v.value,
        amount: amount.gt(0) ? amount : bn(0),
      };
    });
  rest = rest.minus(resultWeight.reduce((prev, current) => prev.plus(current.amount), bn(0)));

  let result = [...resPercentage, ...resAmount, ...resultWeight];
  const n = rest.abs().times(100).integerValue().toNumber();
  if (n < detail.length)
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

export const calculateAdjust = (total: number, detail: Detail[]): ShareDetail[] => {
  let rest = bn(total);

  const adjust = detail.filter((v) => v.method === ShareMethod.PlusMinus);
  if (adjust.length !== detail.length) throw Error('unexpected error');
  const totalAdjust = adjust.reduce((prev, current) => prev.plus(current.value), bn(0));

  let result = adjust.map((v) => {
    const amount = rest.minus(totalAdjust).div(detail.length).dp(2);

    return {
      id: v.id,
      method: v.method,
      value: v.value,
      amount: amount.plus(v.value),
    };
  });
  rest = rest.minus(result.reduce((prev, current) => prev.plus(current.amount), bn(0)));

  const n = rest.abs().times(100).integerValue().toNumber();
  if (n < detail.length)
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

export const remainingAmount = (total: number, shareDetail: ShareDetail[]) => {
  const sum = shareDetail.reduce((prev, current) => prev.plus(current.amount), bn(0));

  return sum.minus(total).toNumber();
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
        type: billFormData.type as BillType,
        descr: billFormData.descr,
        amount: billFormData.amount,
        former: billFormData.former,
        latter: billFormData.latter,
        memo: billFormData.memo === '' ? undefined : billFormData.memo,
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

export const reviseBill = async (bookId: string, billId: string) => {
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

    const res = await bookEndpoint.putBookIdBill(
      bookId,
      billId,
      {
        date: billFormData.date,
        type: billFormData.type as BillType,
        descr: billFormData.descr,
        amount: billFormData.amount,
        former: billFormData.former,
        latter: billFormData.latter,
        memo: billFormData.memo === '' ? undefined : billFormData.memo,
      },
      book?.code ?? 'xx',
    );

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) =>
      v.id === bookId
        ? {
            ...v,
            members: res.data.members,
            transactions:
              v.transactions?.map((o) =>
                o.id === res.data.transaction.id ? res.data.transaction : o,
              ) ?? null,
          }
        : v,
    );
    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};

const getDetail = (shareDetail: ShareDetail): Detail => ({
  id: shareDetail.id,
  method: shareDetail.method,
  value: shareDetail.method === ShareMethod.Amount ? shareDetail.amount : shareDetail.value ?? 0,
});

export const addMemberToBillFormer = (memberId: string, detail?: Detail) => {
  const {
    form: { billFormData },
  } = getState();

  const newShareDetail: Detail = detail
    ? detail
    : {
        id: memberId,
        method: ShareMethod.Weight,
        value: 1,
      };

  let former: Detail[] = [];
  if (billFormData.former?.find((v) => v.id === memberId))
    former = billFormData.former?.map((v) => (v.id === memberId ? newShareDetail : getDetail(v)));
  else former = [...(billFormData.former ?? []).map((v) => getDetail(v)), newShareDetail];

  dispatch(saveBillFormData({ former: calculateAmount(billFormData.amount ?? 0, former) }));
};

export const addMemberToBillLatter = (
  memberId: string,
  mode: 'weight' | 'pct' | 'pm',
  detail?: Detail,
) => {
  const {
    form: { billFormData },
  } = getState();

  const newShareDetail: Detail = detail
    ? detail
    : {
        id: memberId,
        method: ShareMethod.Weight,
        value: 1,
      };

  let latter: Detail[] = [];
  if (billFormData.latter?.find((v) => v.id === memberId))
    latter = billFormData.latter?.map((v) => (v.id === memberId ? newShareDetail : getDetail(v)));
  else latter = [...(billFormData.latter ?? []).map((v) => getDetail(v)), newShareDetail];

  dispatch(
    saveBillFormData({
      latter:
        mode === 'pm'
          ? calculateAdjust(billFormData.amount ?? 0, latter)
          : calculateAmount(billFormData.amount ?? 0, latter),
    }),
  );
};

export const removeMemberFromBillFormer = (memberId: string) => {
  const {
    form: { billFormData },
  } = getState();
  dispatch(
    saveBillFormData({
      former: calculateAmount(
        billFormData.amount ?? 0,
        (billFormData.former ?? [])
          .filter((v) => v.id !== memberId)
          .map((v) => ({
            id: v.id,
            method: v.method,
            value: v.method === ShareMethod.Amount ? v.amount : v.value ?? 0,
          })),
      ),
    }),
  );
};

export const removeMemberFromBillLatter = (memberId: string, mode?: 'weight' | 'pct' | 'pm') => {
  const {
    form: { billFormData },
  } = getState();
  dispatch(
    saveBillFormData({
      latter:
        mode === 'pm'
          ? calculateAdjust(
              billFormData.amount ?? 0,
              (billFormData.latter ?? [])
                .filter((v) => v.id !== memberId)
                .map((v) => ({
                  id: v.id,
                  method: v.method,
                  value: v.method === ShareMethod.Amount ? v.amount : v.value ?? 0,
                })),
            )
          : calculateAmount(
              billFormData.amount ?? 0,
              (billFormData.latter ?? [])
                .filter((v) => v.id !== memberId)
                .map((v) => ({
                  id: v.id,
                  method: v.method,
                  value: v.method === ShareMethod.Amount ? v.amount : v.value ?? 0,
                })),
            ),
    }),
  );
};

export const saveBillDataEvenly = (
  amount: number,
  members: Member[],
  options: {
    mode: 'weight' | 'pct' | 'pm';
    sharedPct?: number;
  },
) => {
  if (options.mode === 'pm')
    dispatch(
      saveBillFormData({
        latter: calculateAdjust(
          amount,
          members.map((v) => ({
            id: v.id,
            method: ShareMethod.PlusMinus,
            value: 0,
          })),
        ),
      }),
    );
  else if (options.sharedPct)
    dispatch(
      saveBillFormData({
        latter: calculateAmount(
          amount,
          members.map((v) => ({
            id: v.id,
            method: ShareMethod.Percentage,
            value: options.sharedPct ?? 0,
          })),
        ),
      }),
    );
  else
    dispatch(
      saveBillFormData({
        latter: calculateAmount(
          amount,
          members.map((v) => ({
            id: v.id,
            method: ShareMethod.Weight,
            value: 1,
          })),
        ),
      }),
    );
};
