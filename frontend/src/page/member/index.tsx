import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarVanilla from 'src/component/NavbarVanilla';
import H2 from 'src/component/typography/H2';
import { Page } from 'src/constant/Page';
import { loadBookById } from 'src/service/bookService';
import MemberList from './MemberList';
import NewMemberForm from './NewMemberForm';
import Share from './Share';

const Member = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id]);

  return (
    <div className="mx-[15px] max-w-[640px] sm:mx-auto">
      <NavbarVanilla text={t('member.back')} />
      <H2>{t('member.head')}</H2>
      <NewMemberForm />
      <MemberList />
      <Share />
    </div>
  );
};

export default Member;
