import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Divider from 'src/celestial-ui/component/Divider';
import Input from 'src/celestial-ui/component/Input';
import Textarea from 'src/celestial-ui/component/Textarea';
import AmountInput from 'src/component/AmountInput';
import { BillForm as Form } from 'src/model/Form';
import { saveBillFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import Former from './Former';
import Latter from './Latter';

const BillForm = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    book: { books },
    form: { billFormData },
  } = useSelector((rootState: RootState) => rootState);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);

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
          onChange={(e) => saveFormData({ amount: Number(e.target.value) })}
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
