import { useTranslation } from 'react-i18next';
import ModalVanilla from 'src/component/ModalVanilla';
import Body from 'src/component/typography/Body';
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
      <Body size="l" className="mb-5">
        {t('editPayment.deleteHint')}
      </Body>
    </ModalVanilla>
  );
};

export default ModalDelete;
