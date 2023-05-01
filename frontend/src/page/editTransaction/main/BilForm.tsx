import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AmountInput from 'src/component/AmountInput';
import Divider from 'src/component/Divider';
import Input from 'src/component/Input';
import Textarea from 'src/component/Textarea';
import useBook from 'src/hook/useBook';
import { BillForm as Form } from 'src/model/Form';
import { saveBillFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import { addMemberToBillFormer, getDeviceId } from 'src/service/transactionService';
import Former from './Former';
import Latter from './Latter';

const BillForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { billFormData } = useSelector((rootState: RootState) => rootState.form);
  const { isDeviceReady } = useSelector((rootState: RootState) => rootState.ui);
  const book = useBook();
  const members = useMemo(() => book?.members, [book]);
  const self = useMemo(() => {
    if (!members || !isDeviceReady) return null;

    return members.find((v) => v.deviceId === getDeviceId())?.id ?? null;
  }, [members, isDeviceReady]);

  useEffect(() => {
    if (self && billFormData.former === undefined) addMemberToBillFormer(self);
  }, [self]);

  const saveFormData = (data: Partial<Form>) => {
    dispatch(saveBillFormData(data));
  };

  return (
    <>
      <div className="pb-4">
        <Input
          label={t('editTx.descr')}
          defaultValue={billFormData.descr}
          onChange={(e) => saveFormData({ descr: e.target.value })}
        />
      </div>
      <div className="pb-4">
        <AmountInput
          symbol={book?.symbol ?? '$'}
          decimal={2}
          label={t('editTx.amount')}
          defaultValue={billFormData.amount}
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
      </div>
      <Former />
      <Divider className="my-[15px]" />
      <Latter />
      <Divider className="my-[15px]" />
      <Textarea
        label={t('desc.memo')}
        defaultValue={billFormData.memo}
        onChange={(e) => saveFormData({ memo: e.target.value })}
      />
    </>
  );
};

export default BillForm;
