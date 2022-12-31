import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import H2 from 'src/celestial-ui/component/typography/H2';
import H4 from 'src/celestial-ui/component/typography/H4';
import NavbarVanilla from 'src/component/NavbarVanilla';
import { Language as Lang } from 'src/constant/Language';
import { Page } from 'src/constant/Page';
import IcGo from 'src/image/ic-go-small.svg';
import Language from './Language';

const SystemSetting = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const href = useMemo(() => Lang.find((v) => v.code === i18n.language)?.form, [i18n.language]);

  return (
    <div className="max-w-[640px] mx-[15px] sm:mx-auto">
      <NavbarVanilla text={t('systemSetting.back')} />
      <H2>{t('systemSetting.head')}</H2>
      <Language />
      <div
        className="pt-5 pb-4 border-b border-b-grey-300 flex justify-between mb-[5px] cursor-pointer"
        onClick={() => navigate(`${Page.Setting}/a2hs`)}
      >
        <H4>{t('systemSetting.add2HomeScreen')}</H4>
        <img src={IcGo} />
      </div>
      <a
        target="_blank"
        href={href}
        className="pt-5 pb-4 border-b border-b-grey-300 flex justify-between mb-[5px]"
        rel="noreferrer"
      >
        <H4>{t('systemSetting.contactUs')}</H4>
        <img src={IcGo} />
      </a>
    </div>
  );
};

export default SystemSetting;
