import bankAccountEndpoint from 'src/api/bankAccountEndpoint';
import { PaymentForm } from 'src/model/Form';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, setBankList, setPaymentList, startWaiting } from 'src/redux/uiSlice';
import { getLocalDeviceId } from 'src/util/localStorage';

export const getBankAccountList = async (id: string | null) => {
  try {
    dispatch(startWaiting());
    dispatch(setPaymentList(null));

    const deviceId = id ?? getLocalDeviceId();
    const res = await bankAccountEndpoint.getBankAccount(deviceId);

    dispatch(setPaymentList(res.data));
  } finally {
    dispatch(finishWaiting());
  }
};

export const getBankList = async () => {
  try {
    dispatch(startWaiting());

    const { bankList } = getState().ui;

    if (bankList === null) {
      const res = await bankAccountEndpoint.getBankAccountBank();
      dispatch(setBankList(res.data));

      return res.data;
    }

    return bankList;
  } finally {
    dispatch(finishWaiting());
  }
};

export const createBankAccount = async (data: PaymentForm) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await bankAccountEndpoint.postBankAccount(
      {
        bankCode: data.code,
        accountNumber: data.account,
      },
      deviceId,
    );

    dispatch(setPaymentList(res.data));
  } finally {
    dispatch(finishWaiting());
  }
};

export const updateBankAccount = async (id: string, data: PaymentForm) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await bankAccountEndpoint.putBankAccount(
      id,
      {
        bankCode: data.code,
        accountNumber: data.account,
      },
      deviceId,
    );

    dispatch(setPaymentList(res.data));
  } finally {
    dispatch(finishWaiting());
  }
};

export const deleteBankAccount = async (id: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await bankAccountEndpoint.deleteBankAccount(id, deviceId);

    dispatch(setPaymentList(res.data));
  } finally {
    dispatch(finishWaiting());
  }
};
