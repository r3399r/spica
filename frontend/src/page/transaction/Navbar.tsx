import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from 'src/component/BackButton';
import Body from 'src/component/celestial-ui/typography/Body';
import { Page } from 'src/constant/Page';
import IcEdit from 'src/image/ic-edit.svg';
import IcRemove from 'src/image/ic-remove.svg';
import { saveBillFormData, saveTransferFormData, setTxFormType } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import { bn } from 'src/util/bignumber';
import ModalDelete from './ModalDelete';

const Navbar = () => {
  const { id, tid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const [open, setOpen] = useState<boolean>(false);
  const tx = useMemo(
    () => books?.find((v) => v.id === id)?.transactions?.find((v) => v.id === tid),
    [id, tid, books],
  );

  const onEdit = () => {
    if (!tx) return;
    if (tx.type === 'in' || tx.type === 'out')
      dispatch(
        saveBillFormData({
          date: tx.date,
          type: tx.type,
          descr: tx.descr,
          amount: tx.amount,
          former: tx.former.map((v) => ({ ...v, amount: bn(v.amount).abs().toNumber() })),
          latter: tx.latter.map((v) => ({ ...v, amount: bn(v.amount).abs().toNumber() })),
          memo: tx.memo ?? undefined,
        }),
      );
    else if (tx.type === 'transfer') {
      dispatch(setTxFormType('transfer'));
      dispatch(
        saveTransferFormData({
          date: tx.date,
          amount: tx.amount,
          srcMemberId: tx.srcMemberId,
          dstMemberId: tx.dstMemberId,
          memo: tx.memo ?? undefined,
        }),
      );
    }
    navigate(`${Page.Book}/${id}/tx`, { state: { txId: tx.id } });
  };

  return (
    <>
      <div className="mt-[15px] mb-5 relative">
        <BackButton text={t('transaction.back')} />
        {tx && (
          <div className="absolute top-0 right-0">
            {tx.dateDeleted === null ? (
              <div className="flex gap-[15px]">
                <img src={IcRemove} onClick={() => setOpen(true)} className="cursor-pointer" />
                <img src={IcEdit} onClick={onEdit} className="cursor-pointer" />
              </div>
            ) : (
              <Body size="s" className="text-white bg-tomato-700 py-1 px-[10px]">
                {t('transaction.deleted')}
              </Body>
            )}
          </div>
        )}
      </div>
      <ModalDelete open={open} handleClose={() => setOpen(false)} tx={tx} />
    </>
  );
};

export default Navbar;
