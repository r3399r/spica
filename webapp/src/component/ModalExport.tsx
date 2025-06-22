import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ModalVanilla from 'src/component/ModalVanilla';
import Body from 'src/component/typography/Body';
import { loadAllBookById } from 'src/service/bookService';

type Props = {
  open: boolean;
  handleClose: () => void;
  onExport: () => Promise<void>;
  txCount: number;
};

const ModalExport = ({ open, handleClose, onExport, txCount }: Props) => {
  const { t } = useTranslation();
  const { id } = useParams();

  const onConfirm = () => {
    loadAllBookById(id ?? 'x')
      .then(onExport)
      .then(handleClose);
  };

  return (
    <ModalVanilla
      open={open}
      handleClose={handleClose}
      title={t('desc.exportTitle')}
      cancelBtn={t('act.cancel')}
      confirmBtn={t('act.export')}
      onConfirm={onConfirm}
    >
      <Body className="flex-1" size="l">
        {txCount > 50 ? t('desc.exportHintMore', { n: txCount }) : t('desc.exportHint')}
      </Body>
    </ModalVanilla>
  );
};

export default ModalExport;
