import { useTranslation } from 'react-i18next';
import ModalVanilla from 'src/component/ModalVanilla';
import Body from 'src/component/typography/Body';
import { DonateLink } from 'src/constant/Page';

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
      title={t('bookDetail.donateTitle')}
      confirmBtn={t('act.confirm')}
      onConfirm={() => window.open(DonateLink, '_blank')}
    >
      <Body size="l">{t('bookDetail.donateNote')}</Body>
    </ModalVanilla>
  );
};

export default ModalDonate;
