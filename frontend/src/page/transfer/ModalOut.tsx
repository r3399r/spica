import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import Modal from 'src/component/Modal';
import Body from 'src/component/typography/Body';
import { setSnackbarMessage } from 'src/redux/uiSlice';
import { getToken } from 'src/service/transferService';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalOut = ({ open, handleClose }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    if (open && !token) getToken().then((res) => setToken(res.token));
  }, [open]);

  return (
    <Modal open={open} handleClose={handleClose}>
      <>
        <Body bold size="l">
          {t('transfer.modalOutHead')}
        </Body>
        <Body className="p-[10px] my-[5px] font-bold text-navy-300 bg-grey-100 rounded-[4px]">
          {token ?? '...'}
        </Body>
        <Body className="mb-5 text-navy-300">{t('transfer.modalOutHint')}</Body>
        <div className="flex justify-end pt-[10px] gap-[15px] pb-[30px] flex-wrap">
          <Button appearance="secondary" onClick={handleClose} type="button">
            {t('transfer.modalOutClose')}
          </Button>
          <CopyToClipboard
            text={token ?? ''}
            onCopy={() => dispatch(setSnackbarMessage(t('desc.copy')))}
          >
            <Button appearance="default" type="button">
              {t('transfer.modalOutCopy')}
            </Button>
          </CopyToClipboard>
        </div>
      </>
    </Modal>
  );
};

export default ModalOut;
