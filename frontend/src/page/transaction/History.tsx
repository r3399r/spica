import { History as HistoryType } from '@y-celestial/spica-service';
import { format } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/component/celestial-ui/typography/Body';
import { RootState } from 'src/redux/store';
import { bn } from 'src/util/bignumber';

const History = () => {
  const { id, tid } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const tx = useMemo(
    () => books?.find((v) => v.id === id)?.transactions?.find((v) => v.id === tid),
    [id, tid, books],
  );
  const getDisplayText = useCallback(
    (value: HistoryType['items'][0]) => {
      const key = value.key;
      let from = value.from;
      let to = value.to;
      if (value.key === 'date' && from && to) {
        from = format(new Date(from), 'yyyy-MM-dd HH:mm');
        to = format(new Date(to), 'yyyy-MM-dd HH:mm');
      } else if (value.key === 'amount') {
        from = `${book?.symbol}${from}`;
        to = `${book?.symbol}${to}`;
      } else if (value.key === 'former' || value.key === 'latter') {
        const fromMemberId = String(from).split(':')[0];
        const fromAmount = bn(String(from).split(':')[1]).abs().toFormat();
        const toMemberId = String(to).split(':')[0];
        const toAmount = bn(String(to).split(':')[1]).abs().toFormat();
        from = `${book?.members?.find((v) => v.id === fromMemberId)?.nickname}(${
          book?.symbol
        }${fromAmount})`;
        to = `${book?.members?.find((v) => v.id === toMemberId)?.nickname}(${
          book?.symbol
        }${toAmount})`;
      } else if (value.key === 'srcMemberId') {
        from = String(book?.members?.find((v) => v.id === from)?.nickname);
        to = String(book?.members?.find((v) => v.id === to)?.nickname);
      } else if (value.key === 'dstMemberId') {
        from = String(book?.members?.find((v) => v.id === from)?.nickname);
        to = String(book?.members?.find((v) => v.id === to)?.nickname);
      }

      return t('transaction.updateContent', { key: t(`transaction.key.${key}`), from, to });
    },
    [book, t],
  );
  console.log(tx);
  if (!tx) return <></>;

  return (
    <div className="my-[15px]">
      {tx.dateDeleted && (
        <Body size="s" className="text-navy-300 mb-[5px]">
          {t('transaction.deleted', { date: format(new Date(tx.dateDeleted), 'yyyy-MM-dd HH:mm') })}
        </Body>
      )}
      {tx.history.map((v, i) => (
        <div key={i} className="mb-[5px]">
          {v.date && (
            <Body size="s" className="text-navy-300">
              {t('transaction.updated', { date: format(new Date(v.date), 'yyyy-MM-dd HH:mm') })}
            </Body>
          )}
          {v.items.map((o, j) => (
            <Body key={j} size="s" className="text-navy-300">
              {getDisplayText(o)}
            </Body>
          ))}
        </div>
      ))}
      {tx.dateCreated && (
        <Body size="s" className="text-navy-300">
          {t('transaction.created', { date: format(new Date(tx.dateCreated), 'yyyy-MM-dd HH:mm') })}
        </Body>
      )}
    </div>
  );
};

export default History;
