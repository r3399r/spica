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
      data-ad-format="fluid"
      data-ad-layout-key="-fg+5r+5f-cv+3r"
      data-ad-client="ca-pub-4116238563422892"
      data-ad-slot="2305807594"
    />
  );
};

export default AdSense;
