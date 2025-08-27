import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AdSense from 'src/component/AdSense';
import Button from 'src/component/Button';
import Body from 'src/component/typography/Body';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import useQuery from 'src/hook/useQuery';
import IcAdd from 'src/image/ic-add.svg';
import IcClose from 'src/image/ic-close.svg';
import IcSearch from 'src/image/ic-search.svg';
import IcSearchComponent from 'src/image/ic-search.svg?react';
import { RootState } from 'src/redux/store';
import { setSearchQuery, setTxPageScroll } from 'src/redux/uiSlice';
import { loadBookById, loadQueryTransactions } from 'src/service/bookService';
import BalanceCard from './BalanceCard';
import MainCard from './MainCard';
import ModalMember from './ModalMember';
import ModalSearch from './ModalSearch';
import Navbar from './Navbar';
import TransactionList from './TransactionList';

const BookDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { a: isShared } = useQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { txPageScroll, isDeviceReady, searchQuery } = useSelector(
    (rootState: RootState) => rootState.ui,
  );
  const [openMember, setOpenMember] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const book = useBook();
  const noMember = useMemo(() => book?.members?.length === 0, [book]);
  const showAd = useMemo(
    () =>
      book?.members &&
      book.members.length > 0 &&
      book?.transactions &&
      book.transactions.length > 0 &&
      book?.isPro === false,
    [book],
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id === undefined || !isDeviceReady) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id, isDeviceReady]);

  useEffect(() => {
    if (!id || searchQuery === null) return;
    loadQueryTransactions(id, searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (!id) return;
    const savedId = localStorage.getItem('memberSet');
    if (isShared && (!savedId || !savedId.split(',').includes(id))) setOpenMember(true);
  }, [isShared]);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = txPageScroll;
  }, []);

  const handleClose = () => {
    if (!id) return;
    const savedId = localStorage.getItem('memberSet');
    localStorage.setItem('memberSet', savedId ? savedId + ',' + id : id);
    setOpenMember(false);
  };

  const onSearchClick = () => {
    if (book?.isPro) setOpenSearch(true);
    else navigate(`${Page.Book}/${book?.id}/upgrade`);
  };

  return (
    <>
      <div
        className={classNames('fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto', {
          'h-full': noMember,
        })}
        ref={ref}
        onScroll={(e) => dispatch(setTxPageScroll(e.currentTarget.scrollTop))}
      >
        <div className="mx-[15px] max-w-[640px] sm:mx-auto" id="pdf-overall-content">
          <Navbar />
          <MainCard />
          <BalanceCard />
          {showAd && <AdSense onClick={() => navigate(`${Page.Book}/${book?.id}/upgrade`)} />}
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
          {searchQuery === null && (
            <div className="relative mx-auto mt-5 w-fit">
              <Button
                className="px-[25px] py-3"
                onClick={() => navigate(`${Page.Book}/${book.id}/tx`)}
              >
                <div className="flex justify-center gap-[5px]">
                  <img src={IcAdd} />
                  <Body size="l" bold className="pr-[15px] text-white">
                    {t('bookDetail.newTransaction')}
                  </Body>
                </div>
              </Button>
              <img
                src={IcSearch}
                className="absolute top-1/2 -left-[54px] -translate-y-1/2 cursor-pointer"
                onClick={onSearchClick}
              />
            </div>
          )}
          {searchQuery !== null && (
            <div className="relative mx-auto mt-5 w-full max-w-[640px]">
              <div
                className="mx-3 flex cursor-pointer gap-[10px] rounded-[10px] p-[10px] shadow-md"
                onClick={() => setOpenSearch(true)}
              >
                <IcSearchComponent className="text-navy-100" />
                <Body className="flex-1 text-navy-700">{searchQuery}</Body>
                <img
                  src={IcClose}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setSearchQuery(null));
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      <ModalMember open={openMember} handleClose={handleClose} />
      <ModalSearch
        open={openSearch}
        onSearch={(q) => dispatch(setSearchQuery(q))}
        handleClose={() => setOpenSearch(false)}
      />
    </>
  );
};

export default BookDetail;
