import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Divider from 'src/celestial-ui/component/Divider';
import Textarea from 'src/celestial-ui/component/Textarea';
import Body from 'src/celestial-ui/component/typography/Body';
import AmountInput from 'src/component/AmountInput';
import useBook from 'src/hook/useBook';
import IcEdit from 'src/image/ic-edit-tx.svg';
import { TransferForm as Form } from 'src/model/Form';
import { saveTransferFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import MemberSelectModal from './MemberSelectModal';

const TransferForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { transferFormData } = useSelector((rootState: RootState) => rootState.form);
  const book = useBook();
  const members = useMemo(() => book?.members ?? [], [book]);
  const [side, setSide] = useState<'src' | 'dst'>();

  const saveFormData = (data: Partial<Form>) => {
    dispatch(saveTransferFormData(data));
  };

  return (
    <>
      <div className="pb-4">
        <AmountInput
          symbol={book?.symbol ?? '$'}
          decimal={2}
          label={t('editTx.amount')}
          defaultValue={transferFormData.amount}
          onChange={(e) => saveFormData({ amount: Number(e.target.value) })}
        />
      </div>
      <Body className="mb-[5px] text-navy-700">{t('desc.sender')}</Body>
      <div className="flex justify-between gap-[10px]">
        <Body size="l" className="ml-[10px]">
          {members.find((v) => v.id === transferFormData.srcMemberId)?.nickname}
        </Body>
        <div>
          <img src={IcEdit} className="cursor-pointer" onClick={() => setSide('src')} />
        </div>
      </div>
      <Divider className="my-[15px]" />
      <Body className="mb-[5px] text-navy-700">{t('desc.receiver')}</Body>
      <div className="flex justify-between gap-[10px]">
        <Body size="l" className="ml-[10px]">
          {members.find((v) => v.id === transferFormData.dstMemberId)?.nickname}
        </Body>
        <div>
          <img src={IcEdit} className="cursor-pointer" onClick={() => setSide('dst')} />
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
