import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BackButton from 'src/component/BackButton';
import { Page } from 'src/constant/Page';

const Navbar = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  return (
    <div className="mt-[15px] mb-5">
      <BackButton text={t('bookDetail.back')} to={`${Page.Book}/${id}`} />
    </div>
  );
};

export default Navbar;
