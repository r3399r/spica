import bookEndpoint from 'src/api/bookEndpoint';
import { BillType, ShareMethod } from 'src/constant/backend/Book';
import { Member } from 'src/model/backend/entity/Member';
import { ShareDetail, Transaction } from 'src/model/backend/type/Book';
import { Detail } from 'src/model/Book';
import { setBooks } from 'src/redux/bookSlice';
import { saveBillFormData } from 'src/redux/formSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getMaxIndex, getMinIndex } from 'src/util/algorithm';
import { bn } from 'src/util/bignumber';
import { getLocalDeviceId } from 'src/util/localStorage';
import { randomPick } from 'src/util/random';

export const deleteTx = async (bookId: string, type: 'in' | 'out' | 'transfer', txId: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();

    let members: Member[];
    let transaction: Transaction;
    if (type === 'transfer') {
      const res = await bookEndpoint.deleteBookIdTransfer(bookId, txId, deviceId);
      members = res.data.members;
      transaction = res.data.transaction;
    } else {
      const res = await bookEndpoint.deleteBookIdBill(bookId, txId, deviceId);
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
  const { txFormType, billFormData, transferFormData } = getState().form;
  if (txFormType === 'bill') {
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
  } else {
    if (!transferFormData.amount) return false;
    if (
      !transferFormData.srcMemberId ||
      !transferFormData.dstMemberId ||
      transferFormData.srcMemberId === transferFormData.dstMemberId
    )
      return false;
  }

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

const calculateAdjust = (total: number, detail: Detail[]): ShareDetail[] => {
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
      amount: amount.gt(0) ? amount.plus(v.value) : bn(v.value),
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

const getBillData = () => {
  const { billFormData } = getState().form;
  if (
    billFormData.date === undefined ||
    billFormData.type === undefined ||
    billFormData.descr === undefined ||
    billFormData.amount === undefined ||
    billFormData.former === undefined ||
    billFormData.latter === undefined
  )
    throw new Error('unexpected');

  return {
    date: billFormData.date,
    type: billFormData.type as BillType,
    descr: billFormData.descr,
    amount: billFormData.amount,
    former: billFormData.former,
    latter: billFormData.latter,
    memo: billFormData.memo === '' ? undefined : billFormData.memo,
  };
};

const addBill = async (bookId: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.postBookIdBill(bookId, getBillData(), deviceId);

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) =>
      v.id === bookId
        ? {
            ...v,
            members: res.data.members,
            transactions: [res.data.transaction, ...(v.transactions ?? [])],
            txCount: v.txCount ? v.txCount + 1 : 1,
          }
        : v,
    );
    dispatch(setBooks(updatedBooks));

    return res.data.transaction.id;
  } finally {
    dispatch(finishWaiting());
  }
};

const reviseBill = async (bookId: string, billId: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.putBookIdBill(bookId, billId, getBillData(), deviceId);

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

const getTransferData = () => {
  const { transferFormData } = getState().form;
  if (
    transferFormData.date === undefined ||
    transferFormData.amount === undefined ||
    transferFormData.srcMemberId === undefined ||
    transferFormData.dstMemberId === undefined
  )
    throw new Error('unexpected');

  return {
    date: transferFormData.date,
    amount: transferFormData.amount,
    srcMemberId: transferFormData.srcMemberId,
    dstMemberId: transferFormData.dstMemberId,
    memo: transferFormData.memo === '' ? undefined : transferFormData.memo,
  };
};

const addTransfer = async (bookId: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.postBookIdTransfer(bookId, getTransferData(), deviceId);

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) =>
      v.id === bookId
        ? {
            ...v,
            members: res.data.members,
            transactions: [res.data.transaction, ...(v.transactions ?? [])],
            txCount: v.txCount ? v.txCount + 1 : 1,
          }
        : v,
    );
    dispatch(setBooks(updatedBooks));

    return res.data.transaction.id;
  } finally {
    dispatch(finishWaiting());
  }
};

const reviseTransfer = async (bookId: string, transferId: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.putBookIdTransfer(
      bookId,
      transferId,
      getTransferData(),
      deviceId,
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

export const addTransaction = async (bookId: string) => {
  const { txFormType } = getState().form;
  if (txFormType === 'bill') return await addBill(bookId);
  else return await addTransfer(bookId);
};

export const reviseTransaction = async (bookId: string, txId: string) => {
  const { txFormType } = getState().form;
  if (txFormType === 'bill') await reviseBill(bookId, txId);
  else await reviseTransfer(bookId, txId);
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
