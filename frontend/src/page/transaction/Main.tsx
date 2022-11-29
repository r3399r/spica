import classNames from 'classnames';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/celestial-ui/typography/Body';
import H2 from 'src/celestial-ui/typography/H2';
import H4 from 'src/celestial-ui/typography/H4';
import { RootState } from 'src/redux/store';
import { bn, bnFormat } from 'src/util/bignumber';
import { compare } from 'src/util/compare';

const Main = () => {
  const { id, tid } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const tx = useMemo(() => book?.transactions?.find((v) => v.id === tid), [id, tid, book]);

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
        <H2 className="text-right mt-[10px] pb-[18px] border-b-[1px] border-b-grey-300">{`${
          book.symbol
        }${bnFormat(tx.amount)}`}</H2>
        <div className="py-[15px] border-b-[1px] border-b-grey-300">
          <Body size="s" className="mb-[5px] text-navy-300">
            {t('desc.sender')}
          </Body>
          <div className="py-[5px] pl-[10px] flex justify-between">
            <Body size="l" className="text-navy-700">
              {book.members?.find((m) => m.id === tx.srcMemberId)?.nickname}
            </Body>
            <Body size="l" className="text-green-700">{`${book.symbol}${bnFormat(
              tx.amount,
            )}`}</Body>
          </div>
        </div>
        <div className="py-[15px] border-b-[1px] border-b-grey-300">
          <Body size="s" className="mb-[5px] text-navy-300">
            {t('desc.receiver')}
          </Body>
          <div className="py-[5px] pl-[10px] flex justify-between">
            <Body size="l" className="text-navy-700">
              {book.members?.find((m) => m.id === tx.dstMemberId)?.nickname}
            </Body>
            <Body size="l" className="text-tomato-700">{`${book.symbol}${bnFormat(
              tx.amount,
            )}`}</Body>
          </div>
        </div>
        <div className="py-[15px] border-b-[1px] border-b-grey-300">
          <Body size="s" className="text-navy-300">
            {t('desc.memo')}
          </Body>
          {tx.memo && <Body className="mt-[5px] pl-[10px]">{tx.memo}</Body>}
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
      <H2 className="text-right mt-[10px] pb-[18px] border-b-[1px] border-b-grey-300">{`${
        book.symbol
      }${bnFormat(tx.amount)}`}</H2>
      <div className="py-[15px] border-b-[1px] border-b-grey-300">
        <Body size="s" className="mb-[5px] text-navy-300">
          {tx.type === 'out' ? t('desc.payer') : t('desc.receiver')}
        </Body>
        {txFormer.map((v) => (
          <div key={v.id} className="py-[5px] pl-[10px] flex justify-between">
            <Body size="l" className="text-navy-700">
              {v.nickname}
            </Body>
            <Body size="l" className="text-green-700">{`${book.symbol}${bn(v.amount)
              .abs()
              .toFormat()}`}</Body>
          </div>
        ))}
      </div>
      <div className="py-[15px] border-b-[1px] border-b-grey-300">
        <Body size="s" className="mb-[5px] text-navy-300">
          {t('desc.sharer')}
        </Body>
        {txLatter.map((v) => (
          <div key={v.id} className="py-[5px] pl-[10px] flex justify-between">
            <Body size="l" className="text-navy-700">
              {v.nickname}
            </Body>
            <Body size="l" className="text-tomato-700">{`${book.symbol}${bn(v.amount)
              .abs()
              .toFormat()}`}</Body>
          </div>
        ))}
      </div>
      <div className="py-[15px] border-b-[1px] border-b-grey-300">
        <Body size="s" className="text-navy-300">
          {t('desc.memo')}
        </Body>
        {tx.memo && <Body className="mt-[5px] pl-[10px]">{tx.memo}</Body>}
      </div>
    </>
  );
};

export default Main;
