import { Transaction, TransactionBill, TransactionTransfer } from '@y-celestial/spica-service';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/component/celestial-ui/typography/Body';
import { RootState } from 'src/redux/store';
import { aggregateTransactions } from 'src/service/bookService';
import { bnFormat } from 'src/util/bignumber';

const TransactionList = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const transactions = useMemo(
    () => (book?.transactions ? aggregateTransactions(book.transactions) : null),
    [book],
  );
  const billNote = useCallback(
    (transaction: TransactionBill) => {
      const { type, amount, shareCount, shareMemberId } = transaction;
      const member =
        Number(shareCount) > 1
          ? t('bookDetail.multiple')
          : book?.members?.find((v) => v.id === shareMemberId)?.nickname;
      if (type === 'out') return t('bookDetail.billOutNote', { member, amount: bnFormat(amount) });

      return t('bookDetail.billInNote', { member, amount: bnFormat(amount) });
    },
    [t, book],
  );
  const transferNote = useCallback(
    (transaction: TransactionTransfer) => {
      const { amount, srcMemberId, dstMemberId } = transaction;
      const srcMember = book?.members?.find((v) => v.id === srcMemberId)?.nickname;
      const dstMember = book?.members?.find((v) => v.id === dstMemberId)?.nickname;

      return t('bookDetail.transferNote', { srcMember, dstMember, amount: bnFormat(amount) });
    },
    [t, book],
  );

  const items = (item: Transaction) => {
    if (item.type !== 'transfer')
      return (
        <div key={item.id} className="py-[10px] border-b-[1px] border-b-grey-300">
          <div className="flex justify-between">
            <Body size="l" bold>
              {item.descr}
            </Body>
            <Body size="l">{`${book?.symbol}${bnFormat(item.amount)}`}</Body>
          </div>
          <Body size="s" className="text-[12px] leading-[18px] text-teal-500">
            {billNote(item)}
          </Body>
        </div>
      );

    return (
      <div key={item.id} className="py-[10px] border-b-[1px] border-b-grey-300">
        <div className="flex justify-between">
          <Body size="l" bold>
            {t('bookDetail.transfer')}
          </Body>
          <Body size="l">{`${book?.symbol}${bnFormat(item.amount)}`}</Body>
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
      </div>
    );

  return <div className="text-black p-[10px]">--</div>;
};

export default TransactionList;
