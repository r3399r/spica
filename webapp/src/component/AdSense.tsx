import { useEffect } from 'react';

const AdSense = () => {
  useEffect(() => {
    if (typeof window === 'object')
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle block text-center data-[ad-status=unfilled]:!hidden"
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client="ca-pub-3051999847338334"
      data-ad-slot="3934962923"
    />
  );
};

export default AdSense;
