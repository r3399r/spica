import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from 'src/component/celestial-ui/Button';
import DatetimePicker from 'src/component/celestial-ui/DatetimePicker';
import Divider from 'src/component/celestial-ui/Divider';
import Form from 'src/component/celestial-ui/Form';
import FormInput from 'src/component/celestial-ui/FormInput';
import FormNumberInput from 'src/component/celestial-ui/FormNumberInput';
import FormTextarea from 'src/component/celestial-ui/FormTextarea';
import Select from 'src/component/celestial-ui/Select';
import SelectOption from 'src/component/celestial-ui/SelectOption';
import Body from 'src/component/celestial-ui/typography/Body';
import { BillForm } from 'src/model/Form';
import Navbar from './Navbar';

const NewTransaction = () => {
  const { t } = useTranslation();
  const methods = useForm<BillForm>();
  const [value, setValue] = useState<Date>(new Date());

  const onSubmit = (data: BillForm) => {
    console.log(data);
  };

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <Navbar />
          <Form onSubmit={onSubmit} methods={methods}>
            <div className="flex gap-4 pb-4">
              <div className="w-[108px]">
                <Select label={t('newTx.type')}>
                  <SelectOption value="out">{t('desc.out')}</SelectOption>
                  <SelectOption value="in">{t('desc.in')}</SelectOption>
                  <SelectOption value="transfer">{t('desc.transfer')}</SelectOption>
                </Select>
              </div>
              <div className="flex-1">
                <DatetimePicker
                  label={t('newTx.date')}
                  initValue={new Date()}
                  value={value}
                  setValue={setValue}
                  cancelTxt={t('act.cancel')}
                  confirmTxt={t('act.confirm')}
                />
              </div>
            </div>
            <div className="pb-4">
              <FormInput name="descr" label={t('newTx.descr')} required />
            </div>
            <div className="pb-4">
              <FormNumberInput decimal={2} name="amount" label={t('newTx.amount')} />
            </div>
            <Body>{t('desc.payer')}</Body>
            <Divider />
            <Body>{t('desc.sharer')}</Body>
            <Divider />
            <FormTextarea name="memo" label={t('desc.memo')} />
            <button className="hidden" />
          </Form>
        </div>
      </div>
      <div className="fixed bottom-0 h-[104px] w-full">
        <div className="mx-auto w-fit">
          <Button className="mt-5 w-64 h-12">
            <div className="flex justify-center">
              <Body size="l" bold className="text-white">
                {t('act.submit')}
              </Body>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default NewTransaction;
