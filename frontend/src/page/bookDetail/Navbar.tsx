import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from 'src/component/BackButton';
import { Page } from 'src/constant/Page';
import IcSetting from 'src/image/ic-setting.svg';

const Navbar = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex justify-between mt-[15px] mb-5">
      <BackButton text={t('bookDetail.back')} to={Page.Book} />
      <div className="cursor-pointer" onClick={() => navigate(`${Page.Book}/${id}/setting`)}>
        <img src={IcSetting} />
      </div>
    </div>
  );
};

export default Navbar;
