import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import AmountInput from 'src/component/AmountInput';
import Checkbox from 'src/component/Checkbox';
import Body from 'src/component/typography/Body';
import { ShareMethod } from 'src/constant/backend/Book';
import useBook from 'src/hook/useBook';
import { MemberAdjust } from 'src/model/Book';
import { RootState } from 'src/redux/store';
import { addMemberToBillLatter, removeMemberFromBillLatter } from 'src/service/transactionService';
import { bn } from 'src/util/bignumber';

const SplitAdjust = () => {
  const { t } = useTranslation();
  const { billFormData, involvedMemberIds } = useSelector((rootState: RootState) => rootState.form);
  const book = useBook();
  const members = useMemo(
    () =>
      book?.members?.filter((v) => v.visible === true || new Set(involvedMemberIds).has(v.id)) ??
      [],
    [book, involvedMemberIds],
  );
  const [input, setInput] = useState<MemberAdjust[]>([]);
  const symbol = useMemo(
    () => book?.currencies?.find((v) => v.id === billFormData.currencyId)?.symbol,
    [book, billFormData],
  );

  useEffect(() => {
    setInput(
      members.map((v) => {
        const shareDetail = billFormData.latter?.find((o) => o.id === v.id);
        const value = String(shareDetail?.value ?? 0);

        return {
          id: v.id,
          checked: shareDetail !== undefined,
          nickname: v.nickname,
          value,
          amount: shareDetail ? bn(shareDetail.amount).minus(value).toString() : '',
        };
      }),
    );
  }, [members]);

  useEffect(() => {
    if (input.length > 0)
      setInput(
        input.map((v) => {
          const shareDetail = billFormData.latter?.find((o) => o.id === v.id);
          const value = shareDetail?.value ?? 0;

          return {
            ...v,
            checked: shareDetail !== undefined,
            amount: shareDetail ? bn(shareDetail.amount).minus(value).toString() : '0',
          };
        }),
      );
  }, [billFormData.latter]);

  const onInput = (memberId: string) => (v: ChangeEvent<HTMLInputElement>) => {
    setInput(input.map((o) => (o.id === memberId ? { ...o, value: v.target.value } : o)));
    addMemberToBillLatter(memberId, 'pm', {
      id: memberId,
      method: ShareMethod.PlusMinus,
      value: Number(v.target.value ?? 0),
    });
  };

  const onCheck = (memberId: string) => (v: ChangeEvent<HTMLInputElement>) => {
    if (v.target.checked)
      addMemberToBillLatter(memberId, 'pm', {
        id: memberId,
        method: ShareMethod.PlusMinus,
        value: 0,
      });
    else {
      setInput(input.map((o) => (o.id === memberId ? { ...o, value: '0' } : o)));
      removeMemberFromBillLatter(memberId, 'pm');
    }
  };

  return (
    <>
      <div className="flex gap-[10px]">
        <div className="flex-1" />
        <Body className="w-[78px]" size="s">
          {t('editTx.adjust')}
        </Body>
        <Body className="w-[72px]" size="s">
          {t('editTx.amount')}
        </Body>
      </div>
      {input.map((v) => (
        <div key={v.id} className="flex h-[60px] items-center gap-[10px]">
          <div className="flex flex-1 items-center">
            <Checkbox id={v.id} checked={v.checked} onChange={onCheck(v.id)} />
            <label htmlFor={v.id} className="w-full pl-3 break-all">
              {v.nickname}
            </label>
          </div>
          <AmountInput
            symbol={symbol ?? '$'}
            decimal={2}
            className="!w-[78px]"
            value={`${symbol}${v.value}`}
            onChange={onInput(v.id)}
          />
          <Body size="l" className="min-w-[72px] text-navy-100">{`+ ${symbol}${v.amount}`}</Body>
        </div>
      ))}
    </>
  );
};

export default SplitAdjust;
