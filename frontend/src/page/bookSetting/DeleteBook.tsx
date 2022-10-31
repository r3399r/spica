import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import H4 from 'src/component/celestial-ui/typography/H4';
import IcRemove from 'src/image/ic-remove.svg';
import { RootState } from 'src/redux/store';
import ModalDeleteBook from './ModalDeleteBook';

const DeleteBook = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="pt-5 pb-4 border-b border-b-grey-300 flex justify-between mb-[5px]">
        <H4>{t('bookSetting.deleteBook')}</H4>
        <img src={IcRemove} className="cursor-pointer" onClick={() => setOpen(true)} />
      </div>
      <ModalDeleteBook open={open} handleClose={() => setOpen(false)} book={book} />
    </>
  );
};

export default DeleteBook;
