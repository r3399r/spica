import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import H2 from 'src/component/celestial-ui/typography/H2';
import { loadBookById } from 'src/service/bookService';
import MemberList from './MemberList';
import Navbar from './Navbar';
import NewMemberForm from './NewMemberForm';
import Share from './Share';

const Member = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id);
  }, [id]);

  return (
    <div className="max-w-[640px] mx-[15px] sm:mx-auto">
      <Navbar />
      <H2>{t('member.head')}</H2>
      <NewMemberForm />
      <MemberList />
      <Share />
    </div>
  );
};

export default Member;
