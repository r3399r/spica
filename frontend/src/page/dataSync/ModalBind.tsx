import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import FormInput from 'src/component/FormInput';
import ModalForm from 'src/component/ModalForm';
import Body from 'src/component/typography/Body';
import { DataSyncCodeForm } from 'src/model/Form';
import { setSnackbarMessage } from 'src/redux/uiSlice';
import { bind } from 'src/service/dataSyncService';

type Props = {
  open: boolean;
  handleClose: () => void;
  email: string;
};

const ModalBind = ({ open, handleClose, email }: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const methods = useForm<DataSyncCodeForm>();

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: DataSyncCodeForm) => {
    bind(email, data.code).then(() => {
      dispatch(setSnackbarMessage(t('dataSync.bindSuccess')));
      onClose();
    });
  };

  return (
    <ModalForm
      methods={methods}
      onSubmit={onSubmit}
      open={open}
      handleClose={onClose}
      cancelBtn={t('act.cancel')}
      confirmBtn={t('act.submit')}
    >
      <>
        <Body size="l">{t('dataSync.bindHint')}</Body>
        <FormInput
          name="code"
          type="number"
          autoFocus
          required
          placeholder={t('dataSync.bindPlaceholder')}
          className="mb-5 mt-4"
        />
      </>
    </ModalForm>
  );
};

export default ModalBind;
