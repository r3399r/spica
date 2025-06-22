import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard-ts';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from 'src/component/Button';
import H4 from 'src/component/typography/H4';
import useBook from 'src/hook/useBook';
import { setSnackbarMessage } from 'src/redux/uiSlice';
import ModalFriend from './ModalFriend';

const Share = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const book = useBook();
  const link = `${location.origin}/book/${id}?a=1`;
  const [open, setOpen] = useState<boolean>(false);

  const onShareLink = () => {
    if (!navigator.share || book === undefined) return;
    navigator.share({
      text: t('member.shareText', { book: book.name }),
      url: link,
    });
  };

  return (
    <>
      <div className="rounded-[15px] bg-grey-100 p-[10px]">
        <H4>{t('member.shareWithFriend')}</H4>
        <div className="mt-5 flex items-center justify-center gap-5">
          <CopyToClipboard text={link} onCopy={() => dispatch(setSnackbarMessage(t('desc.copy')))}>
            <Button
              className="rounded-md px-[30px] py-[10px]"
              onClick={onShareLink}
              appearance="default"
            >
              {t('member.shareLink')}
            </Button>
          </CopyToClipboard>
          <Button
            className="rounded-md px-[30px] py-[10px]"
            onClick={() => setOpen(true)}
            appearance="default"
          >
            {t('member.inputEmail')}
          </Button>
        </div>
      </div>
      <ModalFriend open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default Share;
