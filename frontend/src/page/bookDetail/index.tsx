import classNames from 'classnames';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from 'src/component/celestial-ui/Button';
import Body from 'src/component/celestial-ui/typography/Body';
import IcAdd from 'src/image/ic-add.svg';
import { RootState } from 'src/redux/store';
import { loadBookById } from 'src/service/bookService';
import BalanceCard from './BalanceCard';
import MainCard from './MainCard';
import Navbar from './Navbar';
import TransactionList from './TransactionList';

const BookDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const noMember = useMemo(() => book === undefined || book?.members?.length === 0, [book]);

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id);
  }, [id]);

  return (
    <>
      <div
        className={classNames('fixed top-0 h-[calc(100%-104px)] w-full overflow-y-scroll', {
          'h-full': noMember,
        })}
      >
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <Navbar />
          <MainCard />
          <BalanceCard />
          <TransactionList />
          {noMember && (
            <Body className="mt-[30px] px-[46px] text-center text-navy-300">
              {t('bookDetail.noMemberHint')}
            </Body>
          )}
        </div>
      </div>
      {!noMember && (
        <div className="fixed bottom-0 h-[104px] w-full">
          <div className="mx-auto w-fit">
            <Button className="mt-5 w-64 h-12">
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
