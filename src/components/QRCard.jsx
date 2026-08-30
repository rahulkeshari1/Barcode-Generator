import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCard({ value, index }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef(null);

  const downloadQR = (e) => {
    e.stopPropagation();
    setIsDownloading(true);
    
    // Get the canvas element
    const canvas = document.getElementById(`qr-${index}`);
    if (!canvas) {
      setIsDownloading(false);
      return;
    }
    
    try {
      const link = document.createElement("a");
      const safeName = value.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30);
      link.download = `qr-code-${index + 1}-${safeName}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
    
    setTimeout(() => setIsDownloading(false), 1000);
  };

  const copyValue = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    });
  };

  return (
    <div className="qr-card">
      <div className="qr-wrapper">
        <QRCodeCanvas
          id={`qr-${index}`}
          value={value}
          size={160}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={false}
          imageSettings={{
            src: "",
            height: 0,
            width: 0,
            excavate: false,
          }}
        />
      </div>
      <div className="qr-value" title={value}>
        {value.length > 25 ? value.substring(0, 25) + '...' : value}
      </div>
      <div className="qr-actions">
        <button 
          className="qr-download-btn" 
          onClick={downloadQR}
          disabled={isDownloading}
        >
          {isDownloading ? '⏳' : '⬇'} Download
        </button>
        <button className="qr-copy-btn" onClick={copyValue}>
          📋 Copy
        </button>
      </div>
    </div>
  );
}

