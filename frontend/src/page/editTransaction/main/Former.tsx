import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Body from 'src/component/typography/Body';
import { BillType } from 'src/constant/backend/Book';
import useBook from 'src/hook/useBook';
import IcEdit from 'src/image/ic-edit-tx.svg';
import { RootState } from 'src/redux/store';
import { setTxState } from 'src/redux/uiSlice';
import { bn } from 'src/util/bignumber';

const Former = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { billFormData } = useSelector((rootState: RootState) => rootState.form);
  const book = useBook();
  const members = useMemo(() => book?.members, [book]);
  const isAll = billFormData.former?.length === 1;
  const former = useMemo(() => billFormData.former ?? [], [billFormData.former]);
  const symbol = useMemo(
    () => book?.currencies?.find((v) => v.id === billFormData.currencyId)?.symbol,
    [book, billFormData],
  );

  return (
    <>
      <Body className="mb-[5px] text-navy-700">
        {billFormData.type === BillType.Out ? t('desc.payer') : t('desc.receiver')}
      </Body>
      <div
        className="flex cursor-pointer justify-between gap-[10px]"
        onClick={() => dispatch(setTxState('former'))}
      >
        <div className="flex flex-1 flex-col gap-[5px]">
          {isAll && (
            <div className="ml-[10px] flex justify-between">
              <Body size="l">{members?.find((v) => v.id === former[0].id)?.nickname}</Body>
              <Body size="l" className="text-navy-300">
                {t('editTx.all')}
              </Body>
            </div>
          )}
          {!isAll &&
            members
              ?.filter((v) => former.map((o) => o.id).includes(v.id))
              .map((v) => (
                <div key={v.id} className="ml-[10px] flex justify-between">
                  <Body size="l">{v.nickname}</Body>
                  <Body size="l" className="text-navy-300">
                    {`${symbol}${bn(former.find((o) => o.id === v.id)?.amount ?? 0)
                      .abs()
                      .toFormat()}`}
                  </Body>
                </div>
              ))}
        </div>
        <div>
          <img src={IcEdit} />
        </div>
      </div>
    </>
  );
};

export default Former;
