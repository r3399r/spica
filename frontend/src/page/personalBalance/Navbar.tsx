import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BackButton from 'src/component/BackButton';
import Img from 'src/component/Img';
import IcExportActive from 'src/image/ic-export-active.svg';
import IcExport from 'src/image/ic-export.svg';
import { exportPersonalPdf } from 'src/service/bookService';

const Navbar = () => {
  const { t } = useTranslation();
  const { id, uid } = useParams();

  return (
    <div className="flex justify-between items-center mt-[15px] mb-5">
      <BackButton text={t('bookDetail.back')} />
      <div className="cursor-pointer" onClick={() => exportPersonalPdf(id ?? 'x', uid ?? 'y')}>
        <Img src={IcExport} srcActive={IcExportActive} />
      </div>
    </div>
  );
};

export default Navbar;
