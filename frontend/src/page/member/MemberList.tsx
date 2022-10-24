import { useTranslation } from 'react-i18next';
import Body from 'src/component/celestial-ui/typography/Body';

const MemberList = () => {
  const { t } = useTranslation();

  return <Body className="text-navy-300 py-[30px] text-center">{t('member.noMemberHint')}</Body>;
};

export default MemberList;
