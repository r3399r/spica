import { BillType } from '@y-celestial/spica-service';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/component/celestial-ui/typography/Body';
import IcEdit from 'src/image/ic-edit-tx.svg';
import { RootState } from 'src/redux/store';
import { setTxState } from 'src/redux/uiSlice';
import { bn } from 'src/util/bignumber';

const Former = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    book: { books },
    form: { billFormData },
  } = useSelector((rootState: RootState) => rootState);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const members = useMemo(() => books?.find((v) => v.id === id)?.members, [id, books]);
  const isAll = billFormData.former?.length === 1;
  const former = useMemo(() => billFormData.former ?? [], [billFormData.former]);

  return (
    <>
      <Body className="mb-[5px] text-navy-700">
        {billFormData.type === BillType.Out ? t('desc.payer') : t('desc.receiver')}
      </Body>
      <div className="flex justify-between gap-[10px]">
        <div className="flex-1 flex flex-col gap-[5px]">
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
                    {`${book?.symbol}${bn(former.find((o) => o.id === v.id)?.amount ?? 0)
                      .abs()
                      .toFormat()}`}
                  </Body>
                </div>
              ))}
        </div>
        <div>
          <img
            src={IcEdit}
            className="cursor-pointer"
            onClick={() => dispatch(setTxState('former'))}
          />
        </div>
      </div>
    </>
  );
};

export default Former;
