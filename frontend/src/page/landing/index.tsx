import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from 'src/celestial-ui/component/Button';
import Body from 'src/celestial-ui/component/typography/Body';
import H1 from 'src/celestial-ui/component/typography/H1';
import H4 from 'src/celestial-ui/component/typography/H4';
import H5 from 'src/celestial-ui/component/typography/H5';
import { Page } from 'src/constant/Page';
import PicFeatureEasy from 'src/image/pic-feature-easy.svg';
import PicFeatureLogin from 'src/image/pic-feature-login.svg';
import PicFeaturePwa from 'src/image/pic-feature-pwa.svg';
import PicHero from 'src/image/pic-landing-hero.svg';

const Landing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <H1 className="text-teal-500 font-[900] text-center mt-10 mb-[10px]">{t('landing.title')}</H1>
      <H4 className="text-teal-500 text-center">{t('landing.subtitle')}</H4>
      <div className="mt-5">
        <img src={PicHero} className="mx-auto w-[calc(100%-30px)] sm:w-[640px]" />
      </div>
      <div className="mt-5 mb-10 sm:mb-11 flex justify-center">
        <Button className="w-64 h-12 text-base" onClick={() => navigate(Page.Book)}>
          20230117
        </Button>
      </div>
      <div className="sm:flex">
        <div className="bg-teal-300 py-[30px] px-4 sm:w-1/3">
          <img src={PicFeatureLogin} className="mx-auto" />
          <H5 className="text-navy-500 text-center">{t('landing.featureLogin')}</H5>
        </div>
        <div className="bg-beige-300 py-[30px] px-4 sm:w-1/3">
          <img src={PicFeaturePwa} className="mx-auto" />
          <H5 className="text-navy-500 text-center">{t('landing.featurePwa')}</H5>
        </div>
        <div className="bg-grey-200 py-[30px] px-4 sm:w-1/3">
          <img src={PicFeatureEasy} className="mx-auto" />
          <H5 className="text-navy-500 text-center">{t('landing.featureEasy')}</H5>
        </div>
      </div>
      <Body
        size="s"
        className="my-5 text-navy-300 text-center"
      >{`© Celetial Studio 2022 - ${new Date().getFullYear()}`}</Body>
    </>
  );
};

export default Landing;
