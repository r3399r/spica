import classNames from 'classnames';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import LoadMore from 'src/component/LoadMore';
import Body from 'src/component/typography/Body';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import { Transaction, TransactionBill, TransactionTransfer } from 'src/model/backend/type/Book';
import { aggregateTransactions } from 'src/service/bookService';
import { bn, bnFormat } from 'src/util/bignumber';

const TransactionList = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const book = useBook();
  const transactions = useMemo(
    () => (book?.transactions ? aggregateTransactions(book.id, book.transactions) : null),
    [book],
  );
  const billNote = useCallback(
    (transaction: TransactionBill, currencyDisplay?: string) => {
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
          symbol: currencyDisplay,
        });

      return t('bookDetail.billInNote', {
        member,
        amount: bnFormat(amount),
        symbol: currencyDisplay,
      });
    },
    [t, book],
  );
  const transferNote = useCallback(
    (transaction: TransactionTransfer, currencyDisplay?: string) => {
      const { amount, srcMemberId, dstMemberId } = transaction;
      const srcMember = book?.members?.find((v) => v.id === srcMemberId)?.nickname;
      const dstMember = book?.members?.find((v) => v.id === dstMemberId)?.nickname;

      return t('bookDetail.transferNote', {
        srcMember,
        dstMember,
        amount: bnFormat(amount),
        symbol: currencyDisplay,
      });
    },
    [t, book],
  );

  const items = (item: Transaction) => {
    const isMultiple = (book?.currencies?.length ?? 0) > 1;
    const currentCurrency = book?.currencies?.find((v) => v.id === item.currencyId);
    const mainCurrency = book?.currencies?.find((v) => v.isPrimary === true);
    const currencyDisplay = isMultiple
      ? `${currentCurrency?.name}${currentCurrency?.symbol}`
      : currentCurrency?.symbol;

    if (item.type !== 'transfer')
      return (
        <div
          key={item.id}
          className="cursor-pointer border-b-[1px] border-b-grey-300 py-[10px]"
          onClick={() => navigate(`${Page.Book}/${id}/tx/${item.id}`)}
        >
          <div className="flex justify-between">
            <div className="flex gap-1">
              {item.dateDeleted && (
                <Body size="s" className="bg-tomato-500 px-1 py-[3px] text-white">
                  {t('bookDetail.deleted')}
                </Body>
              )}
              <Body size="l" bold className={classNames({ 'opacity-30': item.dateDeleted })}>
                {item.descr}
              </Body>
            </div>
            <Body
              size="l"
              className={classNames({ 'opacity-30': item.dateDeleted })}
            >{`${currencyDisplay}${bnFormat(item.amount)}`}</Body>
          </div>
          <div className="flex justify-between">
            <Body
              size="s"
              className={classNames('text-teal-500', { 'opacity-60': item.dateDeleted })}
            >
              {billNote(item, currencyDisplay)}
            </Body>
            {mainCurrency && currentCurrency && mainCurrency.id !== currentCurrency.id && (
              <Body
                size="s"
                className={classNames('text-teal-500', { 'opacity-60': item.dateDeleted })}
              >{`≈${mainCurrency.name}${mainCurrency.symbol}${bn(item.amount)
                .times(currentCurrency.exchangeRate ?? 0)
                .dp(2)
                .toFormat()}`}</Body>
            )}
          </div>
        </div>
      );

    return (
      <div
        key={item.id}
        className="cursor-pointer border-b-[1px] border-b-grey-300 py-[10px]"
        onClick={() => navigate(`${Page.Book}/${id}/tx/${item.id}`)}
      >
        <div className="flex justify-between">
          <div className="flex gap-1">
            {item.dateDeleted && (
              <Body size="s" className="bg-tomato-500 px-1 py-[3px] text-white">
                {t('bookDetail.deleted')}
              </Body>
            )}
            <Body size="l" bold className={classNames({ 'opacity-30': item.dateDeleted })}>
              {t('desc.transfer')}
            </Body>
          </div>
          <Body
            size="l"
            className={classNames({ 'opacity-30': item.dateDeleted })}
          >{`${currencyDisplay}${bnFormat(item.amount)}`}</Body>
        </div>
        <div className="flex justify-between">
          <Body
            size="s"
            className={classNames('text-teal-500', { 'opacity-60': item.dateDeleted })}
          >
            {transferNote(item, currencyDisplay)}
          </Body>
          {mainCurrency && currentCurrency && mainCurrency.id !== currentCurrency.id && (
            <Body
              size="s"
              className={classNames('text-teal-500', { 'opacity-60': item.dateDeleted })}
            >{`≈${mainCurrency.name}${mainCurrency.symbol}${bn(item.amount)
              .times(currentCurrency.exchangeRate ?? 0)
              .dp(2)
              .toFormat()}`}</Body>
          )}
        </div>
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
        {book.transactions.length !== book.txCount && <LoadMore />}
      </div>
    );

  return <div className="p-[10px] text-black">--</div>;
};

export default TransactionList;
