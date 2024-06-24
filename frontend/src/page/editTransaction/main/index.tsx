import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from 'src/component/Button';
import DatetimePicker from 'src/component/DatetimePicker';
import NavbarVanilla from 'src/component/NavbarVanilla';
import Select from 'src/component/Select';
import SelectOption from 'src/component/SelectOption';
import { BillType } from 'src/constant/backend/Book';
import { Page } from 'src/constant/Page';
import { saveBillFormData, saveTransferFormData, setTxFormType } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import { loadBookById } from 'src/service/bookService';
import { addTransaction, isTxSubmittable, reviseTransaction } from 'src/service/transactionService';
import BillForm from './BillForm';
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
  const state = location.state as { txId: string } | null;
  const isEdit = useMemo(() => state !== null, [location.state]);
  const date = useMemo(() => {
    const formDate = txFormType === 'bill' ? billFormData.date : transferFormData.date;

    return formDate ? new Date(formDate) : new Date();
  }, []);

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id]);

  useEffect(() => {
    dispatch(saveBillFormData({ date: date.toISOString() }));
    dispatch(saveTransferFormData({ date: date.toISOString() }));
  }, [date]);

  const onSelectType = (value: string) => {
    if (value === BillType.In || value === BillType.Out) {
      dispatch(saveBillFormData({ type: value }));
      dispatch(setTxFormType('bill'));
    } else if (value === 'transfer') dispatch(setTxFormType('transfer'));
  };

  const onPickDatetime = (date: Date) => {
    dispatch(saveBillFormData({ date: date.toISOString() }));
    dispatch(saveTransferFormData({ date: date.toISOString() }));
  };

  const onSubmit = () => {
    if (isEdit) reviseTransaction(id ?? 'xx', state?.txId ?? 'yy').then(() => navigate(-1));
    else
      addTransaction(id ?? 'xx').then((res) =>
        navigate(`${Page.Book}/${id}/tx/${res}`, { replace: true }),
      );
  };

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="mx-[15px] max-w-[640px] sm:mx-auto">
          <NavbarVanilla text={t('act.back')} />
          <div className="flex gap-4 pb-4">
            <div className="w-[108px]">
              <Select
                label={t('editTx.type')}
                defaultValue={txFormType === 'bill' ? billFormData.type : 'transfer'}
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
                initDate={date}
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
          <Button className="mt-5 h-12 w-64 text-base" disabled={disabled} onClick={onSubmit}>
            {t('act.submit')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Main;
