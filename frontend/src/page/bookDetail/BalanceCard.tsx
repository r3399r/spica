import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/component/celestial-ui/typography/Body';
import H4 from 'src/component/celestial-ui/typography/H4';
import IcGo from 'src/image/ic-go.svg';
import { RootState } from 'src/redux/store';
import { bn, bnFormat } from 'src/util/bignumber';

const BalanceCard = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const former = useMemo(() => book?.members?.filter((v) => v.balance >= 0) ?? [], [book]);
  const latter = useMemo(() => book?.members?.filter((v) => v.balance < 0) ?? [], [book]);

  return (
    <div className="rounded-[15px] p-[10px] bg-grey-200 my-[10px] text-navy-700">
      <div className="mb-[10px] flex justify-between">
        <H4>{t('bookDetail.balance')}</H4>
        <div className="flex items-center h-[21px]">
          <Body bold className="text-navy-300">
            {t('bookDetail.check')}
          </Body>
          <img src={IcGo} />
        </div>
      </div>
      {book && book.members && book.members.length === 0 && <div className="text-black">--</div>}
      {former.length > 0 && (
        <>
          <div className="flex items-center gap-[10px]">
            <Body size="s" className="text-navy-300">
              {t('bookDetail.shouldReceive')}
            </Body>
            <div className="h-[1px] bg-grey-500 flex-1" />
          </div>
          {former.map((v) => (
            <div key={v.id} className="flex justify-between py-[5px] ml-[10px] gap-2">
              <Body size="l" className="text-navy-700">
                {v.nickname}
              </Body>
              <Body size="l" className="text-green-700">{`${book?.symbol}${bnFormat(
                v.balance,
              )}`}</Body>
            </div>
          ))}
        </>
      )}
      {latter.length > 0 && (
        <>
          <div className="flex items-center gap-[10px]">
            <Body size="s" className="text-navy-300">
              {t('bookDetail.shouldPay')}
            </Body>
            <div className="h-[1px] bg-grey-500 flex-1" />
          </div>
          {latter.map((v) => (
            <div key={v.id} className="flex justify-between py-[5px] ml-[10px] gap-2">
              <Body size="l" className="text-navy-700">
                {v.nickname}
              </Body>
              <Body size="l" className="text-tomato-700">{`${book?.symbol}${bn(v.balance)
                .abs()
                .toFormat()}`}</Body>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default BalanceCard;
