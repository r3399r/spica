import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Divider from 'src/component/celestial-ui/Divider';
import Input from 'src/component/celestial-ui/Input';
import NumberInput from 'src/component/celestial-ui/NumberInput';
import Textarea from 'src/component/celestial-ui/Textarea';
import Body from 'src/component/celestial-ui/typography/Body';
import IcEdit from 'src/image/ic-edit-tx.svg';
import { BillForm as Form } from 'src/model/Form';
import { resetBillFormData, saveBillFormData } from 'src/redux/formSlice';
import Former from './Former';

const BillForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(
    () => () => {
      dispatch(resetBillFormData());
    },
    [],
  );

  const saveFormData = (data: Partial<Form>) => {
    dispatch(saveBillFormData(data));
  };

  return (
    <>
      <div className="pb-4">
        <Input
          label={t('editTx.descr')}
          onChange={(e) => saveFormData({ descr: e.target.value })}
        />
      </div>
      <div className="pb-4">
        <NumberInput
          decimal={2}
          label={t('editTx.amount')}
          onChange={(e) => saveFormData({ amount: Number(e.target.value) })}
        />
      </div>
      <Former />
      <Divider className="my-[15px]" />
      <Body className="mb-[5px] text-navy-700">{t('desc.sharer')}</Body>
      <div className="flex justify-between gap-[10px]">
        <div className="ml-[10px] flex justify-between flex-1">
          <Body size="l">{t('editTx.allShare')}</Body>
        </div>
        <div>
          <img src={IcEdit} className="cursor-pointer" />
        </div>
      </div>
      <Divider className="my-[15px]" />
      <Textarea label={t('desc.memo')} onChange={(e) => saveFormData({ memo: e.target.value })} />
    </>
  );
};

export default BillForm;
