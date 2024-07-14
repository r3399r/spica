import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from 'src/component/BackButton';
import Img from 'src/component/Img';
import ModalExport from 'src/component/ModalExport';
import { DonateLink, Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import IcDonate from 'src/image/ic-donate.svg';
import IcExportActive from 'src/image/ic-export-active.svg';
import IcExport from 'src/image/ic-export.svg';
import IcSettingActive from 'src/image/ic-setting-active.svg';
import IcSetting from 'src/image/ic-setting.svg';
import IcShare from 'src/image/ic-share.svg';
import { setSnackbarMessage } from 'src/redux/uiSlice';
import { exportOverallPdf } from 'src/service/bookService';

const Navbar = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const book = useBook();
  const link = `${location.origin}/book/${id}?a=1`;

  const onShareLink = () => {
    if (!navigator.share || book === undefined) return;
    navigator.share({
      text: t('member.shareText', { book: book.name }),
      url: link,
    });
  };

  return (
    <div className="mb-5 mt-[15px] flex justify-between">
      <BackButton text={t('bookDetail.back')} />
      <div className="flex gap-[15px]">
        <a target="_blank" href={DonateLink} rel="noreferrer">
          <div className="cursor-pointer">
            <Img src={IcDonate} />
          </div>
        </a>
        <CopyToClipboard text={link} onCopy={() => dispatch(setSnackbarMessage(t('desc.copy')))}>
          <div className="cursor-pointer" onClick={onShareLink}>
            <Img src={IcShare} />
          </div>
        </CopyToClipboard>
        <div className="cursor-pointer" onClick={() => setOpen(true)}>
          <Img src={IcExport} srcActive={IcExportActive} />
        </div>
        <div className="cursor-pointer" onClick={() => navigate(`${Page.Book}/${id}/setting`)}>
          <Img src={IcSetting} srcActive={IcSettingActive} />
        </div>
      </div>
      <ModalExport
        open={open}
        handleClose={() => setOpen(false)}
        onExport={() => exportOverallPdf(id ?? 'x')}
      />
    </div>
  );
};

export default Navbar;
