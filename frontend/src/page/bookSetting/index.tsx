import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarVanilla from 'src/component/NavbarVanilla';
import H2 from 'src/component/typography/H2';
import { Page } from 'src/constant/Page';
import { loadBookById } from 'src/service/bookService';
import Currency from './Currency';
import DeleteBook from './DeleteBook';
import RenameBook from './RenameBook';
import ShowDeleted from './ShowDeleted';
import SystemHint from './SystemHint';

const BookSetting = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id]);

  return (
    <div className="mx-[15px] max-w-[640px] sm:mx-auto">
      <NavbarVanilla text={t('bookSetting.back')} />
      <H2>{t('bookSetting.head')}</H2>
      <RenameBook />
      <Currency />
      <DeleteBook />
      <ShowDeleted />
      <SystemHint />
    </div>
  );
};

export default BookSetting;
