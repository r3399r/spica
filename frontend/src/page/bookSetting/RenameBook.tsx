import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/celestial-ui/component/typography/Body';
import H4 from 'src/celestial-ui/component/typography/H4';
import IcEdit from 'src/image/ic-edit.svg';
import { RootState } from 'src/redux/store';
import ModalRenameBook from './ModalRenameBook';

const RenameBook = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="pt-5 pb-4 border-b border-b-grey-300">
        <div className="flex justify-between mb-[5px]">
          <H4>{t('bookSetting.bookName')}</H4>
          <img src={IcEdit} className="cursor-pointer" onClick={() => setOpen(true)} />
        </div>
        <Body size="l" className="text-navy-300 min-h-[24px]">
          {book?.name}
        </Body>
      </div>
      <ModalRenameBook open={open} handleClose={() => setOpen(false)} book={book} />
    </>
  );
};

export default RenameBook;
