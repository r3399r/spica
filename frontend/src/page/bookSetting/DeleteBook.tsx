import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import H4 from 'src/celestial-ui/component/typography/H4';
import IcRemove from 'src/image/ic-remove.svg';
import ModalDeleteBook from './ModalDeleteBook';

const DeleteBook = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="pt-5 pb-4 border-b border-b-grey-300 flex justify-between mb-[5px]">
        <H4>{t('bookSetting.deleteBook')}</H4>
        <img src={IcRemove} className="cursor-pointer" onClick={() => setOpen(true)} />
      </div>
      <ModalDeleteBook open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default DeleteBook;
