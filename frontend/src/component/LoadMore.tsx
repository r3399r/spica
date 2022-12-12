import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Body from 'src/celestial-ui/component/typography/Body';
import IcDown from 'src/image/ic-down.svg';
import { loadMoreBookById } from 'src/service/bookService';

const LoadMore = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  return (
    <div
      className="mt-[10px] flex flex-col items-center py-[5px] cursor-pointer"
      onClick={() => loadMoreBookById(id ?? 'xx')}
    >
      <Body className="text-navy-100">{t('act.loadMore')}</Body>
      <div>
        <img src={IcDown} />
      </div>
    </div>
  );
};

export default LoadMore;
