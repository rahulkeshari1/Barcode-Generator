import QRCard from "./QRCard";

export default function QRGenerator({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="qr-empty-state">
        <div className="qr-empty-icon">📱</div>
        <h4>No QR Codes Yet</h4>
        <p>Upload an image or paste text to generate QR codes</p>
      </div>
    );
  }

  return (
    <div className="qr-grid">
      {items.map((item, index) => (
        <QRCard key={`qr-${index}-${item.substring(0, 10)}`} value={item} index={index} />
      ))}
    </div>
  );
}
