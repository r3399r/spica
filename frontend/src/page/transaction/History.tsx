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

  const getCurrencyDisplay = (currencyId: string) => {
    const currency = book?.currencies?.find((v) => v.id === currencyId);
    const isMultiple = (book?.currencies?.length ?? 0) > 1;

    return isMultiple ? `${currency?.name}${currency?.symbol}` : currency?.symbol ?? '';
  };

  const getDisplayText = useCallback(
    (value: HistoryType['items'][0]) => {
      const key = value.key;
      let from = value.from;
      let to = value.to;

      let finalKey: string = key;
      if (key === 'former' || key === 'latter') {
        if (key === 'former') finalKey = tx?.type === 'in' ? 'formerIn' : 'formerOut';
        if (from === null) {
          const memberId = String(to).split(':')[0];
          const member = book?.members?.find((v) => v.id === memberId);
          const currencyId = String(to).split(':')[1];
          const amount = bn(String(to).split(':')[2]).abs().toFormat();

          return t('transaction.createContent', {
            key: t(`transaction.key.${finalKey}`),
            to: `${member?.nickname}(${getCurrencyDisplay(currencyId)}${amount})`,
          });
        }
        if (to === null) {
          const memberId = String(from).split(':')[0];
          const member = book?.members?.find((v) => v.id === memberId);
          const currencyId = String(from).split(':')[1];
          const amount = bn(String(from).split(':')[2]).abs().toFormat();

          return t('transaction.removeContent', {
            key: t(`transaction.key.${finalKey}`),
            from: `${member?.nickname}(${getCurrencyDisplay(currencyId)}${amount})`,
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
        const fromCurrencyId = String(from).split(':')[0];
        const fromAmount = bn(String(from).split(':')[1]).toFormat();
        const toCurrencyId = String(to).split(':')[0];
        const toAmount = bn(String(to).split(':')[1]).toFormat();
        from = `${getCurrencyDisplay(fromCurrencyId)}${fromAmount}`;
        to = `${getCurrencyDisplay(toCurrencyId)}${toAmount}`;
      } else if (key === 'former' || key === 'latter') {
        if (key === 'former') finalKey = tx?.type === 'in' ? 'formerIn' : 'formerOut';
        const fromMemberId = String(from).split(':')[0];
        const fromCurrencyId = String(from).split(':')[1];
        const fromAmount = bn(String(from).split(':')[2]).abs().toFormat();
        const toMemberId = String(to).split(':')[0];
        const toCurrencyId = String(to).split(':')[1];
        const toAmount = bn(String(to).split(':')[2]).abs().toFormat();
        from = `${book?.members?.find((v) => v.id === fromMemberId)?.nickname}(${getCurrencyDisplay(
          fromCurrencyId,
        )}${fromAmount})`;
        to = `${book?.members?.find((v) => v.id === toMemberId)?.nickname}(${getCurrencyDisplay(
          toCurrencyId,
        )}${toAmount})`;
      } else if (key === 'srcMemberId') {
        from = String(book?.members?.find((v) => v.id === from)?.nickname);
        to = String(book?.members?.find((v) => v.id === to)?.nickname);
      } else if (key === 'dstMemberId') {
        from = String(book?.members?.find((v) => v.id === from)?.nickname);
        to = String(book?.members?.find((v) => v.id === to)?.nickname);
      }

      return t('transaction.updateContent', { key: t(`transaction.key.${finalKey}`), from, to });
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
