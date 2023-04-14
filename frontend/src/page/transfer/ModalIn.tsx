import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import FormInput from 'src/component/FormInput';
import ModalForm from 'src/component/ModalForm';
import { DataTransferForm, FriendForm } from 'src/model/Form';
import { addFriendIntoBook } from 'src/service/memberService';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalIn = ({ open, handleClose }: Props) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const methods = useForm<DataTransferForm>();

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: DataTransferForm) => {
    // addFriendIntoBook(id ?? 'xx', data.id)
    //   .then(onClose)
    //   .catch(() => methods.setError('id', {}));
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
        name="key"
        label={t('transfer.modalInLabel')}
        autoFocus
        required
        className="mb-5"
      />
    </ModalForm>
  );
};

export default ModalIn;
