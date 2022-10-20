import classNames from 'classnames';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'src/component/celestial-ui/Button';
import { Page } from 'src/constant/Page';
import IcAdd from 'src/image/ic-add.svg';
import IcBack from 'src/image/ic-back.svg';
import IcSetting from 'src/image/ic-setting.svg';
import { RootState } from 'src/redux/store';
import { loadBookById } from 'src/service/bookService';
import BalanceCard from './BalanceCard';
import MainCard from './MainCard';
import TransactionList from './TransactionList';

const BookDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const noMember = useMemo(() => book?.members?.length === 0, [book]);

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id);
  }, [id]);

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-scroll">
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <div className="flex justify-between mt-[15px] mb-5">
            <div className="flex cursor-pointer" onClick={() => navigate(Page.Book)}>
              <img src={IcBack} />
              <div className="text-navy-700 font-bold">{t('bookDetail.back')}</div>
            </div>
            <div className="cursor-pointer" onClick={() => navigate(`${Page.Book}/${id}/setting`)}>
              <img src={IcSetting} />
            </div>
          </div>
          <MainCard />
          <BalanceCard />
          <TransactionList />
          {noMember && (
            <div className="mt-[30px] px-[46px] text-center text-sm text-navy-300">
              {t('bookDetail.noMemberHint')}
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 h-[104px] w-full">
        <div className="mx-auto w-fit">
          <Button
            className="mt-5 w-64 h-12"
            disabled={noMember}
            onClick={() => navigate(`${Page.Book}/${id}/fill`)}
          >
            <div className="flex justify-center">
              <img src={IcAdd} className={classNames({ 'opacity-40': noMember })} />
              <div>{t('bookDetail.newTransaction')}</div>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookDetail;
