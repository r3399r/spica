import classNames from 'classnames';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import AmountInput from 'src/component/AmountInput';
import Checkbox from 'src/component/Checkbox';
import Body from 'src/component/typography/Body';
import { ShareMethod } from 'src/constant/backend/Book';
import useBook from 'src/hook/useBook';
import { MemberLatter } from 'src/model/Book';
import { RootState } from 'src/redux/store';
import { addMemberToBillLatter, removeMemberFromBillLatter } from 'src/service/transactionService';
import { bn } from 'src/util/bignumber';
import SplitMixModal from './SplitMixModal';

type Props = { mode: 'weight' | 'pct' };

const SplitMixed = ({ mode }: Props) => {
  const { t } = useTranslation();
  const { billFormData } = useSelector((rootState: RootState) => rootState.form);
  const book = useBook();
  const members = useMemo(() => book?.members ?? [], [book]);
  const [input, setInput] = useState<MemberLatter[]>([]);
  const [targetId, setTargetId] = useState<string>();
  const symbol = useMemo(
    () => book?.currencies?.find((v) => v.id === billFormData.currencyId)?.symbol,
    [book, billFormData],
  );

  useEffect(() => {
    setInput(
      members.map((v) => {
        const shareDetail = billFormData.latter?.find((o) => o.id === v.id);

        return {
          id: v.id,
          checked: shareDetail !== undefined,
          nickname: v.nickname,
          method:
            shareDetail?.method ??
            (mode === 'weight' ? ShareMethod.Weight : ShareMethod.Percentage),
          value: shareDetail?.value ? String(shareDetail.value) : null,
          amount: `${shareDetail?.amount ?? 0}`,
          customAmount: shareDetail?.method === ShareMethod.Amount,
        };
      }),
    );
  }, [members]);

  useEffect(() => {
    if (input.length > 0)
      setInput(
        input.map((v) => {
          const shareDetail = billFormData.latter?.find((o) => o.id === v.id);

          return {
            ...v,
            checked: shareDetail !== undefined,
            method:
              shareDetail?.method ??
              (mode === 'weight' ? ShareMethod.Weight : ShareMethod.Percentage),
            value: shareDetail?.value ? String(shareDetail.value) : null,
            amount: v.customAmount ? v.amount : `${shareDetail?.amount ?? 0}`,
            customAmount: shareDetail?.method === ShareMethod.Amount,
          };
        }),
      );
  }, [billFormData.latter]);

  const onInputAmount = (memberId: string) => (v: ChangeEvent<HTMLInputElement>) => {
    setInput(
      input.map((o) =>
        o.id === memberId
          ? {
              ...o,
              checked: Number(v.target.value) > 0,
              amount: v.target.value,
              customAmount: true,
            }
          : o,
      ),
    );
    if (Number(v.target.value) > 0)
      addMemberToBillLatter(memberId, mode, {
        id: memberId,
        method: ShareMethod.Amount,
        value: Number(v.target.value),
      });
    else removeMemberFromBillLatter(memberId);
  };

  const onCheck = (memberId: string) => (v: ChangeEvent<HTMLInputElement>) => {
    if (v.target.checked) {
      addMemberToBillLatter(
        memberId,
        mode,
        mode === 'weight'
          ? undefined
          : {
              id: memberId,
              method: ShareMethod.Percentage,
              value: bn(100).div(members.length).dp(2).toNumber(),
            },
      );
      setInput(input.map((o) => (o.id === memberId ? { ...o, customAmount: false } : o)));
    } else {
      removeMemberFromBillLatter(memberId);
      setInput(input.map((o) => (o.id === memberId ? { ...o, customAmount: false } : o)));
    }
  };

  return (
    <>
      <div className="flex gap-[10px]">
        <div className="flex-1" />
        <Body className="w-[72px]" size="s">
          {t('editTx.share')}
        </Body>
        <Body className="w-[90px]" size="s">
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
          <div
            className="flex min-w-[72px] justify-between gap-0.5 rounded-[4px] bg-grey-200 p-2"
            onClick={() => setTargetId(v.id)}
          >
            <Body size="l">{v.value ?? ''}</Body>
            <Body size="l" className="text-navy-500">
              {v.method === ShareMethod.Percentage ? t('editTx.unitPct') : t('editTx.unitWeight')}
            </Body>
          </div>
          <AmountInput
            symbol={symbol ?? '$'}
            decimal={2}
            className={classNames('!w-[90px]', {
              'text-navy-900': v.customAmount,
              'text-navy-100': !v.customAmount,
            })}
            value={`${symbol}${v.amount}`}
            onChange={onInputAmount(v.id)}
          />
        </div>
      ))}
      <SplitMixModal
        open={targetId !== undefined}
        onClose={() => setTargetId(undefined)}
        member={members.find((v) => v.id === targetId)}
        mode={mode}
      />
    </>
  );
};

export default SplitMixed;
