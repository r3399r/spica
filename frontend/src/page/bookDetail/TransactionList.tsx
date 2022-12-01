import { Transaction, TransactionBill, TransactionTransfer } from '@y-celestial/spica-service';
import classNames from 'classnames';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Body from 'src/celestial-ui/component/typography/Body';
import { Page } from 'src/constant/Page';
import { RootState } from 'src/redux/store';
import { aggregateTransactions, loadMoreBookById } from 'src/service/bookService';
import { bnFormat } from 'src/util/bignumber';

const TransactionList = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const transactions = useMemo(
    () => (book?.transactions ? aggregateTransactions(book.id, book.transactions) : null),
    [book],
  );
  const billNote = useCallback(
    (transaction: TransactionBill) => {
      const { type, amount, former } = transaction;
      if (former.length === 0) return 'ERROR';
      const member =
        former.length > 1
          ? t('bookDetail.multiple')
          : book?.members?.find((v) => v.id === former[0].id)?.nickname;
      if (type === 'out')
        return t('bookDetail.billOutNote', {
          member,
          amount: bnFormat(amount),
          symbol: book?.symbol,
        });

      return t('bookDetail.billInNote', { member, amount: bnFormat(amount), symbol: book?.symbol });
    },
    [t, book],
  );
  const transferNote = useCallback(
    (transaction: TransactionTransfer) => {
      const { amount, srcMemberId, dstMemberId } = transaction;
      const srcMember = book?.members?.find((v) => v.id === srcMemberId)?.nickname;
      const dstMember = book?.members?.find((v) => v.id === dstMemberId)?.nickname;

      return t('bookDetail.transferNote', {
        srcMember,
        dstMember,
        amount: bnFormat(amount),
        symbol: book?.symbol,
      });
    },
    [t, book],
  );

  const items = (item: Transaction) => {
    if (item.type !== 'transfer')
      return (
        <div
          key={item.id}
          className="py-[10px] border-b-[1px] border-b-grey-300"
          onClick={() => navigate(`${Page.Book}/${id}/tx/${item.id}`)}
        >
          <div className="flex justify-between">
            <div className="flex gap-1">
              {item.dateDeleted && (
                <Body size="s" className="px-1 py-[3px] bg-tomato-500 text-white">
                  {t('bookDetail.deleted')}
                </Body>
              )}
              <Body size="l" bold className={classNames({ 'opacity-30': item.dateDeleted })}>
                {item.descr}
              </Body>
            </div>
            <Body size="l" className={classNames({ 'opacity-30': item.dateDeleted })}>{`${
              book?.symbol
            }${bnFormat(item.amount)}`}</Body>
          </div>
          <Body size="s" className="text-[12px] leading-[18px] text-teal-500">
            {billNote(item)}
          </Body>
        </div>
      );

    return (
      <div
        key={item.id}
        className="py-[10px] border-b-[1px] border-b-grey-300"
        onClick={() => navigate(`${Page.Book}/${id}/tx/${item.id}`)}
      >
        <div className="flex justify-between">
          <div className="flex gap-1">
            {item.dateDeleted && (
              <Body size="s" className="px-1 py-[3px] bg-tomato-500 text-white">
                {t('bookDetail.deleted')}
              </Body>
            )}
            <Body size="l" bold className={classNames({ 'opacity-30': item.dateDeleted })}>
              {t('desc.transfer')}
            </Body>
          </div>
          <Body size="l" className={classNames({ 'opacity-30': item.dateDeleted })}>{`${
            book?.symbol
          }${bnFormat(item.amount)}`}</Body>
        </div>
        <Body size="s" className="text-[12px] leading-[18px] text-teal-500">
          {transferNote(item)}
        </Body>
      </div>
    );
  };

  if (book && book.transactions && book.transactions.length > 0 && transactions)
    return (
      <div className="p-[10px]">
        {Object.keys(transactions).map((v) => (
          <div key={v} className="mb-[10px]">
            <Body bold className="pt-[5px] text-navy-100">
              {v}
            </Body>
            <>{transactions[v].map(items)}</>
          </div>
        ))}
        {book.transactions.length !== book.txCount && (
          <div className="text-center" onClick={() => loadMoreBookById(id ?? 'xx')}>
            -- load more --
          </div>
        )}
      </div>
    );

  return <div className="text-black p-[10px]">--</div>;
};

export default TransactionList;
