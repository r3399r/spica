import { useEffect } from 'react';

const AdSense = () => {
  useEffect(() => {
    if (typeof window === 'object')
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-3051999847338334"
      data-ad-slot="2157422371"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdSense;
