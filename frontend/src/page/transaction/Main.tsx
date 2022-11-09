import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/component/celestial-ui/typography/Body';
import H2 from 'src/component/celestial-ui/typography/H2';
import H4 from 'src/component/celestial-ui/typography/H4';
import { RootState } from 'src/redux/store';
import { bn } from 'src/util/bignumber';

const Main = () => {
  const { id, tid } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const tx = useMemo(
    () => books?.find((v) => v.id === id)?.transactions?.find((v) => v.id === tid),
    [id, tid, books],
  );

  if (!tx || !book) return <></>;

  if (tx.type === 'transfer')
    return (
      <>
        <H4>{t('transaction.transfer')}</H4>
        <Body className="text-teal-500">{t(`transaction.transfer`)}</Body>
        <Body className="text-navy-300">{format(new Date(tx.date), 'yyyy-MM-dd HH:ss')}</Body>
        <H2 className="text-right mt-[10px] pb-[18px] border-b-[1px] border-b-grey-300">{`${
          book.symbol
        }${bn(tx.amount).toFormat()}`}</H2>
        <div className="py-[15px] border-b-[1px] border-b-grey-300">
          <Body size="s" className="mb-[5px] text-navy-300">
            {t('transaction.sender')}
          </Body>
          <div className="py-[5px] pl-[10px] flex justify-between">
            <Body size="l" className="text-navy-700">
              {book.members?.find((m) => m.id === tx.srcMemberId)?.nickname}
            </Body>
            <Body size="l" className="text-green-700">{`${book.symbol}${bn(
              tx.amount,
            ).toFormat()}`}</Body>
          </div>
        </div>
        <div className="py-[15px] border-b-[1px] border-b-grey-300">
          <Body size="s" className="mb-[5px] text-navy-300">
            {t('transaction.receiver')}
          </Body>
          <div className="py-[5px] pl-[10px] flex justify-between">
            <Body size="l" className="text-navy-700">
              {book.members?.find((m) => m.id === tx.dstMemberId)?.nickname}
            </Body>
            <Body size="l" className="text-tomato-700">{`${book.symbol}${bn(
              tx.amount,
            ).toFormat()}`}</Body>
          </div>
        </div>
        <div className="py-[15px] border-b-[1px] border-b-grey-300">
          <Body size="s" className="text-navy-300">
            {t('transaction.memo')}
          </Body>
          {tx.memo && <Body className="mt-[5px] pl-[10px]">{tx.memo}</Body>}
        </div>
      </>
    );

  if (tx.type === 'out')
    return (
      <>
        <H4>{tx.descr}</H4>
        <Body className={'text-tomato-700'}>{t(`transaction.${tx.type}`)}</Body>
        <Body className="text-navy-300">{format(new Date(tx.date), 'yyyy-MM-dd HH:ss')}</Body>
        <H2 className="text-right mt-[10px] pb-[18px] border-b-[1px] border-b-grey-300">{`${
          book.symbol
        }${bn(tx.amount).toFormat()}`}</H2>
        <div className="py-[15px] border-b-[1px] border-b-grey-300">
          <Body size="s" className="mb-[5px] text-navy-300">
            {t('transaction.payer')}
          </Body>
          {tx.former.map((v) => (
            <div key={v.id} className="py-[5px] pl-[10px] flex justify-between">
              <Body size="l" className="text-navy-700">
                {book.members?.find((m) => m.id === v.id)?.nickname}
              </Body>
              <Body size="l" className="text-green-700">{`${book.symbol}${bn(v.amount)
                .abs()
                .toFormat()}`}</Body>
            </div>
          ))}
        </div>
        <div className="py-[15px] border-b-[1px] border-b-grey-300">
          <Body size="s" className="mb-[5px] text-navy-300">
            {t('transaction.sharer')}
          </Body>
          {tx.latter.map((v) => (
            <div key={v.id} className="py-[5px] pl-[10px] flex justify-between">
              <Body size="l" className="text-navy-700">
                {book.members?.find((m) => m.id === v.id)?.nickname}
              </Body>
              <Body size="l" className="text-tomato-700">{`${book.symbol}${bn(v.amount)
                .abs()
                .toFormat()}`}</Body>
            </div>
          ))}
        </div>
        <div className="py-[15px] border-b-[1px] border-b-grey-300">
          <Body size="s" className="text-navy-300">
            {t('transaction.memo')}
          </Body>
          {tx.memo && <Body className="mt-[5px] pl-[10px]">{tx.memo}</Body>}
        </div>
      </>
    );

  return (
    <>
      <H4>{tx.descr}</H4>
      <Body className={'text-green-700'}>{t(`transaction.${tx.type}`)}</Body>
      <Body className="text-navy-300">{format(new Date(tx.date), 'yyyy-MM-dd HH:ss')}</Body>
      <H2 className="text-right mt-[10px] pb-[18px] border-b-[1px] border-b-grey-300">{`${
        book.symbol
      }${bn(tx.amount).toFormat()}`}</H2>
      <div className="py-[15px] border-b-[1px] border-b-grey-300">
        <Body size="s" className="mb-[5px] text-navy-300">
          {t('transaction.receiver')}
        </Body>
        {tx.former.map((v) => (
          <div key={v.id} className="py-[5px] pl-[10px] flex justify-between">
            <Body size="l" className="text-navy-700">
              {book.members?.find((m) => m.id === v.id)?.nickname}
            </Body>
            <Body size="l" className="text-tomato-700">{`${book.symbol}${bn(v.amount)
              .abs()
              .toFormat()}`}</Body>
          </div>
        ))}
      </div>
      <div className="py-[15px] border-b-[1px] border-b-grey-300">
        <Body size="s" className="mb-[5px] text-navy-300">
          {t('transaction.sharer')}
        </Body>
        {tx.latter.map((v) => (
          <div key={v.id} className="py-[5px] pl-[10px] flex justify-between">
            <Body size="l" className="text-navy-700">
              {book.members?.find((m) => m.id === v.id)?.nickname}
            </Body>
            <Body size="l" className="text-green-700">{`${book.symbol}${bn(v.amount)
              .abs()
              .toFormat()}`}</Body>
          </div>
        ))}
      </div>
      <div className="py-[15px] border-b-[1px] border-b-grey-300">
        <Body size="s" className="text-navy-300">
          {t('transaction.memo')}
        </Body>
        {tx.memo && <Body className="mt-[5px] pl-[10px]">{tx.memo}</Body>}
      </div>
    </>
  );
};

export default Main;
