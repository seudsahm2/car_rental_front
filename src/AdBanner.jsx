import { useEffect, useRef } from 'react';

const AdBanner = ({ shouldRender = true }) => {
  const adRef = useRef(null);
  const isPushed = useRef(false);

  useEffect(() => {
    if (shouldRender && !isPushed.current && window.adsbygoogle && adRef.current) {
      try {
        window.adsbygoogle.push({});
        isPushed.current = true;
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <ins
      className="adsbygoogle"
      ref={adRef}
      style={{ display: 'block', margin: 'auto' }}
      data-ad-client="ca-pub-5061735490844182"
      data-ad-slot="9765584423"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdBanner;