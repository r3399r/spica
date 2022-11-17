import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BackButton from 'src/component/BackButton';
import Body from 'src/component/celestial-ui/typography/Body';
import IcEdit from 'src/image/ic-edit.svg';
import IcRemove from 'src/image/ic-remove.svg';
import { RootState } from 'src/redux/store';
import ModalDelete from './ModalDelete';

const Navbar = () => {
  const { id, tid } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const [open, setOpen] = useState<boolean>(false);
  const tx = useMemo(
    () => books?.find((v) => v.id === id)?.transactions?.find((v) => v.id === tid),
    [id, tid, books],
  );

  return (
    <>
      <div className="mt-[15px] mb-5 relative">
        <BackButton text={t('transaction.back')} />
        <div className="absolute top-0 right-0">
          {tx && tx.dateDeleted === null ? (
            <div className="flex gap-[15px]">
              <img src={IcRemove} onClick={() => setOpen(true)} />
              <img src={IcEdit} />
            </div>
          ) : (
            <Body size="s" className="text-white bg-tomato-700 py-1 px-[10px]">
              {t('transaction.deleted')}
            </Body>
          )}
        </div>
      </div>
      <ModalDelete open={open} handleClose={() => setOpen(false)} tx={tx} />
    </>
  );
};

export default Navbar;
