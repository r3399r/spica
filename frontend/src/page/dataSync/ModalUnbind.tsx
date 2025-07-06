import { useTranslation } from 'react-i18next';
import ModalVanilla from 'src/component/ModalVanilla';
import Body from 'src/component/typography/Body';
import H2 from 'src/component/typography/H2';
import { unbind } from 'src/service/dataSyncService';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalUnbind = ({ open, handleClose }: Props) => {
  const { t } = useTranslation();

  const onConfirm = () => {
    unbind().then(handleClose);
  };

  return (
    <ModalVanilla
      open={open}
      handleClose={handleClose}
      cancelBtn={t('act.cancel')}
      confirmBtn={t('dataSync.unbind')}
      onConfirm={onConfirm}
    >
      <>
        <H2>{t('dataSync.unbindHead')}</H2>
        <Body size="l" className="mt-4 mb-5">
          {t('dataSync.unbindHint')}
        </Body>
      </>
    </ModalVanilla>
  );
};

export default ModalUnbind;
