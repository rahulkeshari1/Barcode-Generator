// BatchQR.jsx - WITH BULK QR FEATURES AND LIVE PREVIEW
import { useState, useEffect } from "react";
import QRGenerator from "../components/QRGenerator";
import "../App.css";

export default function BatchQR() {
  const [input, setInput] = useState("");
  const [items, setItems] = useState([]);
  const [liveItems, setLiveItems] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [pdfRowsPerPage, setPdfRowsPerPage] = useState(8);

  // Live preview - parse input on every change
  useEffect(() => {
    const timer = setTimeout(() => {
      const parsed = parseInput(input);
      setLiveItems(parsed);
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  const parseInput = (text) => {
    return [
      ...new Set(
        text
          .split(/[\s,\n\r\t,]+/)
          .map((item) => item.trim())
          .filter(Boolean)
      ),
    ];
  };

  const generateQRs = () => {
    const parsedItems = parseInput(input);
    if (parsedItems.length === 0) return;
    setItems(parsedItems);
    setSelectedItems(parsedItems.map((_, index) => index));
  };

  const clearAll = () => {
    setInput("");
    setItems([]);
    setLiveItems([]);
    setSelectedItems([]);
    setSelectAll(false);
  };

  const toggleSelect = (index) => {
    setSelectedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((_, i) => i));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (items.length > 0 && selectedItems.length === items.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, items]);

  const downloadSelectedAsPdf = async () => {
    if (selectedItems.length === 0) {
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

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const margin = 15;
      const usableWidth = pageWidth - (margin * 2);
      const itemsPerRow = 2;
      const qrSize = (usableWidth / itemsPerRow) - 5;
      const rowHeight = qrSize + 25;
      const maxRowsPerPage = 10;
      const actualRowsPerPage = Math.min(pdfRowsPerPage, maxRowsPerPage);
      const itemsPerPage = itemsPerRow * actualRowsPerPage;

      let x = margin, y = margin + 10;

      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Bulk QR Codes', pageWidth / 2, margin + 5, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, margin + 12, { align: 'center' });
      y = margin + 22;

      const selectedItemsData = items.filter((_, index) => selectedItems.includes(index));

      for (let i = 0; i < selectedItemsData.length; i++) {
        if (i > 0 && i % itemsPerPage === 0) {
          pdf.addPage();
          y = margin + 10;
          x = margin;
        }

        const value = selectedItemsData[i];
        const qrCanvas = document.createElement('canvas');
        
        await new Promise((resolve) => {
          import('qrcode').then((QRCode) => {
            QRCode.toCanvas(qrCanvas, value, {
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
              const displayText = value.length > 25 ? value.substring(0, 22) + '...' : value;
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
        });
      }

      pdf.save('bulk-qr-codes.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const downloadSelectedAsZip = () => {
    const selectedItemsData = items.filter((_, index) => selectedItems.includes(index));
    if (selectedItemsData.length === 0) {
      alert('Please select at least one QR code to download as ZIP.');
      return;
    }

    if (window.JSZip) {
      createZip(selectedItemsData);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    script.onload = () => createZip(selectedItemsData);
    script.onerror = () => alert("Unable to load ZIP library.");
    document.body.appendChild(script);
  };

  const createZip = async (itemsData) => {
    try {
      const zip = new window.JSZip();
      
      for (let i = 0; i < itemsData.length; i++) {
        const value = itemsData[i];
        const qrCanvas = document.createElement('canvas');
        await new Promise((resolve) => {
          import('qrcode').then((QRCode) => {
            QRCode.toCanvas(qrCanvas, value, {
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
              const safeName = value.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30) || 'qr';
              const filename = `${String(i + 1).padStart(3, '0')}-${safeName}.png`;
              zip.file(filename, imgData, { base64: true });
              resolve();
            });
          });
        });
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.download = "bulk-qr-codes.zip";
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("ZIP generation error:", error);
      alert("Failed to create ZIP.");
    }
  };

  const getSelectedCount = () => {
    return selectedItems.length;
  };

  return (
    <div className="bat-bulk-page">
      <div className="bat-bulk-container">
        
        {/* Header */}
        <header className="bat-bulk-header">
          <div className="bat-bulk-header-brand">
            <div className="bat-bulk-brand-icon">📦</div>
            <div>
              <h1 className="bat-bulk-title">Bulk QR Generator</h1>
              <p className="bat-bulk-subtitle">Generate multiple QR codes at once</p>
            </div>
          </div>
          <div className="bat-bulk-stats">
            <span className="bat-bulk-count">{items.length} generated</span>
          </div>
        </header>

        {/* Input Section */}
        <div className="bat-bulk-input-section">
          <label className="bat-bulk-input-label">
            <span>📝 Enter Values</span>
            <span className="bat-bulk-char-count">{input.split(/[\s,\n\r\t,]+/).filter(Boolean).length} items detected</span>
          </label>
          <textarea
            className="bat-bulk-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste values here...

Examples:
https://example.com
John Doe
product-123
order-456

Separate with comma, space, or new line`}
          />
          <div className="bat-bulk-input-hint">
            <span>💡 Separate values with comma, space, or new line</span>
            <span className="bat-bulk-live-count">Live: {liveItems.length} items</span>
          </div>
        </div>

        {/* Actions */}
        <div className="bat-bulk-actions">
          <button 
            className="bat-bulk-btn bat-bulk-btn-primary" 
            onClick={generateQRs}
            disabled={!input.trim()}
          >
            <span>✨</span> Generate QR Codes
          </button>
          <button 
            className="bat-bulk-btn bat-bulk-btn-danger" 
            onClick={clearAll}
            disabled={!input.trim() && items.length === 0}
          >
            <span>🗑️</span> Clear All
          </button>
        </div>

        {/* Total Count */}
        {items.length > 0 && (
          <div className="bat-bulk-total">
            <span>📚 Total QR Codes: <strong>{items.length}</strong></span>
            <span className="bat-bulk-selected">{getSelectedCount()} selected</span>
          </div>
        )}

        {/* Collection Controls */}
        {items.length > 0 && (
          <div className="bat-bulk-collection-controls">
            <div className="bat-bulk-left-controls">
              <label className="bat-bulk-select-all">
                <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                Select All
              </label>
            </div>
            <div className="bat-bulk-right-controls">
              <div className="bat-bulk-format-select">
                <select value={downloadFormat} onChange={(e) => setDownloadFormat(e.target.value)}>
                  <option value="png">PNG</option>
                  <option value="svg">SVG</option>
                </select>
              </div>
              <button 
                className="bat-bulk-col-btn bat-bulk-pdf-btn"
                onClick={downloadSelectedAsPdf}
                disabled={selectedItems.length === 0 || isPdfGenerating}
              >
                {isPdfGenerating ? '⏳' : '📄'} PDF
              </button>
              <button 
                className="bat-bulk-col-btn bat-bulk-zip-btn"
                onClick={downloadSelectedAsZip}
                disabled={selectedItems.length === 0}
              >
                ▣ ZIP
              </button>
              <div className="bat-bulk-pdf-rows">
                <label>Rows:</label>
                <select value={pdfRowsPerPage} onChange={(e) => setPdfRowsPerPage(Number(e.target.value))}>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* QR Grid */}
        <div className="bat-bulk-qr-grid">
          {items.length === 0 && liveItems.length === 0 && (
            <div className="bat-bulk-empty-state">
              <div className="bat-bulk-empty-icon">📦</div>
              <h3>No QR Codes Yet</h3>
              <p>Enter values above and click "Generate QR Codes"</p>
            </div>
          )}

          {items.length === 0 && liveItems.length > 0 && (
            <div className="bat-bulk-live-preview">
              <h4>🔵 Live Preview ({liveItems.length} items)</h4>
              <div className="bat-bulk-live-grid">
                {liveItems.slice(0, 12).map((item, index) => (
                  <div key={index} className="bat-bulk-live-item">
                    <div className="bat-bulk-live-qr">
                      <canvas id={`bat-live-${index}`}></canvas>
                    </div>
                    <span className="bat-bulk-live-value">{item}</span>
                  </div>
                ))}
                {liveItems.length > 12 && (
                  <div className="bat-bulk-live-more">
                    +{liveItems.length - 12} more...
                  </div>
                )}
              </div>
              <p className="bat-bulk-live-hint">Click "Generate QR Codes" to create full QR codes</p>
            </div>
          )}

          {items.length > 0 && (
            <div className="bat-bulk-qr-grid-inner">
              {items.map((item, index) => (
                <div 
                  key={index} 
                  className={`bat-bulk-qr-item ${selectedItems.includes(index) ? 'bat-bulk-selected' : ''}`}
                >
                  <div className="bat-bulk-qr-item-top">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(index)} 
                      onChange={() => toggleSelect(index)} 
                    />
                    <span className="bat-bulk-item-num">#{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="bat-bulk-qr-wrapper">
                    <QRGenerator items={[item]} />
                  </div>
                  <div className="bat-bulk-qr-item-bottom">
                    <span className="bat-bulk-item-value">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bat-bulk-footer">
          <div className="bat-bulk-footer-info">
            <span>🔒 100% Private - All processing done locally</span>
            <span>⚡ Fast & Free</span>
          </div>
          <p className="bat-bulk-footer-copy">© {new Date().getFullYear()} Bulk QR Generator</p>
        </footer>

      </div>
    </div>
  );
}