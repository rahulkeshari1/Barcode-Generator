import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import StatsGrid from "../components/StatsGrid";
import ToolCards from "../components/ToolCards";
import MoreTools from "../components/MoreTools";
import ZeptoStickyButton from "../components/ZepStore";
import { Link } from "react-router-dom";
import AdSense from "../components/AdSense";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="home-page">
      {/* ============================================================
      HERO SECTION - Modern & Professional
      ============================================================ */}
      <section className="hero-section" aria-label="QR and Barcode Generator">
        <div className="hero-content">
         
          
          <h1 className="hero-title">
            Create Professional
            <br />
            <span className="gradient-text">QR & Barcode Studio</span>
          </h1>
          
          <p className="hero-description">
            Generate high-quality QR codes and barcodes instantly for 
            products, inventory, retail, and logistics operations.
            <br />
            <span className="highlight-text">
              ✓ 100% Free • ✓ No Registration • ✓ Enterprise Quality
            </span>
          </p>
          
          <div className="hero-actions">
            <Link to="/barcode-generator" className="hero-btn primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="4" height="16" />
                <rect x="6" y="4" width="2" height="16" />
                <rect x="10" y="4" width="3" height="16" />
                <rect x="15" y="4" width="4" height="16" />
                <rect x="21" y="4" width="1" height="16" />
              </svg>
              Barcode Generator
            </Link>
            
            <Link to="/image-to-qr" className="hero-btn secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              QR from Image
            </Link>
          </div>
          
          <div className="hero-tags">
            <span className="tag">✦ Code 128</span>
            <span className="tag">✦ EAN-13</span>
            <span className="tag">✦ UPC-A</span>
            <span className="tag">✦ ITF-14</span>
            <span className="tag">✦ QR Code</span>
            <span className="tag">✦ Data Matrix</span>
          </div>
        </div>
        
        {/* Hero Visual - Barcode Preview */}
        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-badge">
              <span className="pulse-dot"></span>
              Live Preview
            </div>
            
            <div className="visual-barcode">
              <div className="barcode-simulator">
                <div className="barcode-bars">
                  <span className="bar thick"></span>
                  <span className="bar thin"></span>
                  <span className="bar medium"></span>
                  <span className="bar thick"></span>
                  <span className="bar thin"></span>
                  <span className="bar medium"></span>
                  <span className="bar thick"></span>
                  <span className="bar thin"></span>
                  <span className="bar medium"></span>
                  <span className="bar thick"></span>
                  <span className="bar thin"></span>
                  <span className="bar medium"></span>
                  <span className="bar thick"></span>
                  <span className="bar thin"></span>
                </div>
                <div className="barcode-text">PROD-ABC-2026</div>
              </div>
            </div>
            
            <div className="visual-features">
              <span>15+ Formats</span>
              <span>Auto-Generate</span>
              <span>High Quality</span>
              <span>Scan Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
      STATS SECTION - Social Proof
      ============================================================ */}
      <StatsGrid />

      {/* ============================================================
      TOOLS SECTION - Main Features
      ============================================================ */}
      <section className="tools-section" aria-label="Available Tools">
        <div className="section-header">
          <div className="section-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Powerful Tools
          </div>
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">
            From simple QR codes to professional barcodes — all in one place
          </p>
        </div>

        <div className="tools-grid-primary">
          {/* Featured Tool - Barcode Generator */}
          <Link to="/barcode-generator" className="tool-card featured">
            <div className="tool-icon gradient-purple">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="4" height="16" />
                <rect x="6" y="4" width="2" height="16" />
                <rect x="10" y="4" width="3" height="16" />
                <rect x="15" y="4" width="4" height="16" />
                <rect x="21" y="4" width="1" height="16" />
              </svg>
            </div>
            <div className="tool-content">
              <h3>Barcode Generator</h3>
              <p>Create high-quality linear barcodes for products, inventory, and logistics</p>
              <div className="tool-tags">
                <span>Code 128</span>
                <span>EAN-13</span>
                <span>UPC</span>
                <span>ITF-14</span>
              </div>
              <span className="tool-cta">Try Now →</span>
            </div>
          </Link>

          {/* Image to QR */}
          <Link to="/image-to-qr" className="tool-card">
            <div className="tool-icon gradient-blue">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="tool-content">
              <h3>Image to QR</h3>
              <p>Convert images to QR codes with OCR text extraction</p>
              <div className="tool-tags">
                <span>OCR</span>
                <span>Text Extract</span>
              </div>
              <span className="tool-cta">Try Now →</span>
            </div>
          </Link>

          {/* UPI QR Generator */}
          <Link to="/upi-qr" className="tool-card">
            <div className="tool-icon gradient-green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div className="tool-content">
              <h3>UPI QR Generator</h3>
              <p>Create UPI payment QR codes for instant transactions</p>
              <div className="tool-tags">
                <span>Payments</span>
                <span>UPI</span>
              </div>
              <span className="tool-cta">Try Now →</span>
            </div>
          </Link>

          {/* Text to QR */}
          <Link to="/text-to-qr" className="tool-card">
            <div className="tool-icon gradient-orange">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7h16" />
                <path d="M4 12h10" />
                <path d="M4 17h6" />
              </svg>
            </div>
            <div className="tool-content">
              <h3>Text to QR</h3>
              <p>Generate QR codes from any text or URL instantly</p>
              <div className="tool-tags">
                <span>Text</span>
                <span>URL</span>
              </div>
              <span className="tool-cta">Try Now →</span>
            </div>
          </Link>

          {/* Batch QR Generator */}
          <Link to="/batch-qr" className="tool-card">
            <div className="tool-icon gradient-pink">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="8" height="8" rx="1" />
                <rect x="14" y="2" width="8" height="8" rx="1" />
                <rect x="2" y="14" width="8" height="8" rx="1" />
                <rect x="14" y="14" width="8" height="8" rx="1" />
              </svg>
            </div>
            <div className="tool-content">
              <h3>Batch QR Generator</h3>
              <p>Generate multiple QR codes at once from a list</p>
              <div className="tool-tags">
                <span>Bulk</span>
                <span>Efficient</span>
              </div>
              <span className="tool-cta">Try Now →</span>
            </div>
          </Link>

          {/* Coming Soon - QR Scanner */}
          <div className="tool-card coming-soon">
            <div className="tool-icon gradient-cyan">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 11 3 6 8 6" />
                <polyline points="21 13 21 18 16 18" />
                <polyline points="3 13 3 18 8 18" />
                <polyline points="21 11 21 6 16 6" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 9v6" />
                <path d="M9 12h6" />
              </svg>
            </div>
            <div className="tool-content">
              <h3>QR Scanner</h3>
              <p>Scan QR codes and barcodes using your camera</p>
              <div className="tool-tags">
                <span>Camera</span>
                <span>Coming Soon</span>
              </div>
              <span className="tool-cta">🔜 Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
      FEATURES HIGHLIGHTS - Benefits
      ============================================================ */}
      <section className="features-section" aria-label="Key Features">
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="4" height="16" />
                <rect x="6" y="4" width="2" height="16" />
                <rect x="10" y="4" width="3" height="16" />
                <rect x="15" y="4" width="4" height="16" />
                <rect x="21" y="4" width="1" height="16" />
              </svg>
            </div>
            <h4>15+ Barcode Types</h4>
            <p>Support for Code 128, EAN-13, UPC-A, ITF-14, and more</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h4>Real-Time Preview</h4>
            <p>See your barcode update instantly as you type</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h4>Bulk Download</h4>
            <p>Download all barcodes at once or as a ZIP file</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h4>Scan Ready</h4>
            <p>High-quality output optimized for scanners</p>
          </div>
        </div>
      </section>

      {/* ============================================================
      MORE TOOLS - Additional Tools
      ============================================================ */}
      <MoreTools />

      {/* ============================================================
      TRUST SECTION - Social Proof
      ============================================================ */}
      <section className="trust-section" aria-label="Trust Indicators">
        <div className="trust-grid">
          <div className="trust-item">
            <span className="trust-number">50K+</span>
            <span className="trust-label">QR Codes Generated</span>
          </div>
          <div className="trust-item">
            <span className="trust-number">99.9%</span>
            <span className="trust-label">Uptime Guarantee</span>
          </div>
          <div className="trust-item">
            <span className="trust-number">15+</span>
            <span className="trust-label">Barcode Formats</span>
          </div>
          <div className="trust-item">
            <span className="trust-number">4.9/5</span>
            <span className="trust-label">User Rating</span>
          </div>
        </div>
      </section>

      {/* ============================================================
      CTA SECTION - Call to Action
      ============================================================ */}
      <section className="cta-section" aria-label="Get Started">
        <div className="cta-content">
          <div className="cta-badge">⚡ Get Started Now</div>
          <h2>Ready to Generate?</h2>
          <p>
            Start creating professional barcodes and QR codes in seconds
          </p>
          <div className="cta-buttons">
            <Link to="/barcode-generator" className="cta-btn primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Start Generating
            </Link>
            <Link to="/image-to-qr" className="cta-btn secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Try QR from Image
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
      ZEPTO STICKY BUTTON - Floating Action
      ============================================================ */}
      <ZeptoStickyButton />

      {/* ============================================================
      FOOTER
      ============================================================ */}
      <Footer />
    </div>
  );
}