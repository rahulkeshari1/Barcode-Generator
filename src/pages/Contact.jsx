// Contact.jsx - WITH CONT-PREFIX IN ALL CLASSES
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import './Contact.css'
const CONTACT_EMAIL = "rahulkeshari3365@gmail.com";

export default function Contact() {
  return (
    <div className="cont-page">

      {/* ===== HEADER ===== */}
      <header className="cont-page-header">
        <div className="cont-container">

          <Link to="/" className="cont-back-link">
            ← Back to Home
          </Link>

          <div className="cont-header-content">
            <div className="cont-page-icon">@</div>
            <div>
              <h1>Contact Us</h1>
              <p>Get in touch with the barcodemaker.shop team.</p>
            </div>
          </div>

        </div>
      </header>

      {/* ===== CONTENT ===== */}
      <main className="cont-page-content">
        <div className="cont-container">

          {/* Introduction Section */}
          <section className="cont-section">
            <span className="cont-label">CONTACT</span>
            <h2>We'd like to hear from you</h2>
            <p>
              If you have a question, suggestion, feedback, or need help 
              using one of our QR code or barcode tools, you can contact 
              us by email.
            </p>
          </section>

          {/* Contact Card */}
          <section className="cont-card">
            <div className="cont-card-icon">✉</div>
            <div className="cont-card-content">
              <span>EMAIL</span>
              <h2>{CONTACT_EMAIL}</h2>
              <p>
                For questions, feedback, bug reports, suggestions, or 
                other enquiries.
              </p>
              <a 
                href={`mailto:${CONTACT_EMAIL}`} 
                className="cont-email-button"
              >
                Send Email →
              </a>
            </div>
          </section>

          {/* Help Section */}
          <section className="cont-section">
            <span className="cont-label">BEFORE CONTACTING US</span>
            <h2>Need help with a tool?</h2>
            <p>
              If you're having trouble generating a barcode or QR code, 
              please include the name of the tool you're using and a 
              description of the problem in your email. This helps us 
              understand and respond to your request more effectively.
            </p>

            <div className="cont-help-list">
              <div>
                <strong>01</strong>
                <span>Tell us which tool you're using.</span>
              </div>
              <div>
                <strong>02</strong>
                <span>Explain what went wrong.</span>
              </div>
              <div>
                <strong>03</strong>
                <span>Include relevant details or screenshots if useful.</span>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <Footer />

    </div>
  );
}