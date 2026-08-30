import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const CONTACT_EMAIL = "rahulkeshari3365@gmail.com";

export default function Terms() {
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
              ✓
            </div>

            <div>
              <h1>
                Terms of Service
              </h1>

              <p>
                Terms and conditions for using
                barcodemaker.shop.
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

          {/* INTRO */}

          <section className="info-section">

            <span className="info-label">
              TERMS OF SERVICE
            </span>

            <h2>
              Welcome to barcodemaker.shop
            </h2>

            <p>
              These Terms of Service explain the
              terms and conditions that apply when
              you access or use barcodemaker.shop and its
              QR code, barcode, and related online
              tools.
            </p>

            <p>
              By accessing or using the website,
              you agree to follow these Terms of
              Service. If you do not agree with
              these terms, please do not use the
              website.
            </p>

            <p className="terms-updated">
              Last updated: August 2026
            </p>

          </section>


          {/* =================================================
              USE OF WEBSITE
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              01 — USE OF THE WEBSITE
            </span>

            <h2>
              Acceptable use
            </h2>

            <p>
              You may use barcodemaker.shop for lawful
              purposes and in accordance with these
              Terms of Service.
            </p>

            <p>
              You agree not to misuse the website,
              attempt to interfere with its operation,
              circumvent reasonable technical
              restrictions, or use the service for
              unlawful activities.
            </p>

            <p>
              You are responsible for ensuring that
              your use of generated QR codes and
              barcodes complies with applicable laws
              and the requirements of the systems
              where those codes are used.
            </p>

          </section>


          {/* =================================================
              TOOLS
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              02 — ONLINE TOOLS
            </span>

            <h2>
              QR code and barcode generators
            </h2>

            <p>
              barcodemaker.shop provides browser-based
              tools for generating QR codes and
              barcodes in supported formats.
            </p>

            <p>
              Generated codes are intended for
              appropriate personal, educational,
              development, business, inventory,
              retail, logistics, and other lawful
              purposes.
            </p>

            <p>
              You are responsible for checking that
              a generated code contains the correct
              information and is suitable for your
              intended application before using or
              distributing it.
            </p>

          </section>


          {/* =================================================
              USER CONTENT
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              03 — INFORMATION YOU ENTER
            </span>

            <h2>
              Your responsibility
            </h2>

            <p>
              Some of our tools allow you to enter
              text, URLs, payment information,
              product information, or other data.
            </p>

            <p>
              You are responsible for the accuracy
              and legality of information that you
              enter into the tools.
            </p>

            <p>
              Do not use the tools to create or
              distribute content that violates
              applicable laws, infringes another
              person's rights, or is intended to
              facilitate harmful or fraudulent
              activity.
            </p>

          </section>


          {/* =================================================
              GENERATED OUTPUT
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              04 — GENERATED OUTPUT
            </span>

            <h2>
              Checking generated codes
            </h2>

            <p>
              QR codes and barcodes should be
              checked before being used in production,
              printed materials, product packaging,
              payment workflows, inventory systems,
              or other important applications.
            </p>

            <p>
              A code that appears visually correct
              may still contain incorrect or
              incompatible information. You are
              responsible for testing generated
              output with the intended scanner,
              application, or system.
            </p>

          </section>


          {/* =================================================
              AVAILABILITY
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              05 — AVAILABILITY
            </span>

            <h2>
              Website availability
            </h2>

            <p>
              We aim to keep barcodemaker.shop available
              and functional, but we cannot guarantee
              that the website or every tool will
              always be available without interruption.
            </p>

            <p>
              Features, tools, formats, functionality,
              and website content may be changed,
              updated, suspended, or discontinued
              when necessary.
            </p>

          </section>


          {/* =================================================
              THIRD PARTY
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              06 — THIRD-PARTY SERVICES
            </span>

            <h2>
              External services and links
            </h2>

            <p>
              The website may use third-party
              services for functions such as
              advertising, analytics, hosting,
              content delivery, or other technical
              services.
            </p>

            <p>
              Third-party services may have their
              own terms, privacy policies, and
              conditions. Your use of those services
              may therefore be subject to their
              respective terms.
            </p>

          </section>


          {/* =================================================
              ADVERTISING
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              07 — ADVERTISING
            </span>

            <h2>
              Advertising on the website
            </h2>

            <p>
              barcodemaker.shop may display advertisements
              provided by third-party advertising
              services, including Google AdSense.
            </p>

            <p>
              Advertisements are provided by
              third-party advertising providers and
              are not necessarily endorsements or
              recommendations by barcodemaker.shop.
            </p>

          </section>


          {/* =================================================
              INTELLECTUAL PROPERTY
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              08 — INTELLECTUAL PROPERTY
            </span>

            <h2>
              Website content
            </h2>

            <p>
              Unless otherwise stated, the website's
              design, branding, original written
              content, interface elements, and
              software components are owned by or
              used by barcodemaker.shop and may be
              protected by applicable intellectual
              property laws.
            </p>

            <p>
              You may not reproduce, redistribute,
              modify, or commercially exploit
              protected website content without
              appropriate authorization.
            </p>

          </section>


          {/* =================================================
              DISCLAIMER
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              09 — DISCLAIMER
            </span>

            <h2>
              Use of the service
            </h2>

            <p>
              The website and its tools are provided
              on an "as available" basis. We make
              reasonable efforts to provide useful
              and functional tools, but we do not
              guarantee that every generated result
              will be suitable for every particular
              purpose or system.
            </p>

            <p>
              You should independently verify
              important generated output before
              relying on it for business, financial,
              operational, regulatory, or other
              important purposes.
            </p>

          </section>


          {/* =================================================
              LIMITATION
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              10 — LIMITATION OF LIABILITY
            </span>

            <h2>
              Responsibility for use
            </h2>

            <p>
              To the extent permitted by applicable
              law, barcodemaker.shop and its operators will
              not be responsible for losses or damages
              arising from your use of, or inability
              to use, the website or generated output.
            </p>

            <p>
              This includes situations where a
              generated QR code or barcode is used
              without appropriate verification or
              testing.
            </p>

          </section>


          {/* =================================================
              PRIVACY
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              11 — PRIVACY
            </span>

            <h2>
              Privacy Policy
            </h2>

            <p>
              Your use of the website is also subject
              to our Privacy Policy, which explains
              how information may be handled when you
              use barcodemaker.shop.
            </p>

            <Link
              to="/privacy-policy"
              className="terms-inline-link"
            >
              Read Privacy Policy →
            </Link>

          </section>


          {/* =================================================
              CHANGES
          ================================================= */}

          <section className="info-section">

            <span className="info-label">
              12 — CHANGES TO THESE TERMS
            </span>

            <h2>
              Updates
            </h2>

            <p>
              We may update these Terms of Service
              from time to time to reflect changes
              to the website, tools, services, or
              applicable requirements.
            </p>

            <p>
              Updated terms will be published on
              this page. Your continued use of the
              website after an update means that you
              agree to the updated terms, to the
              extent permitted by applicable law.
            </p>

          </section>


          {/* =================================================
              CONTACT
          ================================================= */}

          <section className="terms-contact">

            <div className="terms-contact-icon">
              ✉
            </div>

            <div>

              <span className="info-label">
                QUESTIONS
              </span>

              <h2>
                Need clarification?
              </h2>

              <p>
                If you have questions about these
                Terms of Service, contact us at:
              </p>

              <a
                href="mailto:rahulkeshari3365@gmail.com"
              >
                {CONTACT_EMAIL}
              </a>

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