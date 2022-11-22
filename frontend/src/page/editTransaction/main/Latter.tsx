import { ShareDetail, ShareMethod } from '@y-celestial/spica-service';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/component/celestial-ui/typography/Body';
import IcEdit from 'src/image/ic-edit-tx.svg';
import { saveBillFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import { setTxState } from 'src/redux/uiSlice';
import { calculateAmount } from 'src/service/transactionService';
import { bn } from 'src/util/bignumber';

const Latter = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    book: { books },
    form: { billFormData },
  } = useSelector((rootState: RootState) => rootState);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const members = useMemo(() => books?.find((v) => v.id === id)?.members, [books]);
  const isAllShare =
    billFormData.latter?.length ===
    billFormData.latter?.filter((v) => v.method === ShareMethod.Weight && v.value === 1).length;

  const latter: ShareDetail[] = useMemo(() => {
    if (billFormData.latter && !isAllShare) return billFormData.latter;
    if (!members) return [];

    return calculateAmount(
      billFormData.amount ?? 0,
      members.map((v) => ({
        id: v.id,
        method: ShareMethod.Weight,
        value: 1,
      })),
    );
  }, [members, billFormData.amount]);

  useEffect(() => {
    if (!members) return;
    dispatch(saveBillFormData({ latter }));
  }, [latter]);

  return (
    <>
      <Body className="mb-[5px] text-navy-700">{t('desc.sharer')}</Body>
      <div className="flex justify-between gap-[10px]">
        <div className="flex-1 flex flex-col gap-[5px]">
          {isAllShare && (
            <div className="ml-[10px] flex justify-between flex-1">
              <Body size="l">{t('editTx.allShare')}</Body>
            </div>
          )}
          {!isAllShare &&
            latter.map((v) => (
              <div key={v.id} className="ml-[10px] flex justify-between">
                <Body size="l">{members?.find((o) => o.id === v.id)?.nickname}</Body>
                <Body size="l" className="text-navy-300">
                  {`${book?.symbol}${bn(v.amount).abs().toFormat()}`}
                </Body>
              </div>
            ))}
        </div>
        <div>
          <img
            src={IcEdit}
            className="cursor-pointer"
            onClick={() => dispatch(setTxState('latter'))}
          />
        </div>
      </div>
    </>
  );
};

export default Latter;