// ============================================================
// FILE: pages/TextToQR.jsx
// ============================================================
import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../App.css";

export default function TextToQR() {
  const [text, setText] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [qrHistory, setQrHistory] = useState([]);
  const [selectedQrs, setSelectedQrs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  // Live preview - generate QR on every text change
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = text.trim();
      if (value) {
        setQrValue(value);
        setError("");
      } else {
        setQrValue("");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [text]);

  const generateQR = () => {
    const value = text.trim();
    if (!value) {
      setError("Please enter text to generate QR code");
      return;
    }
    setQrValue(value);
    setError("");
  };

  const addToBatch = () => {
    if (!qrValue) {
      setError("Please generate a QR code first");
      return;
    }

    const newEntry = {
      id: Date.now() + Math.random() * 1000,
      text: qrValue,
      qrData: qrValue,
      timestamp: new Date().toISOString(),
    };

    setQrHistory((prev) => [...prev, newEntry]);
    setSelectedQrs((prev) => [...prev, newEntry.id]);
    setText("");
    setQrValue("");
    setError("");
  };

  const downloadQR = () => {
    const canvas = document.querySelector(".qr-preview-card .qr-wrapper canvas");
    if (!canvas) {
      setError("QR code not found");
      return;
    }

    setIsDownloading(true);
    
    try {
      // Create a temporary canvas to render QR with proper size
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      
      // Get the QR code data from the existing canvas
      const img = new Image();
      img.onload = function() {
        tempCanvas.width = 400;
        tempCanvas.height = 400;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 400, 400);
        
        // Draw with some padding
        const padding = 30;
        const size = 400 - (padding * 2);
        ctx.drawImage(img, padding, padding, size, size);
        
        const url = tempCanvas.toDataURL("image/png");
        const a = document.createElement("a");
        const safeName = qrValue.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30) || "qr-code";
        a.download = `${safeName}.png`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      img.src = canvas.toDataURL('image/png');
      
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download QR code");
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const downloadBatchQR = (entry) => {
    // Create a canvas using QRCodeCanvas
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.background = '#ffffff';
    container.style.padding = '20px';
    container.style.borderRadius = '12px';
    document.body.appendChild(container);
    
    // Render QR code using QRCodeCanvas
    const qrElement = document.createElement('div');
    container.appendChild(qrElement);
    
    // We need to render the QR code using QRCodeCanvas
    // Since we can't use JSX here, we'll use a different approach
    // Using the qrcode.react library programmatically
    
    // Create canvas using QRCode.toCanvas from qrcode package
    // For now, use a simpler approach with the existing canvas
    const canvas = document.createElement('canvas');
    const QRCode = require('qrcode');
    
    QRCode.toCanvas(canvas, entry.qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }, (error) => {
      if (error) {
        console.error(error);
        document.body.removeChild(container);
        return;
      }
      const a = document.createElement('a');
      const safeName = entry.text.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30) || "qr";
      a.download = `${safeName}.png`;
      a.href = canvas.toDataURL('image/png');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      document.body.removeChild(container);
    });
  };

  // Alternative: Use QRCodeCanvas to generate and download
  const downloadBatchQRAlt = (entry) => {
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.background = '#ffffff';
    container.style.padding = '20px';
    container.style.borderRadius = '12px';
    document.body.appendChild(container);

    try {
      // Use QRCodeCanvas to render
      const canvas = document.createElement('canvas');
      canvas.id = 'temp-qr-canvas';
      canvas.width = 300;
      canvas.height = 300;
      container.appendChild(canvas);

      // Since we can't use the component directly in JSX here,
      // we'll use a different approach with the QRCode library
      
      // Load the qrcode library dynamically
      import('qrcode').then((QRCode) => {
        QRCode.toCanvas(canvas, entry.qrData, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        }, (error) => {
          if (error) {
            console.error(error);
            document.body.removeChild(container);
            return;
          }
          const a = document.createElement('a');
          const safeName = entry.text.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30) || "qr";
          a.download = `${safeName}.png`;
          a.href = canvas.toDataURL('image/png');
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          document.body.removeChild(container);
        });
      }).catch(() => {
        // Fallback: Use the existing QR code display
        alert('Please install qrcode package: npm install qrcode');
        document.body.removeChild(container);
      });
    } catch (error) {
      console.error('Download failed:', error);
      document.body.removeChild(container);
    }
  };

  const downloadSelectedAsPdf = async () => {
    const selected = qrHistory.filter((item) => selectedQrs.includes(item.id));
    if (!selected.length) {
      alert('Please select at least one QR code to download as PDF.');
      return;
    }

    setIsPdfGenerating(true);

    try {
      if (!window.jspdf) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // Load qrcode library
      if (!window.QRCode) {
        const qrScript = document.createElement("script");
        qrScript.src = "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js";
        await new Promise((resolve, reject) => {
          qrScript.onload = resolve;
          qrScript.onerror = reject;
          document.body.appendChild(qrScript);
        });
      }

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const margin = 15;
      const usableWidth = pageWidth - (margin * 2);
      const itemsPerRow = 2;
      const qrSize = (usableWidth / itemsPerRow) - 5;
      const rowHeight = qrSize + 25;
      let x = margin;
      let y = margin + 10;

      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text('QR Codes', pageWidth / 2, margin + 5, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, margin + 12, { align: 'center' });
      y = margin + 22;

      for (let i = 0; i < selected.length; i++) {
        const entry = selected[i];
        const qrCanvas = document.createElement('canvas');
        
        // Use QRCode library to generate
        await new Promise((resolve) => {
          window.QRCode.toCanvas(qrCanvas, entry.qrData, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff'
            }
          }, (error) => {
            if (error) {
              console.error(error);
              resolve();
              return;
            }
            const imgData = qrCanvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', x + 2, y + 2, qrSize - 4, qrSize - 4);
            
            pdf.setFontSize(8);
            pdf.setTextColor(0);
            const displayText = entry.text.length > 25 
              ? entry.text.substring(0, 22) + '...' 
              : entry.text;
            pdf.text(displayText, x + (qrSize / 2), y + qrSize + 6, { align: 'center' });
            
            pdf.setFontSize(7);
            pdf.setTextColor(150);
            pdf.text(`#${String(i + 1).padStart(2, '0')}`, x + 2, y + qrSize + 6);

            if ((i + 1) % itemsPerRow === 0) {
              x = margin;
              y += rowHeight;
            } else {
              x += qrSize + 5;
            }

            if (y > 280) {
              pdf.addPage();
              y = margin + 10;
              x = margin;
            }

            resolve();
          });
        });
      }

      pdf.save('qr-codes.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const downloadSelectedAsZip = () => {
    const selected = qrHistory.filter((item) => selectedQrs.includes(item.id));
    if (!selected.length) {
      alert('Please select at least one QR code to download as ZIP.');
      return;
    }

    if (window.JSZip) {
      createZip(selected);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    script.onload = () => createZip(selected);
    script.onerror = () => alert("Unable to load ZIP library.");
    document.body.appendChild(script);
  };

  const createZip = async (items) => {
    try {
      // Load qrcode library
      if (!window.QRCode) {
        const qrScript = document.createElement("script");
        qrScript.src = "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js";
        await new Promise((resolve, reject) => {
          qrScript.onload = resolve;
          qrScript.onerror = reject;
          document.body.appendChild(qrScript);
        });
      }

      const zip = new window.JSZip();
      
      for (let i = 0; i < items.length; i++) {
        const entry = items[i];
        const qrCanvas = document.createElement('canvas');
        await new Promise((resolve) => {
          window.QRCode.toCanvas(qrCanvas, entry.qrData, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff'
            }
          }, (error) => {
            if (error) {
              console.error(error);
              resolve();
              return;
            }
            const imgData = qrCanvas.toDataURL('image/png').split(',')[1];
            const safeName = entry.text.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30) || "qr";
            const filename = `${String(i + 1).padStart(3, '0')}-${safeName}.png`;
            zip.file(filename, imgData, { base64: true });
            resolve();
          });
        });
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.download = "qr-codes.zip";
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("ZIP generation error:", error);
      alert("Failed to create ZIP.");
    }
  };

  const copyText = () => {
    if (!qrValue) return;
    navigator.clipboard.writeText(qrValue).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = qrValue;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleSelect = (id) => {
    setSelectedQrs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedQrs([]);
    } else {
      setSelectedQrs(qrHistory.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (qrHistory.length > 0 && selectedQrs.length === qrHistory.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedQrs, qrHistory]);

  const deleteSelected = () => {
    setQrHistory((prev) => prev.filter((item) => !selectedQrs.includes(item.id)));
    setSelectedQrs([]);
  };

  const deleteAll = () => {
    setQrHistory([]);
    setSelectedQrs([]);
    setSelectAll(false);
  };

  const clearAll = () => {
    setText("");
    setQrValue("");
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      generateQR();
    }
  };

  return (
    <div className="text-to-qr-page">
      <div className="text-to-qr-container">
        
        {/* SEO Friendly Header */}
        <header className="page-header">
          <div className="page-header-badge">
            <span className="badge-icon">✏️</span>
            Text to QR
          </div>
          <h1>Text to QR Code Generator</h1>
          <p className="page-subtitle">
            Convert any text, URL, UPI ID, or number into a QR code instantly.
            Perfect for sharing links, contact details, and more.
          </p>
          <div className="header-features">
            <span>✓ Live Preview</span>
            <span>✓ Batch QR</span>
            <span>✓ PDF Export</span>
            <span>✓ Free & Fast</span>
          </div>
        </header>

        {/* Input Section */}
        <div className="input-section">
          <div className="input-wrapper">
            <input
              type="text"
              className="text-input"
              placeholder="Enter text, URL, UPI ID, Number, or any data..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button 
              className="clear-input-btn"
              onClick={() => {
                setText("");
                setQrValue("");
                setError("");
              }}
              style={{ display: text ? 'flex' : 'none' }}
            >
              ✕
            </button>
          </div>
          <span className="input-hint">
            Press Enter to generate or start typing for live preview
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="actions">
          <button 
            className="generate-btn" 
            onClick={generateQR}
            disabled={!text.trim()}
          >
            <span>✨</span> Generate QR
          </button>
          <button 
            className="add-batch-btn"
            onClick={addToBatch}
            disabled={!qrValue}
          >
            <span>📦</span> Add to Batch
          </button>
          <button 
            className="clear-btn" 
            onClick={clearAll}
          >
            <span>🗑️</span> Clear
          </button>
        </div>

        {/* Live Preview Section */}
        <div className="preview-section">
          <div className="preview-header">
            <h3>🔵 Live Preview</h3>
            {qrValue && (
              <div className="preview-actions">
                <button 
                  className="preview-download-btn"
                  onClick={downloadQR}
                  disabled={isDownloading}
                >
                  {isDownloading ? '⏳' : '⬇'} Download PNG
                </button>
                <button 
                  className="preview-copy-btn"
                  onClick={copyText}
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
            )}
          </div>

          {qrValue ? (
            <div className="qr-preview-card">
              <div className="qr-wrapper">
                <QRCodeCanvas
                  id="text-qr"
                  value={qrValue}
                  size={280}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <div className="qr-text-value">
                <span className="value-label">Text</span>
                <span className="value-content">{qrValue}</span>
              </div>
            </div>
          ) : (
            <div className="preview-empty">
              <div className="empty-icon">📱</div>
              <p>Start typing to see live QR preview</p>
            </div>
          )}
        </div>

        {/* Batch History Section */}
        {qrHistory.length > 0 && (
          <div className="batch-section">
            <div className="batch-header">
              <div className="batch-title">
                <h3>📦 Batch QR Codes ({qrHistory.length})</h3>
                <span className="selected-count">{selectedQrs.length} selected</span>
              </div>
              <div className="batch-actions">
                <button 
                  className="batch-btn pdf"
                  onClick={downloadSelectedAsPdf}
                  disabled={selectedQrs.length === 0 || isPdfGenerating}
                >
                  {isPdfGenerating ? '⏳' : '📄'} PDF
                </button>
                <button 
                  className="batch-btn zip"
                  onClick={downloadSelectedAsZip}
                  disabled={selectedQrs.length === 0}
                >
                  ▣ ZIP
                </button>
                <button 
                  className="batch-btn delete"
                  onClick={deleteSelected}
                  disabled={selectedQrs.length === 0}
                >
                  ✕ Delete
                </button>
                <button 
                  className="batch-btn delete-all"
                  onClick={deleteAll}
                >
                  ✕ All
                </button>
              </div>
            </div>

            <div className="batch-controls">
              <label className="select-all-label">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
                Select All
              </label>
            </div>

            <div className="batch-grid">
              {qrHistory.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className={`batch-item ${selectedQrs.includes(entry.id) ? 'selected' : ''}`}
                >
                  <div className="batch-item-header">
                    <input
                      type="checkbox"
                      checked={selectedQrs.includes(entry.id)}
                      onChange={() => toggleSelect(entry.id)}
                    />
                    <span className="batch-item-number">#{String(index + 1).padStart(2, '0')}</span>
                    <button 
                      className="batch-item-download"
                      onClick={() => downloadBatchQR(entry)}
                      title="Download QR"
                    >
                      ⬇
                    </button>
                  </div>
                  <div className="batch-item-qr">
                    <QRCodeCanvas
                      value={entry.qrData}
                      size={120}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <div className="batch-item-text">
                    {entry.text.length > 30 ? entry.text.substring(0, 27) + '...' : entry.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="page-footer">
          <div className="footer-info-grid">
            <div className="footer-info-item">
              <span className="footer-info-icon">🔒</span>
              <div>
                <h4>100% Private</h4>
                <p>All data is processed locally in your browser. Nothing is stored on our servers.</p>
              </div>
            </div>
            <div className="footer-info-item">
              <span className="footer-info-icon">⚡</span>
              <div>
                <h4>Instant Generation</h4>
                <p>Generate QR codes in seconds with live preview and batch support.</p>
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
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Text to QR Generator. All rights reserved.</p>
            <p className="footer-made">Convert text to QR codes instantly</p>
          </div>
        </footer>

      </div>
    </div>
  );
}