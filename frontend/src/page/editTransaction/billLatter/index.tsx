import { ShareMethod } from '@y-celestial/spica-service';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from 'src/celestial-ui/component/Button';
import IcPctInactive from 'src/image/ic-method-pct-inactive.svg';
import IcPct from 'src/image/ic-method-pct.svg';
import IcPmInactive from 'src/image/ic-method-pm-inactive.svg';
import IcPm from 'src/image/ic-method-pm.svg';
import IcWeightInactive from 'src/image/ic-method-weight-inactive.svg';
import IcWeight from 'src/image/ic-method-weight.svg';
import { saveBillFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import { setTxState } from 'src/redux/uiSlice';
import { remainingAmount, saveBillDataEvenly } from 'src/service/transactionService';
import { bn } from 'src/util/bignumber';
import Navbar from './Navbar';
import Percentage from './Percentage';
import PlusMinus from './PlusMinus';
import Weight from './Weight';

const BillLatter = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState<'weight' | 'pct' | 'pm'>('weight');
  const {
    book: { books },
    form: { billFormData },
  } = useSelector((rootState: RootState) => rootState);
  const members = useMemo(() => books?.find((v) => v.id === id)?.members ?? [], [books]);
  const initialLatter = useMemo(() => billFormData.latter, []);
  const remaining = useMemo(
    () => remainingAmount(billFormData.amount ?? 0, billFormData.latter ?? []),
    [billFormData.latter],
  );
  const sharedPct = useMemo(() => bn(100).div(members.length).dp(2).toNumber(), [members]);
  const isAllShare =
    members.length ===
      billFormData.latter?.filter((v) => v.method === ShareMethod.Weight && v.value === 1).length ||
    members.length ===
      billFormData.latter?.filter(
        (v) => v.method === ShareMethod.Percentage && v.value === sharedPct,
      ).length;

  useEffect(() => {
    if (!billFormData.latter) return;
    const numLatterPm = billFormData.latter.filter(
      (v) => v.method === ShareMethod.PlusMinus,
    ).length;
    if (numLatterPm > 0 && numLatterPm === billFormData.latter.length) setTab('pm');
  }, []);

  const onReset = () => {
    if (!members || members.length === 0) return;
    setTab('weight');
    saveBillDataEvenly(billFormData.amount ?? 0, members, { mode: 'weight' });
  };

  const onClickWeight = () => {
    setTab('weight');
    if (!billFormData.latter || isAllShare || tab === 'pm')
      saveBillDataEvenly(billFormData.amount ?? 0, members, { mode: 'weight' });
  };

  const onClickPct = () => {
    setTab('pct');
    if (!billFormData.latter || isAllShare || tab === 'pm')
      saveBillDataEvenly(billFormData.amount ?? 0, members, { mode: 'pct', sharedPct });
  };

  const onClickPm = () => {
    setTab('pm');
    saveBillDataEvenly(billFormData.amount ?? 0, members, { mode: 'pm' });
  };

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <Navbar
            onCancel={() => {
              dispatch(setTxState('main'));
              dispatch(saveBillFormData({ latter: initialLatter }));
            }}
          />
          <div className="flex gap-[10px] mb-[15px]">
            <div
              className={classNames(
                'h-[30px] w-full rounded-[4px] flex justify-center items-center cursor-pointer',
                {
                  'bg-tan-300': tab === 'weight',
                  'bg-grey-200': tab !== 'weight',
                },
              )}
              onClick={onClickWeight}
            >
              <img src={tab === 'weight' ? IcWeight : IcWeightInactive} />
            </div>
            <div
              className={classNames(
                'h-[30px] w-full rounded-[4px] flex justify-center items-center cursor-pointer',
                {
                  'bg-tan-300': tab === 'pct',
                  'bg-grey-200': tab !== 'pct',
                },
              )}
              onClick={onClickPct}
            >
              <img src={tab === 'pct' ? IcPct : IcPctInactive} />
            </div>
            <div
              className={classNames(
                'h-[30px] w-full rounded-[4px] flex justify-center items-center cursor-pointer',
                {
                  'bg-tan-300': tab === 'pm',
                  'bg-grey-200': tab !== 'pm',
                },
              )}
              onClick={onClickPm}
            >
              <img src={tab === 'pm' ? IcPm : IcPmInactive} />
            </div>
          </div>
          {tab === 'weight' && <Weight />}
          {tab === 'pct' && <Percentage />}
          {tab === 'pm' && <PlusMinus />}
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

export default BillLatter;
