import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Page } from 'src/constant/Page';
import IcEdit from 'src/image/ic-edit-tx.svg';
import { BillForm } from 'src/model/Form';
import { RootState } from 'src/redux/store';
import { loadBookById } from 'src/service/bookService';
import { randomPick } from 'src/util/random';
import Navbar from './Navbar';

const NewTransaction = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const methods = useForm<BillForm>();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const members = useMemo(() => books?.find((v) => v.id === id)?.members, [books]);
  const [value, setValue] = useState<Date>(new Date());

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book));
  }, [id]);

  const onSubmit = (data: BillForm) => {
    console.log(data);
  };

  if (!members) return <></>;

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <Navbar />
          <Form onSubmit={onSubmit} methods={methods}>
            <div className="flex gap-4 pb-4">
              <div className="w-[108px]">
                <Select label={t('newTx.type')} defaultValue="out">
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
            <Body className="mb-[5px] text-navy-700">{t('desc.payer')}</Body>
            <div className="flex justify-between gap-[10px]">
              <div className="ml-[10px] flex justify-between flex-1">
                <Body size="l">{randomPick(members).nickname}</Body>
                <Body size="l" className="text-navy-300">
                  {t('newTx.all')}
                </Body>
              </div>
              <div>
                <img src={IcEdit} className="cursor-pointer" />
              </div>
            </div>
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
