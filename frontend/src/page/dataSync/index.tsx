import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Button from 'src/component/Button';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import NavbarVanilla from 'src/component/NavbarVanilla';
import Body from 'src/component/typography/Body';
import H2 from 'src/component/typography/H2';
import IcUnbind from 'src/image/ic-unbind.svg';
import { DataSyncForm } from 'src/model/Form';
import { RootState } from 'src/redux/store';
import { receiveCode } from 'src/service/dataSyncService';
import ModalBind from './ModalBind';
import ModalUnbind from './ModalUnbind';

const DataSync = () => {
  const { t, i18n } = useTranslation();
  const methods = useForm<DataSyncForm>();
  const { emailBinded } = useSelector((rootState: RootState) => rootState.ui);
  const [openModalBind, setOpenModalBind] = useState<boolean>(false);
  const [openModalUnbind, setOpenModalUnbind] = useState<boolean>(false);

  const onSubmit = (data: DataSyncForm) => {
    receiveCode(data.email, i18n.language).finally(() => {
      setOpenModalBind(true);
    });
  };

  return (
    <>
      <div className="mx-[15px] max-w-[640px] sm:mx-auto">
        <NavbarVanilla text={t('dataSync.back')} />
        <H2 className="mt-5">{t('dataSync.head')}</H2>
        <Body className="mb-4 mt-2 text-navy-300" size="l">
          {t('dataSync.hint')}
        </Body>
        {emailBinded ? (
          <div className="relative">
            <div>
              <Body className="mb-[5px]">{t('dataSync.label')}</Body>
              <Body
                size="l"
                className="rounded-[4px] border border-navy-900/30 bg-grey-200 p-2 text-navy-300"
              >
                {emailBinded}
              </Body>
            </div>
            <img
              src={IcUnbind}
              className="absolute bottom-2 right-2 cursor-pointer"
              onClick={() => setOpenModalUnbind(true)}
            />
          </div>
        ) : (
          <Form methods={methods} onSubmit={onSubmit}>
            <FormInput name="email" label={t('dataSync.label')} required type="email" autoFocus />
            <div className="mt-4 flex justify-end">
              <Button type="submit" appearance="default">
                {t('dataSync.receiveCode')}
              </Button>
            </div>
          </Form>
        )}
      </div>
      <ModalBind
        open={openModalBind}
        handleClose={() => setOpenModalBind(false)}
        email={methods.getValues('email')}
      />
      <ModalUnbind open={openModalUnbind} handleClose={() => setOpenModalUnbind(false)} />
    </>
  );
};

export default DataSync;
