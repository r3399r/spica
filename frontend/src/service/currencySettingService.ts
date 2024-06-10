import bookEndpoint from 'src/api/bookEndpoint';
import { CreateCurrencyForm } from 'src/model/Form';
import { setBooks } from 'src/redux/bookSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getLocalDeviceId } from 'src/util/localStorage';

export const createCurrency = async (id: string, data: CreateCurrencyForm) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.postBookIdCurrency(
      id,
      { name: data.name, symbol: data.symbol, exchangeRate: Number(data.exchangeRate) },
      deviceId,
    );

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) =>
      v.id === id
        ? {
            ...v,
            currencies: [...(v.currencies ?? []), res.data],
          }
        : v,
    );

    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};

export const editCurrency = async (id: string, cid: string, data: CreateCurrencyForm) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.putBookIdCurrency(
      id,
      cid,
      {
        name: data.name,
        symbol: data.symbol,
        exchangeRate: data.exchangeRate === '' ? undefined : Number(data.exchangeRate),
      },
      deviceId,
    );

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) =>
      v.id === id
        ? {
            ...v,
            currencies: v.currencies?.map((o) => (o.id === cid ? res.data.currency : o)) ?? null,
            members: res.data.members,
          }
        : v,
    );

    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};

export const setPrimaryCurrency = async (id: string, cid: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await bookEndpoint.putBookIdCurrencyPrimary(id, cid, deviceId);

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) =>
      v.id === id
        ? {
            ...v,
            currencies: res.data.currencies,
            members: res.data.members,
          }
        : v,
    );

    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};

export const removeCurrency = async (id: string, cid: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    await bookEndpoint.deleteBookIdCurrency(id, cid, deviceId);

    const { books } = getState().book;
    const updatedBooks = (books ?? []).map((v) => {
      if (v.id === id) {
        const updatedCurrencies = (v.currencies ?? []).filter((o) => o.id !== cid);

        return {
          ...v,
          currencies: updatedCurrencies,
        };
      }

      return v;
    });

    dispatch(setBooks(updatedBooks));
  } finally {
    dispatch(finishWaiting());
  }
};
