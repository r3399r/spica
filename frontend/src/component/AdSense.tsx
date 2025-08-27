import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import IcArrowDouble from 'src/image/ic-arrow-double.svg';
import Body from './typography/Body';

type Props = {
  onClick: () => void;
};

const AdSense = ({ onClick }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window === 'object')
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
  }, []);

  return (
    <div>
      <ins
        className="adsbygoogle block text-center data-[ad-status=unfilled]:!hidden"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-3051999847338334"
        data-ad-slot="3934962923"
      />
      <div className="mt-1 flex justify-center">
        <Body
          bold
          className="flex w-[300px] cursor-pointer items-center justify-center bg-beige-300 py-2"
          onClick={onClick}
        >
          {t('adsense.remove')}
          <img src={IcArrowDouble} />
        </Body>
      </div>
    </div>
  );
};

export default AdSense;
