import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import IcGo from 'src/image/ic-go.svg';
import { RootState } from 'src/redux/store';
import { bn, bnFormat } from 'src/util/bignumber';

const BalanceCard = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const former = useMemo(() => book?.members?.filter((v) => v.balance > 0) ?? [], [book]);
  const latter = useMemo(() => book?.members?.filter((v) => v.balance <= 0) ?? [], [book]);

  return (
    <div className="rounded-[15px] p-[10px] bg-grey-200 my-[10px] text-navy-700">
      <div className="mb-[10px] flex justify-between">
        <div className="font-bold text-xl">{t('bookDetail.balance')}</div>
        <div className="flex items-center h-[21px]">
          <div className="text-[14px] leading-[21px] text-navy-300 font-bold">結帳</div>
          <img src={IcGo} />
        </div>
      </div>
      {book && book.members && book.members.length === 0 && <div className="text-black">--</div>}
      {former.length > 0 && (
        <>
          <div className="flex items-center gap-[10px]">
            <div className="text-[12px] leading-[18px] text-navy-300">須收款</div>
            <div className="h-[1px] bg-grey-500 flex-1" />
          </div>
          {former.map((v) => (
            <div key={v.id} className="flex justify-between py-[5px] ml-[10px] gap-2">
              <div>{v.nickname}</div>
              <div>{`$${bnFormat(v.balance)}`}</div>
            </div>
          ))}
        </>
      )}
      {latter.length > 0 && (
        <>
          <div className="flex items-center gap-[10px]">
            <div className="text-[12px] leading-[18px] text-navy-300">須還款</div>
            <div className="h-[1px] bg-grey-500 flex-1" />
          </div>
          {latter.map((v) => (
            <div key={v.id} className="flex justify-between py-[5px] ml-[10px] gap-2">
              <div>{v.nickname}</div>
              <div>{`$${bn(v.balance).negated().toFormat()}`}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default BalanceCard;
