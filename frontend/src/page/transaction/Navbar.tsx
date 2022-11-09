import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BackButton from 'src/component/BackButton';
import { Page } from 'src/constant/Page';
import IcEdit from 'src/image/ic-edit.svg';
import IcRemove from 'src/image/ic-remove.svg';

const Navbar = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  return (
    <div className="mt-[15px] mb-5 flex justify-between">
      <BackButton text={t('transaction.back')} to={`${Page.Book}/${id}`} />
      <div className="flex gap-[15px]">
        <img src={IcRemove} />
        <img src={IcEdit} />
      </div>
    </div>
  );
};

export default Navbar;
