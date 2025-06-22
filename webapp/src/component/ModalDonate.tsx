import { useTranslation } from 'react-i18next';
import ModalVanilla from 'src/component/ModalVanilla';
import Body from 'src/component/typography/Body';
import { ECPayLink, PaypalLink } from 'src/constant/Page';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalDonate = ({ open, handleClose }: Props) => {
  const { t } = useTranslation();

  const onClose = () => {
    handleClose();
  };

  return (
    <ModalVanilla
      open={open}
      handleClose={onClose}
      title={t('donateModal.title')}
      deleteBtn={t('donateModal.paypal')}
      confirmBtn={t('donateModal.ecpay')}
      onDelete={() => window.open(PaypalLink, '_blank')}
      onConfirm={() => window.open(ECPayLink, '_blank')}
    >
      <Body size="l">{t('donateModal.note')}</Body>
    </ModalVanilla>
  );
};

export default ModalDonate;
