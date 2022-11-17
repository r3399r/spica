import { BillType, ShareMethod } from '@y-celestial/spica-service';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/component/celestial-ui/typography/Body';
import IcEdit from 'src/image/ic-edit-tx.svg';
import { saveBillFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import { calculateAmount } from 'src/service/transactionService';
import { randomPick } from 'src/util/random';

const Former = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    book: { books },
    form: { billFormData },
  } = useSelector((rootState: RootState) => rootState);
  const members = useMemo(() => books?.find((v) => v.id === id)?.members, [books]);
  const former = useMemo(() => (members ? randomPick(members) : null), [members]);

  useEffect(() => {
    if (!members || !former || !billFormData.amount) return;
    dispatch(
      saveBillFormData({
        former: [{ id: former.id, method: ShareMethod.Amount, amount: billFormData.amount }],
        latter: calculateAmount(
          billFormData.amount,
          members.map((v) => ({ id: v.id, method: ShareMethod.Weight, value: 1 })),
        ),
      }),
    );
  }, [members, former, billFormData.amount]);

  if (!former) return <></>;

  return (
    <>
      <Body className="mb-[5px] text-navy-700">
        {billFormData.type === BillType.Out ? t('desc.payer') : t('desc.receiver')}
      </Body>
      <div className="flex justify-between gap-[10px]">
        <div className="ml-[10px] flex justify-between flex-1">
          <Body size="l">{former.nickname}</Body>
          <Body size="l" className="text-navy-300">
            {t('editTx.all')}
          </Body>
        </div>
        <div>
          <img src={IcEdit} className="cursor-pointer" />
        </div>
      </div>
    </>
  );
};

export default Former;
