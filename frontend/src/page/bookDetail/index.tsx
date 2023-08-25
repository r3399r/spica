import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'src/component/Button';
import Body from 'src/component/typography/Body';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import useQuery from 'src/hook/useQuery';
import IcAdd from 'src/image/ic-add.svg';
import { RootState } from 'src/redux/store';
import { setTxPageScroll } from 'src/redux/uiSlice';
import { loadBookById } from 'src/service/bookService';
import BalanceCard from './BalanceCard';
import MainCard from './MainCard';
import ModalMember from './ModalMember';
import Navbar from './Navbar';
import TransactionList from './TransactionList';

const BookDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { a: isShared } = useQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { txPageScroll, isDeviceReady } = useSelector((rootState: RootState) => rootState.ui);
  const [open, setOpen] = useState<boolean>(false);
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
    if (id === undefined || !isDeviceReady) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id, isDeviceReady]);

  useEffect(() => {
    if (!id) return;
    const savedId = localStorage.getItem('memberSet');
    if (isShared && (!savedId || !savedId.split(',').includes(id))) setOpen(true);
  }, [isShared]);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = txPageScroll;
  }, []);

  const handleClose = () => {
    if (!id) return;
    const savedId = localStorage.getItem('memberSet');
    localStorage.setItem('memberSet', savedId ? savedId + ',' + id : id);
    setOpen(false);
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
          {/* {showAd && (
            <div className="my-[10px] border-[1px] border-solid border-grey-500">
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
              className="mt-5 h-12 w-64"
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
      <ModalMember open={open} handleClose={handleClose} />
    </>
  );
};

export default BookDetail;
