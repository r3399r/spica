import { useTranslation } from 'react-i18next';
import H4 from 'src//component/typography/H4';
import Body from 'src/component/typography/Body';
import PicStep1 from 'src/image/pic-android-step-1.svg';
import PicStep2 from 'src/image/pic-android-step-2.svg';

const StepAndroid = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-10">
      <H4 className="mb-[5px] text-center">1</H4>
      <Body className="mb-[10px] text-center" size="l">
        {t('add2HomeScreen.androidStep1')}
      </Body>
      <img src={PicStep1} className="mx-auto" />
      <H4 className="mb-[5px] mt-[30px] text-center">2</H4>
      <Body className="mb-[10px] text-center" size="l">
        {t('add2HomeScreen.androidStep2')}
      </Body>
      <img src={PicStep2} className="mx-auto" />
      <H4 className="mb-[5px] mt-[30px] text-center">3</H4>
      <Body className="mb-10 text-center" size="l">
        {t('add2HomeScreen.androidStep3')}
      </Body>
      <Body className="text-center" size="l">
        {t('add2HomeScreen.done')}
      </Body>
    </div>
  );
};

export default StepAndroid;
