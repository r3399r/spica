import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import NavbarVanilla from 'src/component/NavbarVanilla';
import Select from 'src/component/Select';
import SelectOption from 'src/component/SelectOption';
import H2 from 'src/component/typography/H2';
import { Bank } from 'src/model/backend/entity/Bank';
import { BankAccount } from 'src/model/backend/entity/BankAccount';
import { PaymentForm } from 'src/model/Form';
import { createBankAccount, getBankList, updateBankAccount } from 'src/service/paymentService';

const EditPayment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { target: BankAccount } | null;
  const [bank, setBank] = useState<Bank[]>();
  const methods = useForm<PaymentForm>({
    defaultValues: {
      code: state?.target.bankCode ?? '',
      account: state?.target.accountNumber ?? '',
    },
  });

  useEffect(() => {
    getBankList().then((res) =>
      setBank([
        {
          id: 'not-bank',
          code: '',
          name: t('editPayment.notBank'),
          dateCreated: '',
          dateUpdated: '',
        },
        ...res,
      ]),
    );
  }, [t]);

  const onSelect = (value: string) => {
    if (value.includes(t('editPayment.notBank')))
      methods.setValue('code', t('editPayment.notBank'));
    else methods.setValue('code', value);
  };

  const onSubmit = (data: PaymentForm) => {
    if (state?.target) updateBankAccount(state.target.id, data).then(() => navigate(-1));
    else createBankAccount(data).then(() => navigate(-1));
  };

  const onCancel = () => {
    methods.reset();
    navigate(-1);
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="mx-[15px] max-w-[640px] sm:mx-auto">
          <NavbarVanilla text={t('editPayment.back')} />
          <H2 className="mt-5">{t('editPayment.head')}</H2>
          {bank && (
            <>
              <div className="mb-4 mt-5">
                <Select
                  label={t('editPayment.bank')}
                  onChange={onSelect}
                  defaultValue={methods.getValues('code')}
                >
                  {bank.map((v) => (
                    <SelectOption key={v.id} value={`${v.code} ${v.name}`}>
                      {v.code} {v.name}
                    </SelectOption>
                  ))}
                </Select>
              </div>
              <FormInput name="account" label={t('editPayment.accountNumber')} />
            </>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 flex h-[104px] w-full justify-center">
        <div className="mx-9 flex w-full max-w-[640px] gap-5">
          <Button
            className="mt-5 h-12 w-full text-base"
            appearance="secondary"
            type="button"
            onClick={onCancel}
          >
            {t('act.cancel')}
          </Button>
          <Button
            className="mt-5 h-12 w-full text-base"
            type="submit"
            disabled={
              (methods.watch('account') ?? '').length === 0 ||
              (methods.watch('code') ?? '').length === 0
            }
          >
            {t('act.confirm')}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default EditPayment;
