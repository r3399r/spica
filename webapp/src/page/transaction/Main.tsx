import classNames from 'classnames';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Body from 'src/component/typography/Body';
import H2 from 'src/component/typography/H2';
import H4 from 'src/component/typography/H4';
import useBook from 'src/hook/useBook';
import { bn, bnFormat } from 'src/util/bignumber';
import { compare } from 'src/util/compare';

const Main = () => {
  const { tid } = useParams();
  const { t } = useTranslation();
  const book = useBook();
  const tx = useMemo(() => book?.transactions?.find((v) => v.id === tid), [tid, book]);
  const currentCurrency = useMemo(
    () => book?.currencies?.find((v) => v.id === tx?.currencyId),
    [book, tx],
  );
  const mainCurrency = useMemo(() => book?.currencies?.find((v) => v.isPrimary === true), [book]);
  const currencyDisplay = useMemo(() => {
    const isMultiple = (book?.currencies?.length ?? 0) > 1;

    return isMultiple
      ? `${currentCurrency?.name}${currentCurrency?.symbol}`
      : currentCurrency?.symbol;
  }, [book, currentCurrency]);

  const txFormer = useMemo(() => {
    if (!tx || tx.type === 'transfer') return [];

    return tx.former
      .map((v) => {
        const member = book?.members?.find((o) => o.id === v.id);

        return { ...v, ...member };
      })
      .sort(compare('dateCreated'));
  }, [tx, book]);
  const txLatter = useMemo(() => {
    if (!tx || tx.type === 'transfer') return [];

    return tx.latter
      .map((v) => {
        const member = book?.members?.find((o) => o.id === v.id);

        return { ...v, ...member };
      })
      .sort(compare('dateCreated'));
  }, [tx, book]);

  if (!tx || !book) return <></>;

  if (tx.type === 'transfer')
    return (
      <>
        <H4>{t('desc.transfer')}</H4>
        <Body className="text-teal-500">{t('desc.transfer')}</Body>
        <Body className="text-navy-300">{format(new Date(tx.date), 'yyyy-MM-dd HH:mm')}</Body>
        <div className="mt-[10px] border-b border-b-grey-300 pb-[18px] text-right">
          <H2>{`${currencyDisplay}${bnFormat(tx.amount)}`}</H2>
          {mainCurrency && currentCurrency && currentCurrency.id !== mainCurrency.id && (
            <Body className="mt-[5px] text-navy-300">{`≈${mainCurrency.name}${
              mainCurrency.symbol
            }${bn(tx.amount)
              .times(currentCurrency.exchangeRate ?? 0)
              .dp(2)
              .toFormat()}`}</Body>
          )}
        </div>
        <div className="border-b-[1px] border-b-grey-300 py-[15px]">
          <Body size="s" className="mb-[5px] text-navy-300">
            {t('desc.sender')}
          </Body>
          <div className="flex justify-between py-[5px] pl-[10px]">
            <Body size="l" className="text-navy-700">
              {book.members?.find((m) => m.id === tx.srcMemberId)?.nickname}
            </Body>
            <Body size="l" className="text-green-700">{`${currencyDisplay}${bnFormat(
              tx.amount,
            )}`}</Body>
          </div>
        </div>
        <div className="border-b-[1px] border-b-grey-300 py-[15px]">
          <Body size="s" className="mb-[5px] text-navy-300">
            {t('desc.receiver')}
          </Body>
          <div className="flex justify-between py-[5px] pl-[10px]">
            <Body size="l" className="text-navy-700">
              {book.members?.find((m) => m.id === tx.dstMemberId)?.nickname}
            </Body>
            <Body size="l" className="text-tomato-700">{`${currencyDisplay}${bnFormat(
              tx.amount,
            )}`}</Body>
          </div>
        </div>
        <div className="border-b-[1px] border-b-grey-300 py-[15px]">
          <Body size="s" className="text-navy-300">
            {t('desc.memo')}
          </Body>
          {tx.memo && <Body className="mt-[5px] whitespace-pre pl-[10px]">{tx.memo}</Body>}
        </div>
      </>
    );

  return (
    <>
      <H4>{tx.descr}</H4>
      <Body
        className={classNames({
          'text-tomato-700': tx.type === 'out',
          'text-green-700': tx.type === 'in',
        })}
      >
        {tx.type === 'out' ? t('desc.out') : t('desc.in')}
      </Body>
      <Body className="text-navy-300">{format(new Date(tx.date), 'yyyy-MM-dd HH:mm')}</Body>
      <div className="mt-[10px] border-b border-b-grey-300 pb-[18px] text-right">
        <H2>{`${currencyDisplay}${bnFormat(tx.amount)}`}</H2>
        {mainCurrency && currentCurrency && currentCurrency.id !== mainCurrency.id && (
          <Body className="mt-[5px] text-navy-300">{`≈${mainCurrency.name}${
            mainCurrency.symbol
          }${bn(tx.amount)
            .times(currentCurrency.exchangeRate ?? 0)
            .dp(2)
            .toFormat()}`}</Body>
        )}
      </div>
      <div className="border-b-[1px] border-b-grey-300 py-[15px]">
        <Body size="s" className="mb-[5px] text-navy-300">
          {tx.type === 'out' ? t('desc.payer') : t('desc.receiver')}
        </Body>
        {txFormer.map((v) => (
          <div key={v.id} className="flex justify-between py-[5px] pl-[10px]">
            <Body size="l" className="text-navy-700">
              {v.nickname}
            </Body>
            <Body size="l" className="text-green-700">{`${currencyDisplay}${bn(v.amount)
              .abs()
              .toFormat()}`}</Body>
          </div>
        ))}
      </div>
      <div className="border-b-[1px] border-b-grey-300 py-[15px]">
        <Body size="s" className="mb-[5px] text-navy-300">
          {t('desc.sharer')}
        </Body>
        {txLatter.map((v) => (
          <div key={v.id} className="flex justify-between py-[5px] pl-[10px]">
            <Body size="l" className="text-navy-700">
              {v.nickname}
            </Body>
            <Body size="l" className="text-tomato-700">{`${currencyDisplay}${bn(v.amount)
              .abs()
              .toFormat()}`}</Body>
          </div>
        ))}
      </div>
      <div className="border-b-[1px] border-b-grey-300 py-[15px]">
        <Body size="s" className="text-navy-300">
          {t('desc.memo')}
        </Body>
        {tx.memo && <Body className="mt-[5px] whitespace-pre pl-[10px]">{tx.memo}</Body>}
      </div>
    </>
  );
};

export default Main;
