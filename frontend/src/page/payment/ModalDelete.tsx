import { useTranslation } from 'react-i18next';
import ModalVanilla from 'src/component/ModalVanilla';
import { deleteBankAccount } from 'src/service/paymentService';

type Props = {
  open: boolean;
  handleClose: () => void;
  bankAccountId?: string;
};

const ModalDelete = ({ open, handleClose, bankAccountId }: Props) => {
  const { t } = useTranslation();

  const onDelete = () => {
    if (!bankAccountId) return;
    deleteBankAccount(bankAccountId);
    handleClose();
  };

  return (
    <ModalVanilla
      open={open}
      handleClose={handleClose}
      cancelBtn={t('act.cancel')}
      deleteBtn={t('act.delete')}
      onDelete={onDelete}
    >
      <div>{t('editPayment.deleteHint')}</div>
    </ModalVanilla>
  );
};

export default ModalDelete;
