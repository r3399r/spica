import { ShareMethod } from '@y-celestial/spica-service';
import classNames from 'classnames';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AmountInput from 'src/component/AmountInput';
import Button from 'src/component/celestial-ui/Button';
import Checkbox from 'src/component/celestial-ui/Checkbox';
import Divider from 'src/component/celestial-ui/Divider';
import Body from 'src/component/celestial-ui/typography/Body';
import H2 from 'src/component/celestial-ui/typography/H2';
import { MemberFormer } from 'src/model/Book';
import { saveBillFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import { setTxState } from 'src/redux/uiSlice';
import {
  addMemberToBillFormer,
  remainingAmount,
  removeMemberFromBillFormer,
} from 'src/service/transactionService';
import { bn, bnFormat } from 'src/util/bignumber';
import Navbar from './Navbar';

const BillFormer = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    book: { books },
    form: { billFormData },
  } = useSelector((rootState: RootState) => rootState);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const members = useMemo(() => books?.find((v) => v.id === id)?.members ?? [], [books]);
  const [input, setInput] = useState<MemberFormer[]>([]);
  const initialFormer = useMemo(() => billFormData.former, []);
  const remaining = useMemo(
    () => remainingAmount(billFormData.amount ?? 0, billFormData.former ?? []),
    [billFormData.former],
  );

  useEffect(() => {
    setInput(
      members.map((v) => ({
        id: v.id,
        checked: billFormData.former?.find((o) => o.id === v.id) !== undefined,
        nickname: v.nickname,
        amount: `${billFormData.former?.find((o) => o.id === v.id)?.amount ?? 0}`,
        customAmount:
          billFormData.former?.find((o) => o.id === v.id)?.method === ShareMethod.Amount,
      })),
    );
  }, [members]);

  useEffect(() => {
    if (input.length > 0)
      setInput(
        input.map((v) => ({
          ...v,
          checked: billFormData.former?.find((o) => o.id === v.id) !== undefined,
          amount: v.customAmount
            ? v.amount
            : `${billFormData.former?.find((o) => o.id === v.id)?.amount ?? 0}`,
        })),
      );
  }, [billFormData.former]);

  const onInput = (memberId: string) => (v: ChangeEvent<HTMLInputElement>) => {
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
    addMemberToBillFormer(memberId, {
      id: memberId,
      method: ShareMethod.Amount,
      value: Number(v.target.value),
    });
  };

  const onCheck = (memberId: string) => (v: ChangeEvent<HTMLInputElement>) => {
    if (v.target.checked) addMemberToBillFormer(memberId);
    else {
      removeMemberFromBillFormer(memberId);
      setInput(input.map((o) => (o.id === memberId ? { ...o, customAmount: false } : o)));
    }
  };

  const onReset = () => {
    dispatch(saveBillFormData({ former: undefined }));
    setInput(input.map((v) => ({ ...v, customAmount: false })));
  };

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <Navbar
            onCancel={() => {
              dispatch(setTxState('main'));
              dispatch(saveBillFormData({ former: initialFormer }));
            }}
          />
          <div className="flex justify-between items-center">
            <H2>{`${book?.symbol}${bnFormat(billFormData.amount ?? 0)}`}</H2>
            <Body className={classNames({ 'text-tomato-500': remaining !== 0 })}>{`${t(
              remaining > 0 ? 'editTx.greaterThan' : 'editTx.lessThan',
              {
                symbol: book?.symbol,
                amount: bn(remaining).abs().toFormat(),
              },
            )}`}</Body>
          </div>
          <Divider className="my-[15px]" />
          <div className="flex">
            <div className="flex-1" />
            <Body className="w-[90px]" size="s">
              {t('editTx.amount')}
            </Body>
          </div>
          {input.map((v) => (
            <div key={v.id} className="flex h-[60px] items-center gap-3">
              <div className="flex flex-1 items-center">
                <Checkbox id={v.id} checked={v.checked} onChange={onCheck(v.id)} />
                <label htmlFor={v.id} className="pl-3 break-all w-full">
                  {v.nickname}
                </label>
              </div>
              <AmountInput
                symbol={book?.symbol ?? '$'}
                decimal={2}
                className={classNames('w-[90px]', {
                  'text-navy-900': v.customAmount,
                  'text-navy-100': !v.customAmount,
                })}
                value={`${book?.symbol}${v.amount}`}
                onChange={onInput(v.id)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 h-[104px] w-full flex justify-center">
        <div className="max-w-[640px] w-full mx-9 flex gap-5">
          <Button className="mt-5 w-full h-12 text-base" appearance="secondary" onClick={onReset}>
            {t('act.reset')}
          </Button>
          <Button
            className="mt-5 w-full h-12 text-base"
            onClick={() => dispatch(setTxState('main'))}
            disabled={remaining !== 0}
          >
            {t('act.confirm')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BillFormer;
