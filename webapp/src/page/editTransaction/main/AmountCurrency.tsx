import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import NumberInput from 'src/component/NumberInput';
import Body from 'src/component/typography/Body';
import useBook from 'src/hook/useBook';
import IcSelect from 'src/image/ic-select.svg';
import { BillForm as Form } from 'src/model/Form';
import { saveBillFormData, saveTransferFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import { bn } from 'src/util/bignumber';
import CurrencyModal from './CurrencyModal';

const AmountCurrency = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const { txFormType, billFormData, transferFormData } = useSelector(
    (rootState: RootState) => rootState.form,
  );
  const dispatch = useDispatch();
  const book = useBook();
  const isMultiple = useMemo(() => (book?.currencies?.length ?? 0) > 1, [book]);
  const currentCurrency = useMemo(
    () =>
      book?.currencies?.find(
        (v) =>
          v.id === (txFormType === 'bill' ? billFormData.currencyId : transferFormData.currencyId),
      ),
    [book, txFormType, billFormData, transferFormData],
  );
  const mainCurrency = useMemo(() => book?.currencies?.find((v) => v.isPrimary === true), [book]);

  useEffect(() => {
    const primaryCurrency = book?.currencies?.find((v) => v.isPrimary === true);
    if (!billFormData.currencyId) dispatch(saveBillFormData({ currencyId: primaryCurrency?.id }));
    if (!transferFormData.currencyId)
      dispatch(saveTransferFormData({ currencyId: primaryCurrency?.id }));
  }, [book]);

  const saveFormData = (data: Partial<Form>) => {
    dispatch(saveBillFormData(data));
    dispatch(saveTransferFormData(data));
  };

  return (
    <div className="flex gap-4 pb-4">
      <div className="w-[108px]">
        <Body>{t('editTx.currency')}</Body>
        <div
          className="mt-[5px] flex h-[40px] cursor-pointer items-center justify-between rounded bg-grey-200 p-2"
          onClick={() => setOpen(true)}
        >
          <Body size="l">
            {isMultiple ? currentCurrency?.name : ''}
            {currentCurrency?.symbol}
          </Body>
          <img src={IcSelect} />
        </div>
      </div>
      <div className="flex-1">
        <NumberInput
          decimal={2}
          label={t('editTx.amount')}
          defaultValue={txFormType === 'bill' ? billFormData.amount : transferFormData.amount}
          onChange={(e) => {
            saveFormData({
              amount: Number(e.target.value),
              former:
                billFormData.former?.length === 1
                  ? [{ ...billFormData.former[0], amount: Number(e.target.value) }]
                  : billFormData.former,
            });
          }}
        />
        {mainCurrency && currentCurrency && currentCurrency.id !== mainCurrency.id && (
          <Body size="s" className="mt-[5px] text-navy-300">{`≈${mainCurrency.name}${
            mainCurrency.symbol
          }${bn((txFormType === 'bill' ? billFormData.amount : transferFormData.amount) ?? 0)
            .times(currentCurrency?.exchangeRate ?? 0)
            .dp(2)
            .toFormat()}`}</Body>
        )}
      </div>
      <CurrencyModal open={open} handleClose={() => setOpen(false)} />
    </div>
  );
};

export default AmountCurrency;
