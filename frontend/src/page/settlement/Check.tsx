import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'src/component/Button';
import Divider from 'src/component/Divider';
import Body from 'src/component/typography/Body';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import IcGoCheck from 'src/image/ic-go-check.svg';
import IcReceipts from 'src/image/ic-receipts.svg';
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
  const [mode, setMode] = useState<0 | 1>(0);
  const checkResult = useMemo(() => check(members, mode), [members, mode]);
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
    <div>
      <div className="flex items-center justify-between border-t border-t-grey-300 py-[17px]">
        <Body size="l" bold>
          {mode === 0 ? t('settlement.intuitionMode') : t('settlement.minimumPaymentMode')}
        </Body>
        <Button
          appearance="default"
          className="!px-[10px] !py-[5px]"
          type="button"
          onClick={() => setMode(mode === 0 ? 1 : 0)}
        >
          {t('settlement.switch')}
        </Button>
      </div>
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
            <div className="flex w-[calc(50%-28px)] justify-end gap-[5px] break-words">
              <Body size="l">{v.former.nickname}</Body>
              {v.former.deviceId && (
                <img
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`${Page.Setting}/payment`, { state: { user: v.former } });
                  }}
                  src={IcReceipts}
                />
              )}
            </div>
          </div>
          <Divider className="my-[10px]" />
          <div className="flex">
            <Body size="l" className="flex-1">{`${currencyDisplay}${bnFormat(v.amount)}`}</Body>
            <img src={IcGoCheck} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Check;
