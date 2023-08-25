import format from 'date-fns/format';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Body from 'src/component/typography/Body';
import useBook from 'src/hook/useBook';
import { History as HistoryType } from 'src/model/backend/type/Book';
import { bn } from 'src/util/bignumber';

const History = () => {
  const { tid } = useParams();
  const { t } = useTranslation();
  const book = useBook();
  const tx = useMemo(() => book?.transactions?.find((v) => v.id === tid), [tid, book]);
  const getDisplayText = useCallback(
    (value: HistoryType['items'][0]) => {
      const key = value.key;
      let from = value.from;
      let to = value.to;

      if (key === 'former' || key === 'latter') {
        if (from === null) {
          const memberId = String(to).split(':')[0];
          const amount = bn(String(to).split(':')[1]).abs().toFormat();

          return t('transaction.createContent', {
            key: t(`transaction.key.${key}`),
            to: `${book?.members?.find((v) => v.id === memberId)?.nickname}(${
              book?.symbol
            }${amount})`,
          });
        }
        if (to === null) {
          const memberId = String(from).split(':')[0];
          const amount = bn(String(from).split(':')[1]).abs().toFormat();

          return t('transaction.removeContent', {
            key: t(`transaction.key.${key}`),
            from: `${book?.members?.find((v) => v.id === memberId)?.nickname}(${
              book?.symbol
            }${amount})`,
          });
        }
      }

      if (key === 'memo') {
        if (from === null)
          return t('transaction.createContent', {
            key: t(`transaction.key.memo`),
            to,
          });
        if (to === null)
          return t('transaction.removeContent', {
            key: t(`transaction.key.memo`),
            from,
          });
      }

      if (key === 'date' && from && to) {
        from = format(new Date(from), 'yyyy-MM-dd HH:mm');
        to = format(new Date(to), 'yyyy-MM-dd HH:mm');
      } else if (key === 'amount') {
        from = `${book?.symbol}${from}`;
        to = `${book?.symbol}${to}`;
      } else if (key === 'former' || key === 'latter') {
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
      } else if (key === 'srcMemberId') {
        from = String(book?.members?.find((v) => v.id === from)?.nickname);
        to = String(book?.members?.find((v) => v.id === to)?.nickname);
      } else if (key === 'dstMemberId') {
        from = String(book?.members?.find((v) => v.id === from)?.nickname);
        to = String(book?.members?.find((v) => v.id === to)?.nickname);
      }

      return t('transaction.updateContent', { key: t(`transaction.key.${key}`), from, to });
    },
    [book, t],
  );

  if (!tx) return <></>;

  return (
    <div className="my-[15px]">
      {tx.dateDeleted && (
        <Body size="s" className="mb-[5px] text-navy-300">
          {t('transaction.deletedAt', {
            date: format(new Date(tx.dateDeleted), 'yyyy-MM-dd HH:mm'),
          })}
        </Body>
      )}
      {tx.history.map((v, i) => (
        <div key={i} className="mb-[5px]">
          {v.date && (
            <Body size="s" className="text-navy-300">
              {t('transaction.updatedAt', { date: format(new Date(v.date), 'yyyy-MM-dd HH:mm') })}
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
          {t('transaction.createdAt', {
            date: format(new Date(tx.dateCreated), 'yyyy-MM-dd HH:mm'),
          })}
        </Body>
      )}
    </div>
  );
};

export default History;
