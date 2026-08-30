import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import './Privacy.css'
export default function PrivacyPolicy() {
  return (
    <div className="info-page">

      <header className="info-page-header">
        <div className="info-container">

          <Link
            to="/"
            className="info-back-link"
          >
            ← Back to Home
          </Link>

          <div className="info-header-content">

            <div className="info-page-icon">
              🔒
            </div>

            <div>
              <h1>
                Privacy Policy
              </h1>

              <p>
                How barcodemaker.shop handles
                information and website usage.
              </p>
            </div>

          </div>

        </div>
      </header>

      <main className="info-page-content">

        <div className="info-container">

          <section className="info-section">

            <span className="info-label">
              PRIVACY POLICY
            </span>

            <h2>
              Your privacy is important to us
            </h2>

            <p>
              This Privacy Policy explains how
              barcodemaker.shop handles information when
              you visit and use our website and
              online QR code and barcode tools.
            </p>

            <p>
              By using barcodemaker.shop, you acknowledge
              the practices described in this
              Privacy Policy.
            </p>

          </section>


          <section className="info-section">

            <span className="info-label">
              INFORMATION WE MAY COLLECT
            </span>

            <h2>
              Information and website usage
            </h2>

            <p>
              Some information may be collected
              automatically when you access the
              website. This may include information
              such as browser type, device
              information, approximate location,
              pages visited, referring pages and
              general usage information.
            </p>

            <p>
              This information may be used to
              understand website performance,
              improve our tools and maintain the
              security and reliability of the
              website.
            </p>

          </section>


          <section className="info-section">

            <span className="info-label">
              QR CODES AND BARCODES
            </span>

            <h2>
              Information you enter into our tools
            </h2>

            <p>
              Our website provides tools for
              generating QR codes and barcodes.
              Information entered into these tools
              may be processed by the browser or
              services required to provide the
              requested functionality.
            </p>

            <p>
              You should avoid entering sensitive,
              confidential or highly personal
              information into online tools unless
              you understand how that information
              will be processed.
            </p>

          </section>


          <section className="info-section">

            <span className="info-label">
              COOKIES
            </span>

            <h2>
              Cookies and similar technologies
            </h2>

            <p>
              barcodemaker.shop may use cookies or
              similar technologies for website
              functionality, analytics,
              preferences and advertising.
            </p>

            <p>
              Third-party advertising services,
              including Google AdSense when enabled,
              may use cookies or similar
              technologies to provide and measure
              advertisements.
            </p>

          </section>


          <section className="info-section">

            <span className="info-label">
              ADVERTISING
            </span>

            <h2>
              Google AdSense
            </h2>

            <p>
              We may use Google AdSense to display
              advertisements on the website.
              Google and its partners may use
              cookies or similar technologies to
              provide relevant advertising and
              measure advertising performance.
            </p>

            <p>
              You can learn more about Google's
              advertising practices and available
              controls through Google's own
              resources.
            </p>

          </section>


          <section className="info-section">

            <span className="info-label">
              THIRD-PARTY SERVICES
            </span>

            <h2>
              External services
            </h2>

            <p>
              The website may use third-party
              services for hosting, analytics,
              advertising, content delivery or
              other technical functionality.
            </p>

            <p>
              These services may process
              information according to their own
              privacy policies and terms.
            </p>

          </section>


          <section className="info-section">

            <span className="info-label">
              SECURITY
            </span>

            <h2>
              Protecting information
            </h2>

            <p>
              We take reasonable measures intended
              to maintain the security and
              reliability of the website.
              However, no internet transmission or
              online service can be guaranteed to be
              completely secure.
            </p>

          </section>


          <section className="info-section">

            <span className="info-label">
              CHANGES
            </span>

            <h2>
              Changes to this Privacy Policy
            </h2>

            <p>
              We may update this Privacy Policy
              when our website, tools or services
              change. Any updated version will be
              published on this page.
            </p>

          </section>


          <section className="info-section">

            <span className="info-label">
              CONTACT
            </span>

            <h2>
              Questions about privacy
            </h2>

            <p>
              If you have questions about this
              Privacy Policy or the way the website
              handles information, please contact
              us through our Contact page.
            </p>

            <Link
              to="/contact"
              className="about-cta-primary"
            >
              Contact Us
            </Link>

          </section>

        </div>

      </main>

      <Footer />

    </div>
  );
}