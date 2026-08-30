import { useState, useEffect, useRef } from "react";
import "../App.css";

export default function PasteArea({ 
  onImagePaste, 
  onTextPaste, 
  onImageUpload,
  isLoading 
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items || [];
      for (const item of items) {
        if (item.type.includes("image")) {
          const file = item.getAsFile();
          if (file) {
            onImagePaste(file);
          }
          return;
        }
      }
      const text = e.clipboardData?.getData("text");
      if (text && text.trim()) {
        onTextPaste(text);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [onImagePaste, onTextPaste]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    }
    e.target.value = ""; // Reset input
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`paste-box ${isDragging ? 'dragover' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="paste-content">
        <div className="paste-icon">📋</div>
        <h3>Paste or Upload Image</h3>
        <p>
          Press <kbd>Ctrl + V</kbd> to paste an image, 
          drag & drop, or click below to upload
        </p>
        <div className="paste-actions">
          <button 
            type="button" 
            className="upload-btn"
            onClick={triggerFileInput}
            disabled={isLoading}
          >
            <span>📁</span> Upload Image
          </button>
          <span className="paste-divider">or</span>
          <span className="paste-hint">
            <kbd>Ctrl + V</kbd> to paste
          </span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        {isLoading && (
          <div className="upload-loading">
            <span className="upload-spinner"></span>
            Reading image with OCR...
          </div>
        )}
      </div>
    </div>
  );
}