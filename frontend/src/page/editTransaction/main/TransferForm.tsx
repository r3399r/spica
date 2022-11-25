import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AmountInput from 'src/component/AmountInput';
import Divider from 'src/component/celestial-ui/Divider';
import Textarea from 'src/component/celestial-ui/Textarea';
import Body from 'src/component/celestial-ui/typography/Body';
import IcEdit from 'src/image/ic-edit-tx.svg';
import { TransferForm as Form } from 'src/model/Form';
import { saveTransferFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';

const TransferForm = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    book: { books },
    form: { transferFormData },
  } = useSelector((rootState: RootState) => rootState);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);

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
          {transferFormData.srcMemberId}
        </Body>
        <div>
          <img
            src={IcEdit}
            className="cursor-pointer"
            // onClick={() => dispatch(setTxState('former'))}
          />
        </div>
      </div>
      <Divider className="my-[15px]" />
      <Body className="mb-[5px] text-navy-700">{t('desc.receiver')}</Body>
      <div className="flex justify-between gap-[10px]">
        <Body size="l" className="ml-[10px]">
          {transferFormData.dstMemberId}
        </Body>
        <div>
          <img
            src={IcEdit}
            className="cursor-pointer"
            // onClick={() => dispatch(setTxState('former'))}
          />
        </div>
      </div>
      <Divider className="my-[15px]" />
      <Textarea
        label={t('desc.memo')}
        defaultValue={transferFormData.memo}
        onChange={(e) => saveFormData({ memo: e.target.value })}
      />
    </>
  );
};

export default TransferForm;
