import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from 'src/component/BackButton';
import Img from 'src/component/Img';
import Body from 'src/component/typography/Body';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import IcEditActive from 'src/image/ic-edit-active.svg';
import IcEdit from 'src/image/ic-edit.svg';
import IcRemoveActive from 'src/image/ic-remove-active.svg';
import IcRemove from 'src/image/ic-remove.svg';
import { saveBillFormData, saveTransferFormData, setTxFormType } from 'src/redux/formSlice';
import { bn } from 'src/util/bignumber';
import ModalDelete from './ModalDelete';

const Navbar = () => {
  const { id, tid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const book = useBook();
  const [open, setOpen] = useState<boolean>(false);
  const tx = useMemo(() => book?.transactions?.find((v) => v.id === tid), [tid, book]);

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
          currencyId: tx.currencyId,
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
          currencyId: tx.currencyId,
        }),
      );
    }
    navigate(`${Page.Book}/${id}/tx`, { state: { txId: tx.id } });
  };

  return (
    <>
      <div className="relative mt-[15px] mb-5">
        <BackButton text={t('transaction.back')} />
        {tx && (
          <div className="absolute top-0 right-0">
            {tx.dateDeleted === null ? (
              <div className="flex gap-[15px]">
                <Img
                  src={IcRemove}
                  srcActive={IcRemoveActive}
                  onClick={() => setOpen(true)}
                  className="cursor-pointer"
                />
                <Img
                  src={IcEdit}
                  srcActive={IcEditActive}
                  onClick={onEdit}
                  className="cursor-pointer"
                />
              </div>
            ) : (
              <Body size="s" className="bg-tomato-700 px-[10px] py-1 text-white">
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
