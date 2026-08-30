import { useEffect, useRef } from "react";

const ADSENSE_CLIENT =
  "ca-pub-5692257629755909";

const AdSense = ({
  adSlot,
  format = "auto",
  fullWidthResponsive = true,
}) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;

    try {
      if (
        !adRef.current.getAttribute(
          "data-adsbygoogle-status"
        )
      ) {
        (window.adsbygoogle =
          window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error(
        "AdSense error:",
        error
      );
    }
  }, []);

  return (
    <div className="adsense-wrapper">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: "90px",
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={
          fullWidthResponsive
            ? "true"
            : "false"
        }
      />
    </div>
  );
};

export default AdSense;