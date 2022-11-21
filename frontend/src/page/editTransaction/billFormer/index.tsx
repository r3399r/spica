import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from 'src/component/celestial-ui/Button';
import Checkbox from 'src/component/celestial-ui/Checkbox';
import Divider from 'src/component/celestial-ui/Divider';
import NumberInput from 'src/component/celestial-ui/NumberInput';
import Body from 'src/component/celestial-ui/typography/Body';
import H2 from 'src/component/celestial-ui/typography/H2';
import { RootState } from 'src/redux/store';
import Navbar from './Navbar';

const BillFormer = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const {
    book: { books },
    form: { billFormData },
  } = useSelector((rootState: RootState) => rootState);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const members = useMemo(() => books?.find((v) => v.id === id)?.members ?? [], [books]);

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <Navbar />
          <div className="flex justify-between items-center">
            <H2>{`${book?.symbol}${billFormData.amount ?? 0}`}</H2>
            <Body>{`${t('editTx.remaining', {
              symbol: book?.symbol,
              amount: '-',
            })}`}</Body>
          </div>
          <Divider className="my-[15px]" />
          <div className="flex">
            <div className="flex-1" />
            <Body className="w-[90px]" size="s">
              {t('editTx.amount')}
            </Body>
          </div>
          {members.map((v) => (
            <div key={v.id} className="flex h-[60px] items-center">
              <Checkbox
                id={v.id}
                defaultChecked={billFormData.former?.find((o) => o.id === v.id) !== undefined}
              />
              <label htmlFor={v.id} className="flex-1 pl-3 mr-3">
                {v.nickname}
              </label>
              <NumberInput decimal={2} className="w-[90px]" />
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 h-[104px] w-full">
        <div className="mx-10 flex gap-5">
          <Button className="mt-5 w-full h-12 text-base" appearance="secondary">
            {t('act.reset')}
          </Button>
          <Button className="mt-5 w-full h-12 text-base">{t('act.confirm')}</Button>
        </div>
      </div>
    </>
  );
};

export default BillFormer;
