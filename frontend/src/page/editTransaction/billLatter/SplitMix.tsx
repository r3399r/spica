import { ShareMethod } from '@y-celestial/spica-service';
import classNames from 'classnames';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Checkbox from 'src/celestial-ui/component/Checkbox';
import Body from 'src/celestial-ui/component/typography/Body';
import AmountInput from 'src/component/AmountInput';
import { MemberLatter } from 'src/model/Book';
import { RootState } from 'src/redux/store';
import { addMemberToBillLatter, removeMemberFromBillLatter } from 'src/service/transactionService';
import { bn } from 'src/util/bignumber';
import SplitMixModal from './SplitMixModal';

type Props = {
  mode: 'weight' | 'pct';
};

const SplitMixed = ({ mode }: Props) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const {
    book: { books },
    form: { billFormData },
  } = useSelector((rootState: RootState) => rootState);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const members = useMemo(() => books?.find((v) => v.id === id)?.members ?? [], [books]);
  const [input, setInput] = useState<MemberLatter[]>([]);
  const [targetId, setTargetId] = useState<string>();

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
              amount: v.target.value,
              customAmount: true,
            }
          : o,
      ),
    );
    addMemberToBillLatter(memberId, mode, {
      id: memberId,
      method: ShareMethod.Amount,
      value: Number(v.target.value),
    });
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
            <label htmlFor={v.id} className="pl-3 break-all w-full">
              {v.nickname}
            </label>
          </div>
          <div
            className="min-w-[72px] bg-grey-200 rounded-[4px] p-2 flex justify-between gap-0.5"
            onClick={() => setTargetId(v.id)}
          >
            <Body size="l">{v.value ?? ''}</Body>
            <Body size="l" className="text-navy-500">
              {v.method === ShareMethod.Percentage ? t('editTx.unitPct') : t('editTx.unitWeight')}
            </Body>
          </div>
          <AmountInput
            symbol={book?.symbol ?? '$'}
            decimal={2}
            className={classNames('w-[90px]', {
              'text-navy-900': v.customAmount,
              'text-navy-100': !v.customAmount,
            })}
            value={`${book?.symbol}${v.amount}`}
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
