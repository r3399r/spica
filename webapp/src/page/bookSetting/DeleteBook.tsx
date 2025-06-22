import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Img from 'src/component/Img';
import H4 from 'src/component/typography/H4';
import IcRemoveActive from 'src/image/ic-remove-active.svg';
import IcRemove from 'src/image/ic-remove.svg';
import ModalDeleteBook from './ModalDeleteBook';

const DeleteBook = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="mb-[5px] flex justify-between border-b border-b-grey-300 pt-5 pb-4">
        <H4>{t('bookSetting.deleteBook')}</H4>
        <Img
          src={IcRemove}
          srcActive={IcRemoveActive}
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </div>
      <ModalDeleteBook open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default DeleteBook;
