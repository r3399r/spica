import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'src/component/celestial-ui/Button';
import DatetimePicker from 'src/component/celestial-ui/DatetimePicker';
import Select from 'src/component/celestial-ui/Select';
import SelectOption from 'src/component/celestial-ui/SelectOption';
import Body from 'src/component/celestial-ui/typography/Body';
import { Page } from 'src/constant/Page';
import { loadBookById } from 'src/service/bookService';
import BillForm from './BilForm';
import Navbar from './Navbar';

const NewTransaction = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [type, setType] = useState<string>('out');

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book));
  }, [id]);

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <Navbar />
          <div className="flex gap-4 pb-4">
            <div className="w-[108px]">
              <Select label={t('newTx.type')} defaultValue={type} onChange={(v) => setType(v)}>
                <SelectOption value="out">{t('desc.out')}</SelectOption>
                <SelectOption value="in">{t('desc.in')}</SelectOption>
                <SelectOption value="transfer">{t('desc.transfer')}</SelectOption>
              </Select>
            </div>
            <div className="flex-1">
              <DatetimePicker
                label={t('newTx.date')}
                initDate={new Date()}
                cancelTxt={t('act.cancel')}
                confirmTxt={t('act.confirm')}
              />
            </div>
          </div>
          {type === 'in' || type === 'out' ? <BillForm type={type} /> : <div>transfer</div>}
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
