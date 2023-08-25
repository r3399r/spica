import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from 'src/component/BackButton';
import Img from 'src/component/Img';
import ModalExport from 'src/component/ModalExport';
import { Page } from 'src/constant/Page';
import IcExportActive from 'src/image/ic-export-active.svg';
import IcExport from 'src/image/ic-export.svg';
import IcSettingActive from 'src/image/ic-setting-active.svg';
import IcSetting from 'src/image/ic-setting.svg';
import { exportOverallPdf } from 'src/service/bookService';

const Navbar = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="mb-5 mt-[15px] flex justify-between">
      <BackButton text={t('bookDetail.back')} />
      <div className="flex gap-[15px]">
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
