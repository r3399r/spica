import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BackButton from 'src/component/BackButton';
import Body from 'src/component/celestial-ui/typography/Body';
import { Page } from 'src/constant/Page';
import IcEdit from 'src/image/ic-edit.svg';
import IcRemove from 'src/image/ic-remove.svg';
import { RootState } from 'src/redux/store';

const Navbar = () => {
  const { id, tid } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const tx = useMemo(
    () => books?.find((v) => v.id === id)?.transactions?.find((v) => v.id === tid),
    [id, tid, books],
  );

  return (
    <div className="mt-[15px] mb-5 relative">
      <BackButton text={t('transaction.back')} to={`${Page.Book}/${id}`} />
      <div className="absolute top-0 right-0">
        {tx && tx.dateDeleted === null ? (
          <div className="flex gap-[15px]">
            <img src={IcRemove} />
            <img src={IcEdit} />
          </div>
        ) : (
          <Body size="s" className="text-white bg-tomato-700 py-1 px-[10px]">
            {t('transaction.deleted')}
          </Body>
        )}
      </div>
    </div>
  );
};

export default Navbar;
