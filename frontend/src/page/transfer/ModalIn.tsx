import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormInput from 'src/component/FormInput';
import ModalForm from 'src/component/ModalForm';
import { DataTransferForm } from 'src/model/Form';
import { sendToken } from 'src/service/transferService';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalIn = ({ open, handleClose }: Props) => {
  const { t } = useTranslation();
  const methods = useForm<DataTransferForm>();

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: DataTransferForm) => {
    sendToken(data.token)
      .then(onClose)
      .catch(() => methods.setError('token', {}));
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
      <FormInput
        name="token"
        label={t('transfer.modalInLabel')}
        autoFocus
        required
        className="mb-5"
      />
    </ModalForm>
  );
};

export default ModalIn;
