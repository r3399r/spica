import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BackButton from 'src/component/BackButton';
import Img from 'src/component/Img';
import ModalExport from 'src/component/ModalExport';
import IcExportActive from 'src/image/ic-export-active.svg';
import IcExport from 'src/image/ic-export.svg';
import { exportPersonalPdf } from 'src/service/bookService';

const Navbar = () => {
  const { t } = useTranslation();
  const { id, uid } = useParams();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="mb-5 mt-[15px] flex items-center justify-between">
      <BackButton text={t('bookDetail.back')} />
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        <Img src={IcExport} srcActive={IcExportActive} />
      </div>
      <ModalExport
        open={open}
        handleClose={() => setOpen(false)}
        onExport={() => exportPersonalPdf(id ?? 'x', uid ?? 'y')}
      />
    </div>
  );
};

export default Navbar;
