import { useEffect, useRef } from 'react';

const AdBanner = () => {
  const adRef = useRef(null);
  const isPushed = useRef(false);

  useEffect(() => {
    if (!isPushed.current && window.adsbygoogle && adRef.current) {
      try {
        window.adsbygoogle.push({});
        isPushed.current = true;
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      ref={adRef}
      style={{ display: 'block' }}
      data-ad-client="ca-pub-5061735490844182"
      data-ad-slot="9765584423"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdBanner;