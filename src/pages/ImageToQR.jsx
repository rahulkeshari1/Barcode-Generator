import { useState } from "react";
import PasteArea from "../components/PasteArea";
import QRGenerator from "../components/QRGenerator";
import { parseLines } from "../utils/textParser";
import { readImageText } from "../utils/ocr";
import "../App.css";

function ImageToQR() {
  const [loading, setLoading] = useState(false);
  const [rawText, setRawText] = useState("");
  const [qrItems, setQrItems] = useState([]);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleImage = async (file) => {
    if (!file) return;
    
    setLoading(true);
    setError("");
    setFileName(file.name);

    try {
      const text = await readImageText(file);
      if (text && text.trim()) {
        setRawText(text);
        // Auto-generate QR from extracted text
        const items = parseLines(text);
        if (items.length > 0) {
          setQrItems(items);
        }
      } else {
        setError("No text found in the image. Please try another image with clear text.");
      }
    } catch (error) {
      console.error("OCR Error:", error);
      setError(error.message || "Failed to read text from image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleText = (text) => {
    if (text && text.trim()) {
      setRawText(text);
      setError("");
    }
  };

  const generateQR = () => {
    if (!rawText.trim()) {
      setError("Please enter text or upload an image first.");
      return;
    }
    const items = parseLines(rawText);
    if (items.length === 0) {
      setError("No valid text found to generate QR codes. Please check your input.");
      return;
    }
    setQrItems(items);
    setError("");
  };

  const clearAll = () => {
    setRawText("");
    setQrItems([]);
    setFileName("");
    setError("");
  };

  const handleUpload = (file) => {
    handleImage(file);
  };

  return (
    <div className="image-to-qr-page">
      <div className="image-to-qr-container">
        
        {/* SEO Friendly Header */}
        <header className="page-header">
          <div className="page-header-badge">
            <span className="badge-icon">📷</span>
            OCR Powered
          </div>
          <h1>Image to QR Code Generator</h1>
          <p className="page-subtitle">
            Extract text from images using OCR and convert to QR codes instantly.
            Perfect for business cards, documents, and printed materials.
          </p>
          <div className="header-features">
            <span>✓ OCR Technology</span>
            <span>✓ Batch QR Generation</span>
            <span>✓ Free & Fast</span>
          </div>
        </header>

        {/* Paste Area */}
        <PasteArea
          onImagePaste={handleImage}
          onTextPaste={handleText}
          onImageUpload={handleUpload}
          isLoading={loading}
        />

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Reading text from image...</p>
            {fileName && <span className="file-name">📄 {fileName}</span>}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Text Area */}
        <div className="text-area-wrapper">
          <label htmlFor="qr-text-input" className="text-area-label">
            <span>📝 Extracted Text</span>
            <span className="char-count">{rawText.length} characters</span>
          </label>
          <textarea
            id="qr-text-input"
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              setError("");
            }}
            placeholder="Paste text here or upload an image to extract text automatically..."
            className="text-area"
            rows={6}
          />
        </div>

        {/* Actions */}
        <div className="actions">
          <button 
            className="generate-btn" 
            onClick={generateQR}
            disabled={loading || !rawText.trim()}
          >
            <span>✨</span> Generate QR Codes
          </button>
          <button 
            className="clear-btn" 
            onClick={clearAll}
            disabled={loading}
          >
            <span>🗑️</span> Clear All
          </button>
        </div>

        {/* QR Grid */}
        <QRGenerator items={qrItems} />

        {/* Footer Info */}
        {qrItems.length > 0 && (
          <div className="qr-footer-info">
            <p>
              Generated <strong>{qrItems.length}</strong> QR code
              {qrItems.length > 1 ? 's' : ''} from {qrItems.length > 1 ? 'text lines' : 'text'}
            </p>
            <button 
              className="download-all-btn"
              onClick={() => {
                // Trigger download for all QR codes
                const downloadBtns = document.querySelectorAll('.qr-download-btn');
                downloadBtns.forEach((btn, index) => {
                  setTimeout(() => btn.click(), index * 500);
                });
              }}
            >
              ⬇ Download All
            </button>
          </div>
        )}

        {/* SEO Friendly Footer */}
        <footer className="page-footer">
          <div className="footer-info-grid">
            <div className="footer-info-item">
              <span className="footer-info-icon">🔒</span>
              <div>
                <h4>100% Private</h4>
                <p>Images are processed locally in your browser. Nothing is uploaded to any server.</p>
              </div>
            </div>
            <div className="footer-info-item">
              <span className="footer-info-icon">⚡</span>
              <div>
                <h4>Powered by Tesseract.js</h4>
                <p>Advanced OCR technology for accurate text extraction from images.</p>
              </div>
            </div>
            <div className="footer-info-item">
              <span className="footer-info-icon">📱</span>
              <div>
                <h4>Works Anywhere</h4>
                <p>Use on desktop, tablet, or mobile devices with full touch support.</p>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default ImageToQR;