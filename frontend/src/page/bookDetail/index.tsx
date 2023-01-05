import classNames from 'classnames';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'src/celestial-ui/component/Button';
import Body from 'src/celestial-ui/component/typography/Body';
// import AdSense from 'src/component/AdSense';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import IcAdd from 'src/image/ic-add.svg';
import { RootState } from 'src/redux/store';
import { setTxPageScroll } from 'src/redux/uiSlice';
import { loadBookById } from 'src/service/bookService';
import BalanceCard from './BalanceCard';
import MainCard from './MainCard';
import Navbar from './Navbar';
import TransactionList from './TransactionList';

const BookDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { txPageScroll } = useSelector((rootState: RootState) => rootState.ui);
  const book = useBook();
  const noMember = useMemo(() => book?.members?.length === 0, [book]);
  // const showAd = useMemo(
  //   () =>
  //     book?.members &&
  //     book.members.length > 0 &&
  //     book?.transactions &&
  //     book.transactions.length > 0,
  //   [book],
  // );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id]);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = txPageScroll;
  }, []);

  return (
    <>
      <div
        className={classNames('fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto', {
          'h-full': noMember,
        })}
        ref={ref}
        onScroll={(e) => dispatch(setTxPageScroll(e.currentTarget.scrollTop))}
      >
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <Navbar />
          <MainCard />
          <BalanceCard />
          {/* {showAd && (
            <div className="my-[10px]">
              <AdSense />
            </div>
          )} */}
          <TransactionList />
          {noMember && (
            <Body className="mt-[30px] px-[46px] text-center text-navy-300">
              {t('bookDetail.noMemberHint')}
            </Body>
          )}
        </div>
      </div>
      {book !== undefined && !noMember && (
        <div className="fixed bottom-0 h-[104px] w-full">
          <div className="mx-auto w-fit">
            <Button
              className="mt-5 w-64 h-12"
              onClick={() => navigate(`${Page.Book}/${book.id}/tx`)}
            >
              <div className="flex justify-center">
                <img src={IcAdd} />
                <Body size="l" bold className="text-white">
                  {t('bookDetail.newTransaction')}
                </Body>
              </div>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookDetail;
