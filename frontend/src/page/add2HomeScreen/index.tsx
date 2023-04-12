import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NavbarVanilla from 'src/component/NavbarVanilla';
import Body from 'src/component/typography/Body';
import StepAndroid from './StepAndroid';
import StepIos from './StepIos';

const Add2HomeScreen = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'ios' | 'android'>('ios');

  useEffect(() => {
    if (navigator.userAgent.toLowerCase().includes('android')) setTab('android');
  }, []);

  return (
    <div className="max-w-[640px] mx-[15px] sm:mx-auto">
      <NavbarVanilla text={t('add2HomeScreen.back')} />
      <div className="flex gap-[10px]">
        <div
          className={classNames(
            'h-[30px] w-full rounded-[4px] flex justify-center items-center cursor-pointer',
            {
              'bg-tan-300': tab === 'ios',
              'bg-grey-200': tab !== 'ios',
            },
          )}
          onClick={() => setTab('ios')}
        >
          <Body bold>iOS</Body>
        </div>
        <div
          className={classNames(
            'h-[30px] w-full rounded-[4px] flex justify-center items-center cursor-pointer',
            {
              'bg-tan-300': tab === 'android',
              'bg-grey-200': tab !== 'android',
            },
          )}
          onClick={() => setTab('android')}
        >
          <Body bold>Android</Body>
        </div>
      </div>
      {tab === 'ios' && <StepIos />}
      {tab === 'android' && <StepAndroid />}
    </div>
  );
};

export default Add2HomeScreen;
