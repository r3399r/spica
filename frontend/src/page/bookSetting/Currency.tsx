import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Img from 'src/component/Img';
import Body from 'src/component/typography/Body';
import H4 from 'src/component/typography/H4';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import IcEditActive from 'src/image/ic-edit-active.svg';
import IcEdit from 'src/image/ic-edit.svg';

const Currency = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const book = useBook();

  return (
    <>
      <div
        className="cursor-pointer border-b border-b-grey-300 pb-4 pt-5"
        onClick={() => navigate(`${Page.Book}/${id}/setting/currency`)}
      >
        <div className="mb-[5px] flex justify-between">
          <H4>{t('bookSetting.currency')}</H4>
          <Img src={IcEdit} srcActive={IcEditActive} />
        </div>
        <Body size="l" className="min-h-[24px] text-navy-700">
          {book?.currencies?.map((v) => `${v.name}${v.symbol}`).join(', ')}
        </Body>
      </div>
    </>
  );
};

export default Currency;
