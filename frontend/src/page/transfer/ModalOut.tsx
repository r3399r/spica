import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Button from 'src/component/Button';
import Modal from 'src/component/Modal';
import Body from 'src/component/typography/Body';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalOut = ({ open, handleClose }: Props) => {
  const { id } = useParams();
  const { t } = useTranslation();

  return (
    <Modal open={open} handleClose={handleClose}>
      <>
        <Body bold size="l">
          {t('transfer.modalOutHead')}
        </Body>
        <Body className="p-[10px] my-[5px] font-bold text-navy-300 bg-grey-100 rounded-[4px]">
          0x21
        </Body>
        <Body className="mb-5 text-navy-300">{t('transfer.modalOutHint')}</Body>
        <div className="flex justify-end pt-[10px] gap-[15px] pb-[30px] flex-wrap">
          <Button appearance="secondary" onClick={handleClose} type="button">
            {t('transfer.modalOutClose')}
          </Button>
          <Button appearance="default" type="submit">
            {t('transfer.nodalOutCopy')}
          </Button>
        </div>
      </>
    </Modal>
  );
};

export default ModalOut;
