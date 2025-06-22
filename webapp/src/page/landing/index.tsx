import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Body from 'src/component/typography/Body';
import H1 from 'src/component/typography/H1';
import H4 from 'src/component/typography/H4';
import H5 from 'src/component/typography/H5';
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
      <H1 className="mb-[10px] mt-10 text-center font-[900] text-teal-500">{t('landing.title')}</H1>
      <H4 className="text-center text-teal-500">{t('landing.subtitle')}</H4>
      <div className="mt-5">
        <img src={PicHero} className="mx-auto w-[calc(100%-30px)] sm:w-[640px]" />
      </div>
      <div className="mb-10 mt-5 flex justify-center sm:mb-11">
        <Button className="h-12 w-64 text-base" onClick={() => navigate(Page.Book)}>
          {t('landing.start')}
        </Button>
      </div>
      <div className="sm:flex">
        <div className="bg-teal-300 px-4 py-[30px] sm:w-1/3">
          <img src={PicFeatureLogin} className="mx-auto" />
          <H5 className="text-center text-navy-500">{t('landing.featureLogin')}</H5>
        </div>
        <div className="bg-beige-300 px-4 py-[30px] sm:w-1/3">
          <img src={PicFeaturePwa} className="mx-auto" />
          <H5 className="text-center text-navy-500">{t('landing.featurePwa')}</H5>
        </div>
        <div className="bg-grey-200 px-4 py-[30px] sm:w-1/3">
          <img src={PicFeatureEasy} className="mx-auto" />
          <H5 className="text-center text-navy-500">{t('landing.featureEasy')}</H5>
        </div>
      </div>
      <Body
        size="s"
        className="my-5 text-center text-navy-300"
      >{`© Celetial Studio 2022 - ${new Date().getFullYear()}`}</Body>
    </>
  );
};

export default Landing;
