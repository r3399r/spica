import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ModalForm from 'src/component/ModalForm';
import Radio from 'src/component/Radio';
import Body from 'src/component/typography/Body';
import useBook from 'src/hook/useBook';
import { CurrencySelectForm } from 'src/model/Form';
import { saveBillFormData, saveTransferFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const CurrencyModal = ({ open, handleClose }: Props) => {
  const { t } = useTranslation();
  const methods = useForm<CurrencySelectForm>();
  const dispatch = useDispatch();
  const book = useBook();
  const currencies = useMemo(() => book?.currencies, [book]);
  const isMultiple = useMemo(() => (currencies?.length ?? 0) > 1, [currencies]);
  const { txFormType, billFormData, transferFormData } = useSelector(
    (rootState: RootState) => rootState.form,
  );

  useEffect(() => {
    methods.setValue(
      'id',
      (txFormType === 'bill' ? billFormData.currencyId : transferFormData.currencyId) ?? '',
    );
  }, [open]);

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: CurrencySelectForm) => {
    dispatch(saveBillFormData({ currencyId: data.id }));
    dispatch(saveTransferFormData({ currencyId: data.id }));
    handleClose();
  };

  if (!currencies) return <></>;

  return (
    <ModalForm
      methods={methods}
      onSubmit={onSubmit}
      open={open}
      handleClose={onClose}
      cancelBtn={t('act.cancel')}
      confirmBtn={t('act.confirm')}
    >
      <>
        <div className="mb-[15px]">
          {currencies.map((v) => (
            <Radio
              key={v.id}
              {...methods.register('id')}
              id={v.id}
              label={`${isMultiple ? v.name : ''}${v.symbol}`}
              value={v.id}
            />
          ))}
        </div>
        <Body size="l" className="mb-[30px]">
          {t('editTx.currencyHint')}
        </Body>
      </>
    </ModalForm>
  );
};

export default CurrencyModal;
