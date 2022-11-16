import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Divider from 'src/component/celestial-ui/Divider';
import Form from 'src/component/celestial-ui/Form';
import FormInput from 'src/component/celestial-ui/FormInput';
import FormNumberInput from 'src/component/celestial-ui/FormNumberInput';
import FormTextarea from 'src/component/celestial-ui/FormTextarea';
import Body from 'src/component/celestial-ui/typography/Body';
import IcEdit from 'src/image/ic-edit-tx.svg';
import { BillForm as FormType } from 'src/model/Form';
import Former from './Former';

type Props = {
  type: 'in' | 'out';
};

const BillForm = ({ type }: Props) => {
  const { t } = useTranslation();
  const methods = useForm<FormType>();

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  return (
    <Form onSubmit={onSubmit} methods={methods}>
      <div className="pb-4">
        <FormInput name="descr" label={t('newTx.descr')} required />
      </div>
      <div className="pb-4">
        <FormNumberInput decimal={2} name="amount" label={t('newTx.amount')} />
      </div>
      <Former type={type} />
      <Divider className="my-[15px]" />
      <Body className="mb-[5px] text-navy-700">{t('desc.sharer')}</Body>
      <div className="flex justify-between gap-[10px]">
        <div className="ml-[10px] flex justify-between flex-1">
          <Body size="l">{t('newTx.allShare')}</Body>
        </div>
        <div>
          <img src={IcEdit} className="cursor-pointer" />
        </div>
      </div>
      <Divider className="my-[15px]" />
      <FormTextarea name="memo" label={t('desc.memo')} />
      <button className="hidden" />
    </Form>
  );
};

export default BillForm;
