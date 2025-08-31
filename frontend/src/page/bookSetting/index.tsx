import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarVanilla from 'src/component/NavbarVanilla';
import H2 from 'src/component/typography/H2';
import H4 from 'src/component/typography/H4';
import { Language as Lang } from 'src/constant/Language';
import { Page } from 'src/constant/Page';
import IcGo from 'src/image/ic-go-small.svg';
import { loadBookById } from 'src/service/bookService';
import Currency from './Currency';
import DeleteBook from './DeleteBook';
import RenameBook from './RenameBook';
import ShowDeleted from './ShowDeleted';
import SystemHint from './SystemHint';

const BookSetting = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const href = useMemo(() => Lang.find((v) => v.code === i18n.language)?.form, [i18n.language]);

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
      <a
        target="_blank"
        href={href}
        className="flex justify-between border-b border-b-grey-300 pt-5 pb-4"
        rel="noreferrer"
      >
        <H4>{t('systemSetting.contactUs')}</H4>
        <img src={IcGo} />
      </a>
    </div>
  );
};

export default BookSetting;
