import { useMemo } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard-ts';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
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
import { setSnackbarMessage } from 'src/redux/uiSlice';
import { getDeviceId } from 'src/service/systemSettingService';
import Language from './Language';

const SystemSetting = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDeviceReady } = useSelector((rootState: RootState) => rootState.ui);
  const href = useMemo(() => Lang.find((v) => v.code === i18n.language)?.form, [i18n.language]);
  const deviceId = useMemo(() => {
    if (!isDeviceReady) return '';

    return getDeviceId();
  }, [isDeviceReady]);

  return (
    <div className="mx-[15px] max-w-[640px] sm:mx-auto">
      <NavbarVanilla text={t('systemSetting.back')} />
      <H2>{t('systemSetting.head')}</H2>
      <Language />
      <CopyToClipboard text={deviceId} onCopy={() => dispatch(setSnackbarMessage(t('desc.copy')))}>
        <div className="cursor-pointer border-b border-b-grey-300 pb-4 pt-5">
          <div className="mb-[5px] flex justify-between">
            <H4>{t('systemSetting.myId')}</H4>
            <Img src={IcCopy} srcActive={IcCopyActive} />
          </div>
          <Body size="l" className="break-all text-navy-300">
            {deviceId}
          </Body>
        </div>
      </CopyToClipboard>
      <div
        className="flex cursor-pointer justify-between border-b border-b-grey-300 pb-4 pt-5"
        onClick={() => navigate(`${Page.Setting}/payment`)}
      >
        <H4>{t('systemSetting.myPaymentAccount')}</H4>
        <img src={IcGo} />
      </div>
      <div
        className="flex cursor-pointer justify-between border-b border-b-grey-300 pb-4 pt-5"
        onClick={() => navigate(`${Page.Setting}/sync`)}
      >
        <H4>{t('systemSetting.dataSync')}</H4>
        <img src={IcGo} />
      </div>
      <div
        className="flex cursor-pointer justify-between border-b border-b-grey-300 pb-4 pt-5"
        onClick={() => navigate(`${Page.Setting}/a2hs`)}
      >
        <H4>{t('systemSetting.add2HomeScreen')}</H4>
        <img src={IcGo} />
      </div>
      <a
        target="_blank"
        href={href}
        className="flex justify-between border-b border-b-grey-300 pb-4 pt-5"
        rel="noreferrer"
      >
        <H4>{t('systemSetting.contactUs')}</H4>
        <img src={IcGo} />
      </a>
    </div>
  );
};

export default SystemSetting;
