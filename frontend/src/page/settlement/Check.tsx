import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Divider from 'src/component/Divider';
import Body from 'src/component/typography/Body';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import IcGoCheck from 'src/image/ic-go-check.svg';
import { Check as CheckType } from 'src/model/Book';
import { saveTransferFormData, setTxFormType } from 'src/redux/formSlice';
import { check } from 'src/service/settlementService';
import { bnFormat } from 'src/util/bignumber';

const Check = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const book = useBook();
  const members = useMemo(() => book?.members ?? [], [book]);
  const checkResult = useMemo(() => check(members), [members]);
  const currencyDisplay = useMemo(() => {
    const primary = book?.currencies?.find((v) => v.isPrimary);
    if (primary === undefined) return '';
    if (book?.currencies?.length === 1) return primary.symbol;

    return `${primary.name}${primary.symbol}`;
  }, [book]);

  const onCheck = (v: CheckType) => () => {
    dispatch(setTxFormType('transfer'));
    dispatch(
      saveTransferFormData({
        srcMemberId: v.latter.id,
        dstMemberId: v.former.id,
        amount: v.amount,
      }),
    );
    navigate(`${Page.Book}/${id}/tx`);
  };

  if (checkResult.length === 0)
    return <Body className="text-center text-navy-300">{t('settlement.isCleared')}</Body>;

  return (
    <>
      {checkResult.map((v, i) => (
        <div
          key={i}
          className="mb-[10px] cursor-pointer rounded-[15px] bg-grey-100 p-[10px]"
          onClick={onCheck(v)}
        >
          <div className="flex items-center justify-between gap-[10px]">
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
            <Body size="l" className="flex-1">{`${currencyDisplay}${bnFormat(v.amount)}`}</Body>
            <img src={IcGoCheck} />
          </div>
        </div>
      ))}
    </>
  );
};

export default Check;
