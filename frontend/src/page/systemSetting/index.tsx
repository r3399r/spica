import { useTranslation } from 'react-i18next';
import H2 from 'src/celestial-ui/component/typography/H2';
import NavbarVanilla from 'src/component/NavbarVanilla';
import Language from './Language';

const SystemSetting = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-[640px] mx-[15px] sm:mx-auto">
      <NavbarVanilla text={t('systemSetting.back')} />
      <H2>{t('systemSetting.head')}</H2>
      <Language />
    </div>
  );
};

export default SystemSetting;
