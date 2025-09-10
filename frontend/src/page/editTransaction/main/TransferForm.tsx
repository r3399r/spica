import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Divider from 'src/component/Divider';
import Textarea from 'src/component/Textarea';
import Body from 'src/component/typography/Body';
import useBook from 'src/hook/useBook';
import IcEdit from 'src/image/ic-edit-tx.svg';
import { TransferForm as Form } from 'src/model/Form';
import { saveTransferFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import { getDeviceId } from 'src/service/transactionService';
import AmountCurrency from './AmountCurrency';
import MemberSelectModal from './MemberSelectModal';

const TransferForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { transferFormData, involvedMemberIds } = useSelector(
    (rootState: RootState) => rootState.form,
  );
  const { isDeviceReady } = useSelector((rootState: RootState) => rootState.ui);
  const book = useBook();
  const members = useMemo(
    () =>
      book?.members?.filter((v) => v.visible === true || new Set(involvedMemberIds).has(v.id)) ??
      [],
    [book, involvedMemberIds],
  );
  const [side, setSide] = useState<'src' | 'dst'>();
  const self = useMemo(() => {
    if (!members || !isDeviceReady) return null;

    return members.find((v) => v.deviceId === getDeviceId())?.id ?? null;
  }, [members, isDeviceReady]);

  useEffect(() => {
    if (self && !transferFormData.srcMemberId)
      dispatch(saveTransferFormData({ srcMemberId: self }));
  }, [self]);

  const saveFormData = (data: Partial<Form>) => {
    dispatch(saveTransferFormData(data));
  };

  return (
    <>
      <AmountCurrency />
      <Body className="mb-[5px] text-navy-700">{t('desc.sender')}</Body>
      <div
        className="flex cursor-pointer justify-between gap-[10px]"
        onClick={() => setSide('src')}
      >
        <Body size="l" className="ml-[10px]">
          {members.find((v) => v.id === transferFormData.srcMemberId)?.nickname}
        </Body>
        <div>
          <img src={IcEdit} />
        </div>
      </div>
      <Divider className="my-[15px]" />
      <Body className="mb-[5px] text-navy-700">{t('desc.receiver')}</Body>
      <div
        className="flex cursor-pointer justify-between gap-[10px]"
        onClick={() => setSide('dst')}
      >
        <Body size="l" className="ml-[10px]">
          {members.find((v) => v.id === transferFormData.dstMemberId)?.nickname}
        </Body>
        <div>
          <img src={IcEdit} />
        </div>
      </div>
      <Divider className="my-[15px]" />
      <Textarea
        label={t('desc.memo')}
        defaultValue={transferFormData.memo}
        onChange={(e) => saveFormData({ memo: e.target.value })}
      />
      <MemberSelectModal
        open={side !== undefined}
        onClose={() => setSide(undefined)}
        members={members}
        side={side}
      />
    </>
  );
};

export default TransferForm;
