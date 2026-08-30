import { useState, useEffect, useRef, useCallback } from "react";
import "../App.css";

const BARCODE_TYPES = [
  {
    value: "CODE128",
    label: "Code 128",
    description: "",
    category: "General",
    icon: "▥",
    bcid: "code128",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
  },
  {
    value: "CODE128A",
    label: "Code 128 A",
    description: "Uppercase + control",
    category: "Code 128",
    icon: "A",
    bcid: "code128",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
    mode: "A",
  },
  {
    value: "CODE128B",
    label: "Code 128 B",
    description: "ASCII characters",
    category: "Code 128",
    icon: "B",
    bcid: "code128",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
    mode: "B",
  },
  {
    value: "CODE128C",
    label: "Code 128 C",
    description: "Numeric pairs",
    category: "Code 128",
    icon: "C",
    bcid: "code128",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
    mode: "C",
  },
  {
    value: "GS1128",
    label: "GS1-128",
    description: "Supply chain",
    category: "GS1",
    icon: "GS1",
    bcid: "gs1-128",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 12,
  },
  {
    value: "EAN13",
    label: "EAN-13",
    description: "Retail products",
    category: "Retail",
    icon: "13",
    bcid: "ean13",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
  },
  {
    value: "EAN8",
    label: "EAN-8",
    description: "Small retail products",
    category: "Retail",
    icon: "8",
    bcid: "ean8",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
  },
  {
    value: "UPCA",
    label: "UPC-A",
    description: "Retail / North America",
    category: "Retail",
    icon: "U",
    bcid: "upca",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
  },
  {
    value: "UPCE",
    label: "UPC-E",
    description: "Compact UPC",
    category: "Retail",
    icon: "U",
    bcid: "upce",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
  },
  {
    value: "ITF14",
    label: "ITF-14",
    description: "Cartons & cases",
    category: "Logistics",
    icon: "14",
    bcid: "itf14",
    height: 25,
    scale: 4,
    includetext: true,
    textsize: 13,
  },
  {
    value: "ITF",
    label: "ITF",
    description: "Interleaved 2 of 5",
    category: "Logistics",
    icon: "ITF",
    bcid: "interleaved2of5",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
  },
  {
    value: "CODE39",
    label: "Code 39",
    description: "Industrial / inventory",
    category: "General",
    icon: "39",
    bcid: "code39",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
  },
  {
    value: "CODE93",
    label: "Code 93",
    description: "Compact alphanumeric",
    category: "General",
    icon: "93",
    bcid: "code93",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
  },
  {
    value: "CODABAR",
    label: "Codabar",
    description: "Libraries / logistics",
    category: "General",
    icon: "CB",
    bcid: "rationalizedCodabar",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
  },
  {
    value: "MSI",
    label: "MSI",
    description: "Numeric inventory",
    category: "General",
    icon: "MSI",
    bcid: "msi",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
  },
  {
    value: "PHARMACODE",
    label: "Pharmacode",
    description: "Pharmaceutical",
    category: "Pharma",
    icon: "P",
    bcid: "pharmacode",
    height: 22,
    scale: 4,
    includetext: true,
    textsize: 13,
  },
];

export default function BarcodeGenerator() {
  const [inputText, setInputText] = useState("");
  const [barcodeType, setBarcodeType] = useState("CODE128");
  const [barcodes, setBarcodes] = useState([]);
  const [currentBarcode, setCurrentBarcode] = useState(null);
  const [scale, setScale] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [selectedBarcodes, setSelectedBarcodes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const scriptLoadedRef = useRef(false);
  const generateTimeout = useRef(null);

  /* =========================================================
     LOAD BWIP-JS
  ========================================================= */

  useEffect(() => {
    if (window.bwipjs) {
      scriptLoadedRef.current = true;
      setScriptLoaded(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[data-barcode-bwip="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      return () => {
        existingScript.removeEventListener("load", handleLoad);
      };
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/bwip-js@4.11.2/dist/bwip-js-min.js";
    script.async = true;
    script.dataset.barcodeBwip = "true";
    script.onload = handleLoad;
    script.onerror = () => {
      console.error("Unable to load bwip-js");
      setScriptLoaded(false);
      setErrorMessage("Barcode engine could not be loaded.");
    };
    document.body.appendChild(script);

    function handleLoad() {
      scriptLoadedRef.current = true;
      setScriptLoaded(true);
      setErrorMessage("");
    }

    return () => {
      if (generateTimeout.current) {
        clearTimeout(generateTimeout.current);
      }
    };
  }, []);

  /* =========================================================
     SELECTED TYPE
  ========================================================= */

  const selectedType = BARCODE_TYPES.find(
    (item) => item.value === barcodeType
  ) || BARCODE_TYPES[0];

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateBarcode = useCallback((text, type) => {
    const value = text.trim();
    if (!value) return { valid: false, message: "" };

    if (type === "EAN13" && !/^\d{12,13}$/.test(value)) {
      return { valid: false, message: "EAN-13 requires 12 or 13 digits." };
    }
    if (type === "EAN8" && !/^\d{7,8}$/.test(value)) {
      return { valid: false, message: "EAN-8 requires 7 or 8 digits." };
    }
    if (type === "UPCA" && !/^\d{11,12}$/.test(value)) {
      return { valid: false, message: "UPC-A requires 11 or 12 digits." };
    }
    if (type === "UPCE" && !/^\d{6,8}$/.test(value)) {
      return { valid: false, message: "UPC-E requires 6 to 8 digits." };
    }
    if (type === "ITF14" && !/^\d{13,14}$/.test(value)) {
      return { valid: false, message: "ITF-14 requires 13 or 14 digits." };
    }
    if (type === "CODE128C") {
      if (!/^\d+$/.test(value)) {
        return { valid: false, message: "Code 128 C accepts numeric data only." };
      }
      if (value.length % 2 !== 0) {
        return { valid: false, message: "Code 128 C requires an even number of digits." };
      }
    }
    if (type === "PHARMACODE" && !/^\d+$/.test(value)) {
      return { valid: false, message: "Pharmacode accepts numeric data only." };
    }

    return { valid: true, message: "" };
  }, []);

  /* =========================================================
     GENERATE BARCODE
  ========================================================= */

  const generateBarcode = useCallback(async (text, type, customScale = scale) => {
    if (!text.trim() || !scriptLoadedRef.current || !window.bwipjs) return null;

    const config = BARCODE_TYPES.find((item) => item.value === type) || BARCODE_TYPES[0];
    const validation = validateBarcode(text, type);
    if (!validation.valid) {
      setErrorMessage(validation.message);
      return null;
    }

    try {
      const canvas = document.createElement("canvas");
      const options = {
        bcid: config.bcid,
        text: text.trim(),
        scaleX: customScale,
        scaleY: customScale,
        height: config.height,
        includetext: config.includetext,
        textxalign: "center",
        backgroundcolor: "FFFFFF",
        barcolor: "000000",
        textcolor: "000000",
        paddingwidth: 12,
        paddingheight: 12,
        monochrome: true,
      };

      if (config.mode) options.mode = config.mode;
      if (config.includetext) {
        options.textsize = config.textsize;
        options.textfont = "Helvetica";
      }

      await window.bwipjs.toCanvas(canvas, options);
      const dataUrl = canvas.toDataURL("image/png");
      setErrorMessage("");

      return {
        id: Date.now() + Math.random() * 100000,
        value: text.trim(),
        type,
        dataUrl,
        label: config.label,
        category: config.category,
      };
    } catch (error) {
      console.error("Barcode generation error:", error);
      setErrorMessage(error?.message || "Unable to generate barcode.");
      return null;
    }
  }, [scale, validateBarcode]);

  /* =========================================================
     LIVE PREVIEW
  ========================================================= */

  useEffect(() => {
    if (generateTimeout.current) clearTimeout(generateTimeout.current);
    setErrorMessage("");

    if (!inputText.trim()) {
      setCurrentBarcode(null);
      setIsGenerating(false);
      return;
    }

    if (!scriptLoadedRef.current) return;

    const validation = validateBarcode(inputText, barcodeType);
    if (!validation.valid) {
      setCurrentBarcode(null);
      setErrorMessage(validation.message);
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    generateTimeout.current = setTimeout(async () => {
      const barcode = await generateBarcode(inputText, barcodeType, scale);
      setCurrentBarcode(barcode);
      setIsGenerating(false);
    }, 300);

    return () => {
      if (generateTimeout.current) clearTimeout(generateTimeout.current);
    };
  }, [inputText, barcodeType, scale, generateBarcode, validateBarcode]);

  /* =========================================================
     ADD BARCODE
  ========================================================= */

  const handleAddBarcode = () => {
    if (!currentBarcode) return;
    setBarcodes((prev) => [...prev, { ...currentBarcode, id: Date.now() + Math.random() * 100000 }]);
    setInputText("");
    setCurrentBarcode(null);
    // Auto-select the newly added barcode
    setSelectedBarcodes((prev) => [...prev, currentBarcode.id]);
  };

  /* =========================================================
     BATCH GENERATE
  ========================================================= */

  const handleBatchGenerate = async () => {
    if (!inputText.trim()) return;
    const items = inputText.split(/[,\n]+/).map((item) => item.trim()).filter(Boolean);
    if (!items.length) return;

    setIsLoading(true);
    setErrorMessage("");
    const generated = [];

    for (const item of items) {
      const barcode = await generateBarcode(item, barcodeType, scale);
      if (barcode) {
        generated.push(barcode);
        // Auto-select batch generated barcodes
        setSelectedBarcodes((prev) => [...prev, barcode.id]);
      }
      await new Promise((resolve) => setTimeout(resolve, 40));
    }

    if (generated.length) {
      setBarcodes((prev) => [...prev, ...generated]);
    }
    setInputText("");
    setCurrentBarcode(null);
    setIsLoading(false);
  };

  /* =========================================================
     SELECTION HANDLERS
  ========================================================= */

  const toggleSelect = (id) => {
    setSelectedBarcodes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedBarcodes([]);
    } else {
      setSelectedBarcodes(barcodes.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  // Update selectAll when selection changes
  useEffect(() => {
    if (barcodes.length > 0 && selectedBarcodes.length === barcodes.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedBarcodes, barcodes]);

  /* =========================================================
     DOWNLOAD
  ========================================================= */

  const downloadBarcode = (barcode) => {
    const safeValue = barcode.value.replace(/[^\w-]/g, "_");
    const link = document.createElement("a");
    link.download = `${safeValue}-${barcode.type}.png`;
    link.href = barcode.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* =========================================================
     DOWNLOAD SELECTED
  ========================================================= */

  const downloadSelected = () => {
    const selected = barcodes.filter((item) => selectedBarcodes.includes(item.id));
    if (!selected.length) return;

    selected.forEach((barcode, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        const safeValue = barcode.value.replace(/[^\w-]/g, "_");
        link.download = `${String(index + 1).padStart(3, "0")}-${safeValue}.png`;
        link.href = barcode.dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 250);
    });
  };

  /* =========================================================
     DOWNLOAD ALL
  ========================================================= */

  const downloadAll = () => {
    if (!barcodes.length) return;
    barcodes.forEach((barcode, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        const safeValue = barcode.value.replace(/[^\w-]/g, "_");
        link.download = `${String(index + 1).padStart(3, "0")}-${safeValue}.png`;
        link.href = barcode.dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 250);
    });
  };

  /* =========================================================
     DOWNLOAD AS PDF
  ========================================================= */

  const downloadAsPdf = async () => {
    const selected = barcodes.filter((item) => selectedBarcodes.includes(item.id));
    if (!selected.length) return;

    setIsPdfGenerating(true);

    try {
      // Load jsPDF dynamically
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
      const barcodeWidth = (usableWidth / itemsPerRow) - 5;
      const barcodeHeight = 45;
      const rowHeight = barcodeHeight + 15;
      let x = margin;
      let y = margin + 10;

      // Add title
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Linear Barcodes', pageWidth / 2, margin + 5, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, margin + 12, { align: 'center' });
      y = margin + 20;

      for (let i = 0; i < selected.length; i++) {
        const barcode = selected[i];
        const imgData = barcode.dataUrl;
        
        // Add barcode image
        pdf.addImage(imgData, 'PNG', x + 2, y + 2, barcodeWidth - 4, barcodeHeight - 10);
        
        // Add text below barcode
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        const displayText = barcode.value.length > 25 
          ? barcode.value.substring(0, 22) + '...' 
          : barcode.value;
        pdf.text(displayText, x + (barcodeWidth / 2), y + barcodeHeight - 2, { align: 'center' });
        
        // Add index
        pdf.setFontSize(7);
        pdf.setTextColor(150);
        pdf.text(`#${String(i + 1).padStart(2, '0')} - ${barcode.type}`, x + 2, y + barcodeHeight + 4);

        // Move to next position
        if ((i + 1) % itemsPerRow === 0) {
          x = margin;
          y += rowHeight;
        } else {
          x += barcodeWidth + 5;
        }

        // Add new page if needed
        if (y > 280) {
          pdf.addPage();
          y = margin + 10;
          x = margin;
        }
      }

      pdf.save('barcodes.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  /* =========================================================
     DOWNLOAD AS ZIP
  ========================================================= */

  const downloadAsZip = () => {
    const selected = barcodes.filter((item) => selectedBarcodes.includes(item.id));
    if (!selected.length) return;

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
      const zip = new window.JSZip();
      items.forEach((barcode, index) => {
        const imageData = barcode.dataUrl.split(",")[1];
        const safeValue = barcode.value.replace(/[^\w-]/g, "_");
        const filename = `${String(index + 1).padStart(3, "0")}-${safeValue}-${barcode.type}.png`;
        zip.file(filename, imageData, { base64: true });
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.download = "linear-barcodes.zip";
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

  /* =========================================================
     DELETE
  ========================================================= */

  const deleteBarcode = (id) => {
    setBarcodes((prev) => prev.filter((barcode) => barcode.id !== id));
    setSelectedBarcodes((prev) => prev.filter((item) => item !== id));
  };

  const deleteSelected = () => {
    setBarcodes((prev) => prev.filter((item) => !selectedBarcodes.includes(item.id)));
    setSelectedBarcodes([]);
  };

  /* =========================================================
     CLEAR ALL
  ========================================================= */

  const clearAll = () => {
    setBarcodes([]);
    setInputText("");
    setCurrentBarcode(null);
    setErrorMessage("");
    setSelectedBarcodes([]);
    setSelectAll(false);
  };

  /* =========================================================
     ICON
  ========================================================= */

  const getTypeIcon = (type) => {
    const found = BARCODE_TYPES.find((item) => item.value === type);
    return found?.icon || "▥";
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="barcode-page">
      <div className="barcode-container">

        {/* HEADER */}
        <header className="barcode-header">
          <div className="header-brand">
            <div className="brand-icon">▥</div>
            <div>
              <h1>Linear Barcode Generator</h1>
              <p>Create high-clarity 1D barcodes for products, inventory and logistics</p>
            </div>
          </div>
          <div className={scriptLoaded ? "status-badge ready" : "status-badge loading"}>
            <span className="status-dot" />
            {scriptLoaded ? "Generator Ready" : "Loading..."}
          </div>
        </header>

        {/* MAIN CARD */}
        <div className="generator-card">

          {/* CONTROLS */}
          <section className="controls-section">
            <div className="section-title">
              <div>
                <h2>Barcode Settings</h2>
                <p>Select a linear barcode format and enter your product or inventory data.</p>
              </div>
            </div>

            <div className="controls-grid">
              {/* BARCODE TYPE */}
              <div className="control-field">
                <label>Barcode Type</label>
                <div className="select-wrapper">
                  <select
                    value={barcodeType}
                    onChange={(e) => {
                      setBarcodeType(e.target.value);
                      setCurrentBarcode(null);
                      setErrorMessage("");
                    }}
                    disabled={isLoading}
                  >
                    <optgroup label="Code 128">
                      {BARCODE_TYPES.filter((item) => item.value.startsWith("CODE128")).map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label} — {item.description}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="GS1">
                      {BARCODE_TYPES.filter((item) => item.category === "GS1").map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label} — {item.description}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Retail">
                      {BARCODE_TYPES.filter((item) => item.category === "Retail").map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label} — {item.description}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Logistics">
                      {BARCODE_TYPES.filter((item) => item.category === "Logistics").map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label} — {item.description}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Other Linear">
                      {BARCODE_TYPES.filter(
                        (item) => ["General", "Pharma"].includes(item.category) && !item.value.startsWith("CODE128")
                      ).map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label} — {item.description}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
                <div className="field-hint">
                  <span className="hint-category">{selectedType.category}</span>
                  <span>{selectedType.description}</span>
                </div>
              </div>

              {/* SCALE */}
              <div className="control-field">
                <label>Barcode Quality</label>
                <div className="scale-options">
                  {[3, 4, 5, 6].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={scale === value ? "scale-option active" : "scale-option"}
                      onClick={() => setScale(value)}
                    >
                      <strong>
                        {value === 3 ? "Standard" : value === 4 ? "High" : value === 5 ? "Very High" : "Maximum"}
                      </strong>
                      <span>{value}×</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* INPUT */}
            <div className="input-section">
              <label>Barcode Data</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    barcodeType === "CODE128"
                      ? "Example: PROD-ABC-2026-001"
                      : barcodeType === "EAN13"
                      ? "Enter 12 or 13 digit EAN-13"
                      : barcodeType === "EAN8"
                      ? "Enter 7 or 8 digit EAN-8"
                      : barcodeType === "ITF14"
                      ? "Enter 13 or 14 digit ITF-14"
                      : barcodeType === "CODE128C"
                      ? "Enter even number of digits"
                      : "Enter barcode data"
                  }
                  disabled={isLoading}
                  autoComplete="off"
                  spellCheck="false"
                />
                {inputText && (
                  <button
                    type="button"
                    className="input-clear"
                    onClick={() => {
                      setInputText("");
                      setCurrentBarcode(null);
                      setErrorMessage("");
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="input-help">
                {barcodeType === "CODE128A" && <span>Code 128 A is intended for uppercase/control characters.</span>}
                {barcodeType === "CODE128B" && <span>Code 128 B supports the standard ASCII character set.</span>}
                {barcodeType === "CODE128C" && <span>Code 128 C efficiently encodes numeric digit pairs.</span>}
                {barcodeType === "GS1128" && <span>GS1-128 requires GS1-formatted application identifiers.</span>}
                {barcodeType === "EAN13" && <span>EAN-13 is a retail product barcode format.</span>}
                {barcodeType === "EAN8" && <span>EAN-8 is designed for smaller retail packages.</span>}
                {barcodeType === "ITF14" && <span>ITF-14 is commonly used for outer cases and cartons.</span>}
                {barcodeType === "CODE39" && <span>Code 39 is commonly used for industrial identification.</span>}
                {barcodeType === "PHARMACODE" && <span>Pharmacode is intended for pharmaceutical packaging.</span>}
              </div>
            </div>

            {/* ERROR */}
            {errorMessage && (
              <div className="validation-error">
                <span>!</span>
                {errorMessage}
              </div>
            )}
          </section>

          {/* PREVIEW */}
          <section className="preview-section">
            <div className="preview-header">
              <div>
                <h2>Live Preview</h2>
              </div>
              {currentBarcode && <div className="preview-status">● Ready</div>}
            </div>

            <div className="preview-box">
              {isGenerating && (
                <div className="preview-state">
                  <div className="spinner" />
                  <strong>Generating...</strong>
                  <span>Creating high-resolution linear barcode</span>
                </div>
              )}

              {!isGenerating && !currentBarcode && !inputText.trim() && (
                <div className="preview-state">
                  <div className="empty-barcode">▥</div>
                  <strong>Enter barcode data</strong>
                  <span>Code 128 is selected</span>
                </div>
              )}

              {!isGenerating && !currentBarcode && inputText.trim() && errorMessage && (
                <div className="preview-state error">
                  <div className="error-icon">!</div>
                  <strong>Invalid barcode</strong>
                  <span>{errorMessage}</span>
                </div>
              )}

              {currentBarcode && !isGenerating && (
                <div className="barcode-preview-content">
                  <div className="barcode-image-wrap">
                    <img src={currentBarcode.dataUrl} alt={currentBarcode.value} />
                  </div>
                  <div className="preview-info">
                    <div className="preview-main-info">
                      <span className="preview-code">{currentBarcode.value}</span>
                      <span className="preview-format">
                        {getTypeIcon(currentBarcode.type)} {selectedType.label}
                      </span>
                    </div>
                    <div className="preview-meta">
                      <span>
                        <strong>Type</strong>
                        {selectedType.label}
                      </span>
                      <span>
                        <strong>Category</strong>
                        {selectedType.category}
                      </span>
                      <span>
                        <strong>Scale</strong>
                        {scale}×
                      </span>
                    </div>
                    <button type="button" className="preview-add-btn" onClick={handleAddBarcode}>
                      ＋ Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="action-row">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddBarcode}
                disabled={!currentBarcode || isLoading}
              >
                <span>＋</span>
                Add Barcode
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBatchGenerate}
                disabled={!inputText.trim() || isLoading}
              >
                <span>▥</span>
                Generate Batch
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={clearAll}
                disabled={isLoading || (!barcodes.length && !inputText)}
              >
                <span>×</span>
                Clear
              </button>
            </div>
          </section>
        </div>

        {/* COLLECTION */}
        {barcodes.length > 0 && (
          <section className="collection-card">
            <div className="collection-header">
              <div>
                <h2>Barcode Collection</h2>
                <p>{barcodes.length} generated • {selectedBarcodes.length} selected</p>
              </div>
              <div className="collection-actions">
                <button
                  type="button"
                  className="collection-btn"
                  onClick={() => {
                    if (selectedBarcodes.length === 0) {
                      alert('Please select at least one barcode to download.');
                      return;
                    }
                    downloadSelected();
                  }}
                  disabled={selectedBarcodes.length === 0}
                >
                  ↓ Download Selected
                </button>
                <button
                  type="button"
                  className="collection-btn"
                  onClick={downloadAll}
                >
                  ↓ Download All
                </button>
                <button
                  type="button"
                  className="collection-btn pdf"
                  onClick={downloadAsPdf}
                  disabled={selectedBarcodes.length === 0 || isPdfGenerating}
                >
                  {isPdfGenerating ? '⏳' : '📄'} PDF
                </button>
                <button
                  type="button"
                  className="collection-btn zip"
                  onClick={downloadAsZip}
                  disabled={selectedBarcodes.length === 0}
                >
                  ▣ ZIP
                </button>
                <button
                  type="button"
                  className="collection-btn delete-selected"
                  onClick={deleteSelected}
                  disabled={selectedBarcodes.length === 0}
                >
                  × Delete Selected
                </button>
              </div>
            </div>

            <div className="barcode-grid-header">
              <label className="select-all-label">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
                Select All
              </label>
              <span className="grid-count">{barcodes.length} items</span>
            </div>

            <div className="barcode-grid">
              {barcodes.map((barcode, index) => (
                <div className="barcode-item" key={barcode.id}>
                  <div className="barcode-item-top">
                    <div className="item-select">
                      <input
                        type="checkbox"
                        checked={selectedBarcodes.includes(barcode.id)}
                        onChange={() => toggleSelect(barcode.id)}
                      />
                    </div>
                    <span className="item-number">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="item-format">
                      {getTypeIcon(barcode.type)} {barcode.type}
                    </span>
                  </div>

                  <div className="barcode-item-image">
                    <img src={barcode.dataUrl} alt={barcode.value} loading="lazy" />
                  </div>

                  <div className="barcode-item-bottom">
                    <div className="item-value">{barcode.value}</div>
                    <div className="item-actions">
                      <button type="button" title="Download" onClick={() => downloadBarcode(barcode)}>
                        ↓
                      </button>
                      <button type="button" className="delete" title="Delete" onClick={() => deleteBarcode(barcode.id)}>
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <div className="barcode-footer">
          <div>
            <strong>Linear 1D formats</strong>
          </div>
        </div>

      </div>
    </div>
  );
}