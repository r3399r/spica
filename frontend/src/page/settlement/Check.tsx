import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Divider from 'src/celestial-ui/component/Divider';
import Body from 'src/celestial-ui/component/typography/Body';
import IcGoCheck from 'src/image/ic-go-check.svg';
import { RootState } from 'src/redux/store';
import { check } from 'src/service/settlementService';

const Check = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const members = useMemo(() => books?.find((v) => v.id === id)?.members ?? [], [id, books]);
  const checkResult = useMemo(() => check(members), [members]);

  if (checkResult.length === 0)
    return <Body className="text-navy-300 text-center">{t('settlement.isCleared')}</Body>;

  return (
    <>
      {checkResult.map((v, i) => (
        <div key={i} className="bg-grey-100 rounded-[15px] p-[10px] mb-[10px] cursor-pointer">
          <div className="flex gap-[10px] justify-between items-center">
            <Body size="l" className="w-[calc(50%-28px)] break-words">
              {v.latterNickname}
            </Body>
            <Body size="s" className="w-fit whitespace-nowrap text-navy-300">
              {t('settlement.shouldPay')}
            </Body>
            <Body size="l" className="w-[calc(50%-28px)] break-words text-right">
              {v.formerNickname}
            </Body>
          </div>
          <Divider className="my-[10px]" />
          <div className="flex">
            <Body size="l" className="flex-1">{`${book?.symbol}${v.amount}`}</Body>
            <img src={IcGoCheck} />
          </div>
        </div>
      ))}
    </>
  );
};

export default Check;
