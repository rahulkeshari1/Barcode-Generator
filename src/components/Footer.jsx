import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* =====================================================
            MAIN FOOTER
        ===================================================== */}

        <div className="footer-main">

          {/* BRAND */}

          <div className="footer-brand">

            <Link
              to="/"
              className="footer-logo"
              aria-label="barcodemaker.shop Home"
            >
              <span className="footer-logo-icon">
                ▥
              </span>

              <span className="footer-logo-text">
                barcodemaker.shop
              </span>
            </Link>

            <p className="footer-description">
              Free online tools for creating
              professional QR codes and barcodes
              quickly and easily.
            </p>

            <div className="footer-badges">
              <span>
                ✓ Free to use
              </span>

              <span>
                ✓ No registration
              </span>

              <span>
                ✓ High quality
              </span>
            </div>

          </div>

          {/* TOOLS */}

          <div className="footer-column">

            <h3>
              Tools
            </h3>

            <ul>

              <li>
                <Link to="/barcode-generator">
                  Barcode Generator
                </Link>
              </li>

              <li>
                <Link to="/text-to-qr">
                  Text to QR
                </Link>
              </li>

              <li>
                <Link to="/image-to-qr">
                  Image to QR
                </Link>
              </li>

              <li>
                <Link to="/upi-qr">
                  UPI QR Generator
                </Link>
              </li>

              <li>
                <Link to="/batch-qr">
                  Batch QR Generator
                </Link>
              </li>

            </ul>

          </div>

          {/* BARCODE */}

          <div className="footer-column">

            <h3>
              Barcode
            </h3>

            <ul>

              <li>
                <Link to="/barcode-generator">
                  Code 128
                </Link>
              </li>

              <li>
                <Link to="/barcode-generator">
                  EAN-13
                </Link>
              </li>

              <li>
                <Link to="/barcode-generator">
                  EAN-8
                </Link>
              </li>

              <li>
                <Link to="/barcode-generator">
                  UPC-A
                </Link>
              </li>

              <li>
                <Link to="/barcode-generator">
                  ITF-14
                </Link>
              </li>

            </ul>

          </div>

          {/* COMPANY */}

          <div className="footer-column">

            <h3>
              Company
            </h3>

            <ul>

              <li>
                <Link to="/about">
                  About Us
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link to="/faq">
                  FAQ
                </Link>
              </li>

              <li>
                <Link to="/privacy-policy">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link to="/terms">
                  Terms of Service
                </Link>
              </li>

            </ul>

          </div>

        </div>

        {/* =====================================================
            INFORMATION SECTION
        ===================================================== */}

        <div className="footer-info">

          <div className="footer-info-item">

            <span className="footer-info-icon">
              🔒
            </span>

            <div>
              <strong>
                Your data stays yours
              </strong>

              <span>
                We aim to keep your barcode
                and QR generation simple and secure.
              </span>
            </div>

          </div>

          <div className="footer-info-item">

            <span className="footer-info-icon">
              ⚡
            </span>

            <div>
              <strong>
                Fast generation
              </strong>

              <span>
                Generate high-quality codes
                directly from your browser.
              </span>
            </div>

          </div>

          <div className="footer-info-item">

            <span className="footer-info-icon">
              📱
            </span>

            <div>
              <strong>
                Works across devices
              </strong>

              <span>
                Designed for desktop, tablet
                and mobile screens.
              </span>
            </div>

          </div>

        </div>

        {/* =====================================================
            BOTTOM
        ===================================================== */}

        <div className="footer-bottom">

          <p>
            © {currentYear} barcodemaker.shop.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">

            <Link to="/privacy-policy">
              Privacy
            </Link>

            <span>
              •
            </span>

            <Link to="/terms">
              Terms
            </Link>

            <span>
              •
            </span>

            <Link to="/contact">
              Contact
            </Link>

          </div>

          <p className="footer-made">
            Built for simple,
            useful web tools.
          </p>

        </div>

      </div>
    </footer>
  );
}