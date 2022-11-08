import classNames from 'classnames';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import H2 from 'src/component/celestial-ui/typography/H2';
import { loadBookById } from 'src/service/bookService';
import Currency from './Currency';
import DeleteBook from './DeleteBook';
import Navbar from './Navbar';
import RenameBook from './RenameBook';
import ShowDeleted from './ShowDeleted';
import SystemHint from './SystemHint';

const BookSetting = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id);
  }, [id]);

  return (
    <div className={classNames('max-w-[640px] mx-[15px] sm:mx-auto')}>
      <Navbar />
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
