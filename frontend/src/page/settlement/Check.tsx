import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Divider from 'src/celestial-ui/component/Divider';
import Body from 'src/celestial-ui/component/typography/Body';
import { Page } from 'src/constant/Page';
import IcGoCheck from 'src/image/ic-go-check.svg';
import { Check as CheckType } from 'src/model/Book';
import { saveTransferFormData, setTxFormType } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import { check } from 'src/service/settlementService';
import { bnFormat } from 'src/util/bignumber';

const Check = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const members = useMemo(() => books?.find((v) => v.id === id)?.members ?? [], [id, books]);
  const checkResult = useMemo(() => check(members), [members]);

  const onCheck = (v: CheckType) => () => {
    dispatch(setTxFormType('transfer'));
    dispatch(
      saveTransferFormData({
        srcMemberId: v.former.id,
        dstMemberId: v.latter.id,
        amount: v.amount,
      }),
    );
    navigate(`${Page.Book}/${id}/tx`);
  };

  if (checkResult.length === 0)
    return <Body className="text-navy-300 text-center">{t('settlement.isCleared')}</Body>;

  return (
    <>
      {checkResult.map((v, i) => (
        <div
          key={i}
          className="bg-grey-100 rounded-[15px] p-[10px] mb-[10px] cursor-pointer"
          onClick={onCheck(v)}
        >
          <div className="flex gap-[10px] justify-between items-center">
            <Body size="l" className="w-[calc(50%-28px)] break-words">
              {v.latter.nickname}
            </Body>
            <Body size="s" className="w-fit whitespace-nowrap text-navy-300">
              {t('settlement.shouldPay')}
            </Body>
            <Body size="l" className="w-[calc(50%-28px)] break-words text-right">
              {v.former.nickname}
            </Body>
          </div>
          <Divider className="my-[10px]" />
          <div className="flex">
            <Body size="l" className="flex-1">{`${book?.symbol}${bnFormat(v.amount)}`}</Body>
            <img src={IcGoCheck} />
          </div>
        </div>
      ))}
    </>
  );
};

export default Check;
