import { Transaction, TransactionBill } from '@y-celestial/spica-service';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from 'src/redux/store';
import { aggregateTransactions } from 'src/service/bookService';

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
      if (type === 'out') return t('bookDetail.billNote', { member, amount });
    },
    [t, book],
  );

  const items = (item: Transaction) => {
    if (item.type !== 'transfer')
      return (
        <div key={item.id} className="py-[10px] border-b-[1px] border-b-grey-300">
          <div className="flex justify-between">
            <div className="font-bold">{item.descr}</div>
            <div>{`$${item.amount}`}</div>
          </div>
          <div className="text-[12px] leading-[18px] text-teal-500">{billNote(item)}</div>
        </div>
      );

    return <div key={item.id}>transfer</div>;
  };

  if (book && book.transactions && book.transactions.length > 0 && transactions)
    return (
      <>
        {Object.keys(transactions).map((v) => (
          <div key={v} className="mb-[10px]">
            <div className="pt-[5px] text-sm text-navy-100 font-bold">{v}</div>
            <div>{transactions[v].map(items)}</div>
          </div>
        ))}
      </>
    );

  return <div className="text-black p-[10px]">--</div>;
};

export default TransactionList;
