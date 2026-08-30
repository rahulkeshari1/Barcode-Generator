// ============================================================
// FILE: pages/UPIQR.jsx
// ============================================================
import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../App.css";

export default function UPIQR() {
  const [upiId, setUpiId] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [qrData, setQrData] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");
  const qrRef = useRef(null);

  const validateUPI = (id) => {
    // Basic UPI ID validation: username@provider
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return upiRegex.test(id);
  };

  const generateQR = () => {
    setError("");

    // Validate UPI ID
    if (!upiId.trim()) {
      setError("Please enter a UPI ID");
      return;
    }

    if (!validateUPI(upiId)) {
      setError("Invalid UPI ID format. Example: username@paytm");
      return;
    }

    if (!name.trim()) {
      setError("Please enter the payee name");
      return;
    }

    // Build UPI URL
    let upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}` +
                 `&pn=${encodeURIComponent(name)}` +
                 `&cu=INR`;

    // Add amount if provided and valid
    if (amount && Number(amount) > 0) {
      upiUrl += `&am=${Number(amount).toFixed(2)}`;
    }

    setQrData(upiUrl);
  };

  const downloadQR = () => {
    if (!qrData) return;

    setIsDownloading(true);
    
    try {
      const canvas = document.querySelector('.upi-qr-card canvas');
      if (!canvas) {
        setIsDownloading(false);
        return;
      }

      const link = document.createElement('a');
      const safeName = name.replace(/[^a-zA-Z0-9]/g, '_') || 'upi';
      const fileName = `upi-qr-${safeName}-${upiId}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download QR code. Please try again.');
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const clearAll = () => {
    setUpiId("");
    setName("");
    setAmount("");
    setQrData("");
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateQR();
    }
  };

  return (
    <div className="upi-page">
      <div className="upi-container">
        
        {/* SEO Friendly Header */}
        <header className="upi-header">
          <div className="upi-header-badge">
            <span className="badge-icon">💳</span>
            UPI Payments
          </div>
          <h1>UPI QR Code Generator</h1>
          <p className="upi-subtitle">
            Create UPI payment QR codes instantly for instant transactions.
            Accept payments via Google Pay, PhonePe, Paytm and all UPI apps.
          </p>
          <div className="upi-features">
            <span>✓ No Registration</span>
            <span>✓ Free & Fast</span>
            <span>✓ Instant Download</span>
          </div>
        </header>

        {/* Form Section */}
        <div className="upi-form">
          <div className="form-group">
            <label htmlFor="upi-id">
              <span className="label-icon">📧</span>
              UPI ID <span className="required">*</span>
            </label>
            <input
              id="upi-id"
              type="text"
              placeholder="example@paytm / example@upi"
              value={upiId}
              onChange={(e) => {
                setUpiId(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className="upi-input"
            />
            <span className="input-hint">
              Enter your UPI ID (e.g., username@paytm, mobile@upi)
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="payee-name">
              <span className="label-icon">👤</span>
              Payee Name <span className="required">*</span>
            </label>
            <input
              id="payee-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className="upi-input"
            />
            <span className="input-hint">
              This name will appear on the payer's UPI app
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="amount">
              <span className="label-icon">💰</span>
              Amount (Optional)
            </label>
            <input
              id="amount"
              type="number"
              placeholder="Enter amount (e.g., 100)"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || Number(val) >= 0) {
                  setAmount(val);
                  setError("");
                }
              }}
              onKeyPress={handleKeyPress}
              className="upi-input"
              min="0"
              step="0.01"
            />
            <span className="input-hint">
              Leave empty for variable amount or enter a fixed amount
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="upi-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="upi-actions">
            <button 
              className="generate-btn" 
              onClick={generateQR}
            >
              <span>✨</span> Generate QR Code
            </button>
            <button 
              className="clear-btn" 
              onClick={clearAll}
            >
              <span>🗑️</span> Clear All
            </button>
          </div>
        </div>

        {/* QR Display Section */}
        {qrData && (
          <div className="upi-result">
            <div className="upi-qr-card">
              <div className="qr-header">
                <span className="qr-badge">🔵 Scan to Pay</span>
                <button 
                  className="download-qr-btn" 
                  onClick={downloadQR}
                  disabled={isDownloading}
                >
                  {isDownloading ? '⏳ Downloading...' : '⬇ Download QR'}
                </button>
              </div>
              
              <div className="qr-wrapper">
                <QRCodeCanvas
                  value={qrData}
                  size={280}
                  level="H"
                  includeMargin={true}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>

              <div className="qr-details">
                <div className="detail-item">
                  <span className="detail-label">UPI ID</span>
                  <span className="detail-value">{upiId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payee</span>
                  <span className="detail-value">{name}</span>
                </div>
                {amount && Number(amount) > 0 && (
                  <div className="detail-item highlight">
                    <span className="detail-label">Amount</span>
                    <span className="detail-value">₹{Number(amount).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="upi-instructions">
                <h4>How to Pay:</h4>
                <ol>
                  <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                  <li>Tap on "Scan QR" or "Pay"</li>
                  <li>Scan this QR code or enter UPI ID manually</li>
                  {amount && Number(amount) > 0 && (
                    <li>Amount ₹{Number(amount).toFixed(2)} will be pre-filled</li>
                  )}
                  <li>Confirm and make the payment</li>
                </ol>
              </div>
            </div>

            {/* UPI Info Section */}
            <div className="upi-info">
              <h3>⚡ Quick Pay Options</h3>
              <div className="upi-buttons">
                <button 
                  className="upi-app-btn gpay"
                  onClick={() => {
                    const gpayUrl = `https://pay.google.com/gp/p/ui/pay?${new URLSearchParams({
                      'pa': upiId,
                      'pn': name,
                      'am': amount || '',
                      'cu': 'INR'
                    }).toString()}`;
                    window.open(gpayUrl, '_blank');
                  }}
                >
                  <span>🔵</span> Google Pay
                </button>
                <button 
                  className="upi-app-btn phonepe"
                  onClick={() => {
                    const phonepeUrl = `phonepe://pay?${new URLSearchParams({
                      'pa': upiId,
                      'pn': name,
                      'am': amount || '',
                      'cu': 'INR'
                    }).toString()}`;
                    window.open(phonepeUrl, '_blank');
                  }}
                >
                  <span>🟣</span> PhonePe
                </button>
                <button 
                  className="upi-app-btn paytm"
                  onClick={() => {
                    const paytmUrl = `paytm://upi/pay?${new URLSearchParams({
                      'pa': upiId,
                      'pn': name,
                      'am': amount || '',
                      'cu': 'INR'
                    }).toString()}`;
                    window.open(paytmUrl, '_blank');
                  }}
                >
                  <span>🔵</span> Paytm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEO Friendly Footer */}
        <footer className="upi-footer">
          <div className="upi-footer-grid">
            <div className="footer-item">
              <span className="footer-icon">🔒</span>
              <div>
                <h4>100% Secure</h4>
                <p>All data is processed locally in your browser. No data is stored on our servers.</p>
              </div>
            </div>
            <div className="footer-item">
              <span className="footer-icon">⚡</span>
              <div>
                <h4>Instant Generation</h4>
                <p>Generate UPI QR codes in seconds with our fast and efficient tool.</p>
              </div>
            </div>
            <div className="footer-item">
              <span className="footer-icon">📱</span>
              <div>
                <h4>Works with All UPI Apps</h4>
                <p>Compatible with Google Pay, PhonePe, Paytm, Amazon Pay and all UPI apps.</p>
              </div>
            </div>
          </div>
          <div className="upi-footer-bottom">
            <p>© {new Date().getFullYear()} UPI QR Generator. All rights reserved.</p>
            <p className="footer-made">Accept payments instantly with UPI</p>
          </div>
        </footer>

      </div>
    </div>
  );
}