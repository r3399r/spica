import { useMemo } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Img from 'src/component/Img';
import NavbarVanilla from 'src/component/NavbarVanilla';
import Body from 'src/component/typography/Body';
import H2 from 'src/component/typography/H2';
import H4 from 'src/component/typography/H4';
import { Language as Lang } from 'src/constant/Language';
import { Page } from 'src/constant/Page';
import IcCopyActive from 'src/image/ic-copy-active.svg';
import IcCopy from 'src/image/ic-copy.svg';
import IcGo from 'src/image/ic-go-small.svg';
import { RootState } from 'src/redux/store';
import { getDeviceId } from 'src/service/systemSettingService';
import Language from './Language';

const SystemSetting = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isDeviceReady } = useSelector((rootState: RootState) => rootState.ui);
  const href = useMemo(() => Lang.find((v) => v.code === i18n.language)?.form, [i18n.language]);
  const deviceId = useMemo(() => {
    if (!isDeviceReady) return '';

    return getDeviceId();
  }, [isDeviceReady]);

  return (
    <div className="max-w-[640px] mx-[15px] sm:mx-auto">
      <NavbarVanilla text={t('systemSetting.back')} />
      <H2>{t('systemSetting.head')}</H2>
      <Language />
      <CopyToClipboard text={deviceId}>
        <div className="pt-5 pb-4 border-b border-b-grey-300 cursor-pointer">
          <div className="flex justify-between mb-[5px]">
            <H4>{t('systemSetting.myId')}</H4>
            <Img src={IcCopy} srcActive={IcCopyActive} />
          </div>
          <Body size="l" className="break-all">
            {deviceId}
          </Body>
        </div>
      </CopyToClipboard>
      <div
        className="pt-5 pb-4 border-b border-b-grey-300 flex justify-between cursor-pointer"
        onClick={() => navigate(`${Page.Setting}/transfer`)}
      >
        <H4>{t('systemSetting.dataTransfer')}</H4>
        <img src={IcGo} />
      </div>
      <div
        className="pt-5 pb-4 border-b border-b-grey-300 flex justify-between cursor-pointer"
        onClick={() => navigate(`${Page.Setting}/a2hs`)}
      >
        <H4>{t('systemSetting.add2HomeScreen')}</H4>
        <img src={IcGo} />
      </div>
      <a
        target="_blank"
        href={href}
        className="pt-5 pb-4 border-b border-b-grey-300 flex justify-between"
        rel="noreferrer"
      >
        <H4>{t('systemSetting.contactUs')}</H4>
        <img src={IcGo} />
      </a>
    </div>
  );
};

export default SystemSetting;
