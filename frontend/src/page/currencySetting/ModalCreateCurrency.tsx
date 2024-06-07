import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormInput from 'src/component/FormInput';
import FormNumberInput from 'src/component/FormNumberInput';
import ModalForm from 'src/component/ModalForm';
import Body from 'src/component/typography/Body';
import useBook from 'src/hook/useBook';
import { CreateCurrencyForm, RenameBookForm } from 'src/model/Form';
import { createCurrency, renameBook } from 'src/service/bookSettingService';
import ModalSymbolSelect from './ModalSymbolSelect';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalCreateCurrency = ({ open, handleClose }: Props) => {
  const { t } = useTranslation();
  const methods = useForm<CreateCurrencyForm>({
    defaultValues: { name: '', symbol: '$', exchangeRate: '' },
  });
  const book = useBook();
  const primaryCurrency = useMemo(
    () => book?.currencies?.find((v) => v.isPrimary === true),
    [book],
  );
  const [modalSymbolOpen, setModalSymbolOpen] = useState<boolean>(false);
  const watchName = methods.watch('name');

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: CreateCurrencyForm) => {
    if (!book) return;
    createCurrency(book.id, data).then(onClose);
  };

  return (
    <>
      <ModalForm
        methods={methods}
        onSubmit={onSubmit}
        open={open}
        handleClose={onClose}
        title={t('currencySetting.createCurrency')}
        cancelBtn={t('act.cancel')}
        confirmBtn={t('act.submit')}
      >
        <div className="mb-5 flex flex-col gap-4">
          <FormInput name="name" label={t('currencySetting.name')} autoFocus required />
          <div>
            <Body>{t('currencySetting.symbol')}</Body>
            <Body
              size="l"
              className="mt-[5px] cursor-pointer bg-grey-200 p-2"
              onClick={() => setModalSymbolOpen(true)}
            >
              {methods.getValues('symbol')}
            </Body>
          </div>
          <div>
            <Body>{t('currencySetting.exchangeRate')}</Body>
            <div className="mt-[5px] flex items-center gap-[5px]">
              <Body size="l" className="flex-1">
                1 {methods.getValues('name') === '' ? '--' : watchName}
              </Body>
              <Body size="l">=</Body>
              <FormNumberInput name="exchangeRate" decimal={6} className="flex-1 bg-grey-200 p-2" />
              <Body size="l">{primaryCurrency?.name}</Body>
            </div>
          </div>
        </div>
      </ModalForm>
      <ModalSymbolSelect
        open={modalSymbolOpen}
        onClose={() => setModalSymbolOpen(false)}
        value={methods.getValues('symbol')}
        setValue={(value) => methods.setValue('symbol', value)}
      />
    </>
  );
};

export default ModalCreateCurrency;
