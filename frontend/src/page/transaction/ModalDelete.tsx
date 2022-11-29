import { Transaction } from '@y-celestial/spica-service';
import { useTranslation } from 'react-i18next';
import ModalVanilla from 'src/celestial-ui/component/ModalVanilla';
import { deleteTx } from 'src/service/transactionService';

type Props = {
  open: boolean;
  handleClose: () => void;
  tx?: Transaction;
};

const ModalDelete = ({ open, handleClose, tx }: Props) => {
  const { t } = useTranslation();

  const onDelete = () => {
    if (!tx) return;
    deleteTx(tx.bookId, tx.type, tx.id).then(handleClose);
  };

  return (
    <ModalVanilla
      open={open}
      handleClose={handleClose}
      cancelBtn={t('act.cancel')}
      deleteBtn={t('act.delete')}
      onDelete={onDelete}
    >
      <div>{t('transaction.deleteHint')}</div>
    </ModalVanilla>
  );
};

export default ModalDelete;
