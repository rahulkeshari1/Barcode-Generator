import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="info-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

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
              ▥
            </div>

            <div>
              <h1>
                About barcodemaker.shop
              </h1>

              <p>
                Simple, fast and useful online
                QR code and barcode tools.
              </p>
            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="info-page-content">

        <div className="info-container">


          {/* =================================================
              INTRODUCTION
          ================================================= */}

          <section className="info-section intro-section">

            <span className="info-label">
              ABOUT US
            </span>

            <h2>
              Making QR codes and barcodes
              easier to create
            </h2>

            <p>
              barcodemaker.shop is a collection of
              easy-to-use online tools designed
              to help individuals, businesses,
              developers and organizations create
              QR codes and barcodes quickly.
            </p>

            <p>
              Our goal is to make common barcode
              and QR code tasks accessible without
              requiring specialized software,
              complicated setup or unnecessary
              registration.
            </p>

          </section>


          {/* =================================================
              WHAT WE OFFER
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              OUR TOOLS
            </span>

            <h2>
              Tools built for everyday use
            </h2>

            <p>
              The platform provides several
              browser-based tools for generating
              different types of QR codes and
              barcodes.
            </p>


            <div className="about-tools-grid">

              <Link
                to="/barcode-generator"
                className="about-tool-card"
              >

                <div className="about-tool-icon">
                  ▥
                </div>

                <div>
                  <h3>
                    Barcode Generator
                  </h3>

                  <p>
                    Create linear barcodes such
                    as Code 128, EAN, UPC and
                    ITF formats.
                  </p>

                  <span>
                    Generate Barcode →
                  </span>
                </div>

              </Link>


              <Link
                to="/text-to-qr"
                className="about-tool-card"
              >

                <div className="about-tool-icon blue">
                  QR
                </div>

                <div>
                  <h3>
                    Text to QR
                  </h3>

                  <p>
                    Turn text, links and other
                    information into QR codes
                    directly from your browser.
                  </p>

                  <span>
                    Create QR Code →
                  </span>
                </div>

              </Link>


              <Link
                to="/image-to-qr"
                className="about-tool-card"
              >

                <div className="about-tool-icon green">
                  ▧
                </div>

                <div>
                  <h3>
                    Image to QR
                  </h3>

                  <p>
                    Create QR codes from image
                    and extracted information.
                  </p>

                  <span>
                    Try Image to QR →
                  </span>
                </div>

              </Link>


              <Link
                to="/upi-qr"
                className="about-tool-card"
              >

                <div className="about-tool-icon orange">
                  ₹
                </div>

                <div>
                  <h3>
                    UPI QR Generator
                  </h3>

                  <p>
                    Create QR codes for UPI
                    payment information.
                  </p>

                  <span>
                    Create UPI QR →
                  </span>
                </div>

              </Link>

            </div>

          </section>


          {/* =================================================
              WHY YESDEV
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              OUR APPROACH
            </span>

            <h2>
              Designed to stay simple
            </h2>

            <div className="about-feature-grid">

              <div className="about-feature">

                <div className="feature-number">
                  01
                </div>

                <div>
                  <h3>
                    Easy to use
                  </h3>

                  <p>
                    Our tools are designed with
                    straightforward interfaces so
                    users can generate codes without
                    complicated steps.
                  </p>
                </div>

              </div>


              <div className="about-feature">

                <div className="feature-number">
                  02
                </div>

                <div>
                  <h3>
                    Browser based
                  </h3>

                  <p>
                    The tools are accessible
                    directly through a modern web
                    browser without requiring
                    dedicated desktop software.
                  </p>
                </div>

              </div>


              <div className="about-feature">

                <div className="feature-number">
                  03
                </div>

                <div>
                  <h3>
                    Multiple formats
                  </h3>

                  <p>
                    Different tools support
                    different QR and barcode formats
                    for common personal and business
                    use cases.
                  </p>
                </div>

              </div>


              <div className="about-feature">

                <div className="feature-number">
                  04
                </div>

                <div>
                  <h3>
                    Practical output
                  </h3>

                  <p>
                    We focus on generating usable
                    codes that can be downloaded and
                    used for appropriate digital or
                    printed applications.
                  </p>
                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              USE CASES
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              USE CASES
            </span>

            <h2>
              Who can use our tools?
            </h2>

            <div className="use-case-grid">

              <div className="use-case">
                <span>
                  📦
                </span>

                <h3>
                  Inventory
                </h3>

                <p>
                  Create product and inventory
                  identification barcodes.
                </p>
              </div>


              <div className="use-case">
                <span>
                  🏪
                </span>

                <h3>
                  Retail
                </h3>

                <p>
                  Generate common retail barcode
                  formats for suitable applications.
                </p>
              </div>


              <div className="use-case">
                <span>
                  🚚
                </span>

                <h3>
                  Logistics
                </h3>

                <p>
                  Create codes for packages,
                  labels and logistics workflows.
                </p>
              </div>


              <div className="use-case">
                <span>
                  💻
                </span>

                <h3>
                  Developers
                </h3>

                <p>
                  Quickly create QR codes and
                  barcodes while testing applications.
                </p>
              </div>

            </div>

          </section>


          {/* =================================================
              PRIVACY
          ================================================= */}

          <section className="about-trust-section">

            <div className="trust-icon">
              🔒
            </div>

            <div>

              <h2>
                Your privacy matters
              </h2>

              <p>
                We aim to keep our tools simple
                and transparent. Before using any
                tool, please review our Privacy
                Policy to understand how information
                associated with the website may be
                handled.
              </p>

              <Link
                to="/privacy-policy"
              >
                Read our Privacy Policy →
              </Link>

            </div>

          </section>


          {/* =================================================
              CTA
          ================================================= */}

          <section className="about-cta">

            <div>

              <span>
                READY TO CREATE?
              </span>

              <h2>
                Start generating your code
              </h2>

              <p>
                Choose a tool and create your
                QR code or barcode in seconds.
              </p>

            </div>

            <div className="about-cta-buttons">

              <Link
                to="/barcode-generator"
                className="about-cta-primary"
              >
                Barcode Generator
              </Link>

              <Link
                to="/text-to-qr"
                className="about-cta-secondary"
              >
                QR Generator
              </Link>

            </div>

          </section>


        </div>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </div>
  );
}