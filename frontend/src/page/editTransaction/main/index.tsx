import { BillType } from '@y-celestial/spica-service';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from 'src/component/celestial-ui/Button';
import DatetimePicker from 'src/component/celestial-ui/DatetimePicker';
import Select from 'src/component/celestial-ui/Select';
import SelectOption from 'src/component/celestial-ui/SelectOption';
import NavbarVanilla from 'src/component/NavbarVanilla';
import { Page } from 'src/constant/Page';
import { saveBillFormData, setTxFormType } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import { loadBookById } from 'src/service/bookService';
import { addBill, isTxSubmittable, reviseBill } from 'src/service/transactionService';
import BillForm from './BilForm';
import TransferForm from './TransferForm';

const Main = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { txFormType, billFormData, transferFormData } = useSelector(
    (rootState: RootState) => rootState.form,
  );
  const disabled = useMemo(() => !isTxSubmittable(), [txFormType, billFormData, transferFormData]);
  const state = location.state as { isEdit: string } | null;
  const isEdit = useMemo(() => state !== null, [location.state]);

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id]);

  const onSelectType = (value: string) => {
    if (value === BillType.In || value === BillType.Out) {
      dispatch(saveBillFormData({ type: value }));
      dispatch(setTxFormType('bill'));
    } else if (value === 'transfer') dispatch(setTxFormType('transfer'));
  };

  const onPickDatetime = (date: Date) => {
    dispatch(saveBillFormData({ date: date.toISOString() }));
  };

  const onSubmit = () => {
    if (isEdit) reviseBill(id ?? 'xx', state?.isEdit ?? 'yy').then(() => navigate(-1));
    else
      addBill(id ?? 'xx').then((res) =>
        navigate(`${Page.Book}/${id}/tx/${res}`, { replace: true }),
      );
  };

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <NavbarVanilla text={isEdit ? t('editTx.backToTx') : t('editTx.backToList')} />
          <div className="flex gap-4 pb-4">
            <div className="w-[108px]">
              <Select
                label={t('editTx.type')}
                defaultValue={billFormData.type}
                onChange={(v) => onSelectType(v)}
                disabled={isEdit}
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
          {txFormType === 'bill' ? <BillForm /> : <TransferForm />}
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

export default Main;
