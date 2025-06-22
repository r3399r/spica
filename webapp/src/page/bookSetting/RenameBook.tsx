import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Img from 'src/component/Img';
import Body from 'src/component/typography/Body';
import H4 from 'src/component/typography/H4';
import useBook from 'src/hook/useBook';
import IcEditActive from 'src/image/ic-edit-active.svg';
import IcEdit from 'src/image/ic-edit.svg';
import ModalRenameBook from './ModalRenameBook';

const RenameBook = () => {
  const { t } = useTranslation();
  const book = useBook();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className="cursor-pointer border-b border-b-grey-300 pt-5 pb-4"
        onClick={() => setOpen(true)}
      >
        <div className="mb-[5px] flex justify-between">
          <H4>{t('bookSetting.bookName')}</H4>
          <Img src={IcEdit} srcActive={IcEditActive} />
        </div>
        <Body size="l" className="min-h-[24px] text-navy-300">
          {book?.name}
        </Body>
      </div>
      <ModalRenameBook open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default RenameBook;
