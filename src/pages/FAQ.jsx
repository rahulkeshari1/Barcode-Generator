import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import './FAQ.css'

const FAQ_DATA = [
  {
    category: "General",
    questions: [
      {
        question: "What is barcodemaker.shop?",
        answer:
          "barcodemaker.shop provides free online tools for creating QR codes and barcodes. The tools are designed for common personal, business, retail, inventory, logistics, and development use cases."
      },
      {
        question: "Is barcodemaker.shop free to use?",
        answer:
          "Yes. The QR code and barcode generation tools available on barcodemaker.shop are designed to be available without requiring a paid subscription for basic generation."
      },
      {
        question: "Do I need to create an account?",
        answer:
          "No account is required for the basic QR code and barcode generation tools currently available on the website."
      },
      {
        question: "Does the website work on mobile phones?",
        answer:
          "Yes. The website is designed to work on desktop computers, tablets, and mobile devices using a modern web browser."
      }
    ]
  },

  {
    category: "Barcode Generator",
    questions: [
      {
        question: "What barcode formats are supported?",
        answer:
          "The barcode tools support multiple common formats, including Code 128, EAN-13, EAN-8, UPC-A, ITF-14 and other formats depending on the selected generator."
      },
      {
        question: "What is Code 128?",
        answer:
          "Code 128 is a high-density linear barcode format commonly used for inventory, logistics, shipping, product identification, and other applications where a compact barcode is useful."
      },
      {
        question: "Can I download the generated barcode?",
        answer:
          "Yes. Generated barcodes can be downloaded from the barcode generator when the selected tool provides the download option."
      },
      {
        question: "Can I generate multiple barcodes?",
        answer:
          "Yes. The website includes tools designed for batch or multiple-code generation. Availability and supported formats depend on the specific generator."
      }
    ]
  },

  {
    category: "QR Codes",
    questions: [
      {
        question: "What can I use a QR code for?",
        answer:
          "QR codes can be used to share URLs, text, payment information and other supported information that can be accessed by scanning the generated code."
      },
      {
        question: "Can I create a QR code from text?",
        answer:
          "Yes. Use the Text to QR tool to enter text or a supported URL and generate a QR code."
      },
      {
        question: "Can I create a UPI QR code?",
        answer:
          "Yes. The UPI QR Generator is designed to create QR codes containing supported UPI payment information."
      },
      {
        question: "Can I create QR codes from images?",
        answer:
          "The Image to QR tool provides functionality for working with images and extracting supported information for QR generation."
      }
    ]
  },

  {
    category: "Privacy & Security",
    questions: [
      {
        question: "Does barcodemaker.shop store the data I enter?",
        answer:
          "The handling of information can depend on the particular tool and how it is implemented. You should avoid entering sensitive or confidential information into an online tool unless you understand how that information is processed. See our Privacy Policy for more information."
      },
      {
        question: "Does barcodemaker.shop use cookies?",
        answer:
          "The website may use cookies or similar technologies for functionality, analytics, preferences, and advertising. See our Privacy Policy for more information."
      },
      {
        question: "Does barcodemaker.shop use Google AdSense?",
        answer:
          "barcodemaker.shop may display advertisements using Google AdSense. Advertising services may use cookies or similar technologies in accordance with their applicable policies."
      }
    ]
  },

  {
    category: "Troubleshooting",
    questions: [
      {
        question: "Why is my generated barcode not scanning?",
        answer:
          "Make sure the barcode contains valid data for the selected barcode format and that the generated image is displayed or printed clearly. Avoid stretching, compressing, or covering the barcode when using it."
      },
      {
        question: "Why can't I generate my barcode?",
        answer:
          "The selected barcode format may require a specific data structure or length. Check that your input matches the requirements of the selected format."
      },
      {
        question: "Why is my QR code not scanning?",
        answer:
          "Make sure the QR code is displayed clearly with sufficient contrast and that it is not cropped or distorted. Try scanning the original generated image rather than a heavily compressed copy."
      }
    ]
  }
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;

    setOpenItem((current) =>
      current === key ? null : key
    );
  };

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
              ?
            </div>

            <div>
              <h1>
                Frequently Asked Questions
              </h1>

              <p>
                Answers about our QR code and
                barcode tools.
              </p>
            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          FAQ CONTENT
      ===================================================== */}

      <main className="info-page-content">

        <div className="info-container">

          {/* INTRO */}

          <section className="info-section faq-intro">

            <span className="info-label">
              FAQ
            </span>

            <h2>
              Common questions about
              barcodemaker.shop
            </h2>

            <p>
              Find answers to common questions
              about generating QR codes, barcodes,
              using our online tools, and
              troubleshooting generated codes.
            </p>

          </section>


          {/* FAQ CATEGORIES */}

          <div className="faq-list">

            {FAQ_DATA.map(
              (category, categoryIndex) => (
                <section
                  className="faq-category"
                  key={category.category}
                >

                  <div className="faq-category-title">
                    {category.category}
                  </div>

                  <div className="faq-items">

                    {category.questions.map(
                      (item, questionIndex) => {
                        const key =
                          `${categoryIndex}-${questionIndex}`;

                        const isOpen =
                          openItem === key;

                        return (
                          <div
                            className={
                              isOpen
                                ? "faq-item open"
                                : "faq-item"
                            }
                            key={item.question}
                          >

                            <button
                              type="button"
                              className="faq-question"
                              onClick={() =>
                                toggleItem(
                                  categoryIndex,
                                  questionIndex
                                )
                              }
                              aria-expanded={isOpen}
                            >

                              <span>
                                {item.question}
                              </span>

                              <span className="faq-toggle">
                                {isOpen
                                  ? "−"
                                  : "+"}
                              </span>

                            </button>

                            {isOpen && (
                              <div className="faq-answer">
                                <p>
                                  {item.answer}
                                </p>
                              </div>
                            )}

                          </div>
                        );
                      }
                    )}

                  </div>

                </section>
              )
            )}

          </div>


          {/* =================================================
              STILL NEED HELP
          ================================================= */}

          <section className="faq-contact-section">

            <div className="faq-contact-icon">
              ?
            </div>

            <div className="faq-contact-content">

              <span className="info-label">
                NEED MORE HELP?
              </span>

              <h2>
                Didn't find your answer?
              </h2>

              <p>
                If you have a question about our
                tools or website that isn't covered
                here, you can contact us.
              </p>

            </div>

            <Link
              to="/contact"
              className="faq-contact-button"
            >
              Contact Us →
            </Link>

          </section>


          {/* =================================================
              RELATED TOOLS
          ================================================= */}

          <section className="info-section faq-tools-section">

            <span className="info-label">
              QUICK ACCESS
            </span>

            <h2>
              Go directly to a tool
            </h2>

            <div className="faq-tools">

              <Link
                to="/barcode-generator"
                className="faq-tool-link"
              >
                <span>▥</span>
                <div>
                  <strong>
                    Barcode Generator
                  </strong>
                  <small>
                    Create Code 128, EAN, UPC and
                    other barcodes
                  </small>
                </div>
                <b>→</b>
              </Link>

              <Link
                to="/text-to-qr"
                className="faq-tool-link"
              >
                <span>QR</span>
                <div>
                  <strong>
                    Text to QR
                  </strong>
                  <small>
                    Convert text or URLs into QR
                    codes
                  </small>
                </div>
                <b>→</b>
              </Link>

              <Link
                to="/upi-qr"
                className="faq-tool-link"
              >
                <span>₹</span>
                <div>
                  <strong>
                    UPI QR Generator
                  </strong>
                  <small>
                    Create QR codes for supported
                    UPI payment information
                  </small>
                </div>
                <b>→</b>
              </Link>

            </div>

          </section>


          {/* =================================================
              PRIVACY LINK
          ================================================= */}

          <section className="faq-privacy-note">

            <span>
              🔒
            </span>

            <p>
              For information about how website
              information may be handled, please
              read our{" "}
              <Link to="/privacy-policy">
                Privacy Policy
              </Link>
              .
            </p>

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