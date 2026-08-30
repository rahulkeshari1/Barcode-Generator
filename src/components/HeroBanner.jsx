import { useNavigate } from "react-router-dom";
import heroImage from "/hero.png";

export default function HeroBanner() {
  const navigate =
    useNavigate();

  return (
    <section className="hero-banner-clickable">

      <img
        src={heroImage}
        alt="Image To QR"
        className="hero-image"
      />

      <div className="hero-overlay">

        <button
          className="hero-overlay-btn"
          onClick={() =>
            navigate(
              "/image-to-qr"
            )
          }
        >
          🚀 Start Converting
        </button>

      </div>

    </section>
  );
}