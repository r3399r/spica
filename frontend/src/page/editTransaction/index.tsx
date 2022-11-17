import { BillType } from '@y-celestial/spica-service';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'src/component/celestial-ui/Button';
import DatetimePicker from 'src/component/celestial-ui/DatetimePicker';
import Select from 'src/component/celestial-ui/Select';
import SelectOption from 'src/component/celestial-ui/SelectOption';
import NavbarVanilla from 'src/component/NavbarVanilla';
import { Page } from 'src/constant/Page';
import { saveBillFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import { loadBookById } from 'src/service/bookService';
import { addBill, isTxSubmittable } from 'src/service/transactionService';
import BillForm from './BilForm';

const EidtTransaction = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [type, setType] = useState<string>('out');
  const { billFormData } = useSelector((rootState: RootState) => rootState.form);
  const disabled = useMemo(() => !isTxSubmittable(), [billFormData]);

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id]);

  const onSelectType = (value: string) => {
    setType(value);
    if (value === BillType.In || value === BillType.Out)
      dispatch(saveBillFormData({ type: value }));
  };

  const onPickDatetime = (date: Date) => {
    dispatch(saveBillFormData({ date: date.toISOString() }));
  };

  const onSubmit = () => {
    addBill(id ?? 'xx').then((res) => navigate(`${Page.Book}/${id}/tx/${res}`, { replace: true }));
  };

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <NavbarVanilla text={t('editTx.back')} />
          <div className="flex gap-4 pb-4">
            <div className="w-[108px]">
              <Select
                label={t('editTx.type')}
                defaultValue={type}
                onChange={(v) => onSelectType(v)}
              >
                <SelectOption value="out">{t('desc.out')}</SelectOption>
                <SelectOption value="in">{t('desc.in')}</SelectOption>
                <SelectOption value="transfer">{t('desc.transfer')}</SelectOption>
              </Select>
            </div>
            <div className="flex-1">
              <DatetimePicker
                label={t('editTx.date')}
                initDate={new Date()}
                onChange={onPickDatetime}
                cancelTxt={t('act.cancel')}
                confirmTxt={t('act.confirm')}
              />
            </div>
          </div>
          {type === 'in' || type === 'out' ? <BillForm /> : <div>transfer</div>}
        </div>
      </div>
      <div className="fixed bottom-0 h-[104px] w-full">
        <div className="mx-auto w-fit">
          <Button className="mt-5 w-64 h-12 text-base" disabled={disabled} onClick={onSubmit}>
            {t('act.submit')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default EidtTransaction;
