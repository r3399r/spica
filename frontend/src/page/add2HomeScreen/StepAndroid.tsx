import { useTranslation } from 'react-i18next';
import Body from 'src/celestial-ui/component/typography/Body';
import H4 from 'src/celestial-ui/component/typography/H4';
import PicStep1 from 'src/image/pic-android-step-1.svg';
import PicStep2 from 'src/image/pic-android-step-2.svg';

const StepAndroid = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-10">
      <H4 className="text-center mb-[5px]">1</H4>
      <Body className="text-center mb-[10px]" size="l">
        {t('add2HomeScreen.androidStep1')}
      </Body>
      <img src={PicStep1} className="mx-auto" />
      <H4 className="text-center mt-[30px] mb-[5px]">2</H4>
      <Body className="text-center mb-[10px]" size="l">
        {t('add2HomeScreen.androidStep2')}
      </Body>
      <img src={PicStep2} className="mx-auto" />
      <H4 className="text-center mt-[30px] mb-[5px]">3</H4>
      <Body className="text-center mb-10" size="l">
        {t('add2HomeScreen.androidStep3')}
      </Body>
      <Body className="text-center" size="l">
        {t('add2HomeScreen.done')}
      </Body>
    </div>
  );
};

export default StepAndroid;
