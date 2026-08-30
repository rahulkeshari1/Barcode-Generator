// ZeptoBinsBarcode.jsx - WITH MYN PREFIX AND ZEPS SUFFIX IN CLASS NAMES
import { useState, useEffect, useRef, useCallback } from "react";
import "../App.css";

const BIN_TYPES = [
  { value: "A", label: "A" }, { value: "B", label: "B" }, { value: "C", label: "C" },
  { value: "D", label: "D" }, { value: "E", label: "E" }, { value: "F", label: "F" },
  { value: "G", label: "G" }, { value: "H", label: "H" }, { value: "I", label: "I" },
  { value: "J", label: "J" }, { value: "K", label: "K" }, { value: "L", label: "L" },
  { value: "M", label: "M" }, { value: "N", label: "N" }, { value: "O", label: "O" },
  { value: "P", label: "P" }, { value: "Q", label: "Q" }, { value: "R", label: "R" },
  { value: "S", label: "S" }, { value: "T", label: "T" }, { value: "U", label: "U" },
  { value: "V", label: "V" }, { value: "W", label: "W" }, { value: "X", label: "X" },
  { value: "Y", label: "Y" }, { value: "Z", label: "Z" },
];

const POSITIONS = [
  { value: "BACK", label: "Back", icon: "🔙" },
  { value: "FRONT", label: "Front", icon: "🔜" },
  { value: "NONE", label: "None", icon: "➖" },
];

const SECTION_B = Array.from({ length: 30 }, (_, i) => i + 1);
const SECTION_D = Array.from({ length: 10 }, (_, i) => i + 1);

export default function ZeptoBinsBarcode() {
  const [storePrefix, setStorePrefix] = useState("MYN");
  const [sectionA, setSectionA] = useState("A");
  const [sectionB, setSectionB] = useState(1);
  const [sectionC, setSectionC] = useState("A");
  const [sectionD, setSectionD] = useState(1);
  const [position, setPosition] = useState("NONE");
  const [barcodes, setBarcodes] = useState([]);
  const [currentBarcode, setCurrentBarcode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [useManualInput, setUseManualInput] = useState(false);
  const [selectedBarcodes, setSelectedBarcodes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [pdfRowsPerPage, setPdfRowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const scriptLoaded = useRef(false);
  const generateTimeout = useRef(null);

  // Load bwip-js
  useEffect(() => {
    if (!scriptLoaded.current) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/bwip-js@4.11.2/dist/bwip-js-min.js";
      script.async = true;
      script.onload = () => { scriptLoaded.current = true; };
      script.onerror = () => { console.error("Failed to load bwip-js"); };
      document.body.appendChild(script);
      return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
      };
    }
  }, []);

  // Generate barcode
  const generateBarcode = useCallback(async (text) => {
    if (!text.trim() || !scriptLoaded.current || !window.bwipjs) return null;

    try {
      const canvas = document.createElement("canvas");
      await window.bwipjs.toCanvas(canvas, {
        bcid: "code128",
        text: text,
        scaleX: 6,
        scaleY: 6,
        height: 32,
        includetext: true,
        textxalign: "center",
        backgroundcolor: "FFFFFF",
        barcolor: "000000",
        textcolor: "000000",
        paddingwidth: 25,
        paddingheight: 25,
        textsize: 20,
        textfont: "Helvetica",
        monochrome: true,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const downloadCanvas = document.createElement("canvas");
      const ctx = downloadCanvas.getContext("2d");
      const multiplier = 4;
      downloadCanvas.width = canvas.width * multiplier;
      downloadCanvas.height = canvas.height * multiplier;
      ctx.scale(multiplier, multiplier);
      ctx.drawImage(canvas, 0, 0);
      const downloadUrl = downloadCanvas.toDataURL("image/png", 1.0);

      let svgData = null;
      try {
        const svgCanvas = document.createElement("canvas");
        svgCanvas.width = canvas.width;
        svgCanvas.height = canvas.height;
        const svgCtx = svgCanvas.getContext("2d");
        svgCtx.drawImage(canvas, 0, 0);
        const imgData = svgCtx.getImageData(0, 0, svgCanvas.width, svgCanvas.height);
        let svgBars = '';
        const data = imgData.data;
        let inBar = false, barStart = 0;
        for (let x = 0; x < svgCanvas.width; x++) {
          const idx = (Math.floor(svgCanvas.height/2) * svgCanvas.width + x) * 4;
          const isBlack = data[idx] < 128;
          if (isBlack && !inBar) { inBar = true; barStart = x; }
          else if (!isBlack && inBar) {
            svgBars += `<rect x="${barStart}" y="0" width="${x - barStart}" height="${svgCanvas.height}" fill="black"/>\n`;
            inBar = false;
          }
        }
        if (inBar) svgBars += `<rect x="${barStart}" y="0" width="${svgCanvas.width - barStart}" height="${svgCanvas.height}" fill="black"/>\n`;
        svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgCanvas.width}" height="${svgCanvas.height}" viewBox="0 0 ${svgCanvas.width} ${svgCanvas.height}">
          <rect width="${svgCanvas.width}" height="${svgCanvas.height}" fill="white"/>
          ${svgBars}
          <text x="${svgCanvas.width/2}" y="${svgCanvas.height - 10}" text-anchor="middle" font-family="Helvetica" font-size="16" fill="black">${text}</text>
        </svg>`;
      } catch (e) { console.warn("SVG generation failed:", e); }

      return {
        id: Date.now() + Math.random() * 100000,
        value: text,
        dataUrl,
        downloadUrl,
        svgData,
        sectionA,
        sectionB,
        sectionC,
        sectionD,
        position,
        storePrefix,
      };
    } catch (error) {
      console.error("Barcode generation error:", error);
      return null;
    }
  }, [sectionA, sectionB, sectionC, sectionD, position, storePrefix]);

  const buildBarcodeText = useCallback(() => {
    if (useManualInput && manualInput.trim()) return manualInput.trim();
    let text = `${storePrefix}-${sectionA}-${sectionB}-${sectionC}-${sectionD}`;
    if (position !== "NONE") text += `-${position}`;
    return text;
  }, [storePrefix, sectionA, sectionB, sectionC, sectionD, position, useManualInput, manualInput]);

  useEffect(() => {
    if (generateTimeout.current) clearTimeout(generateTimeout.current);
    const text = buildBarcodeText();
    if (text.trim() && scriptLoaded.current) {
      setIsGenerating(true);
      generateTimeout.current = setTimeout(async () => {
        const barcode = await generateBarcode(text);
        if (barcode) setCurrentBarcode(barcode);
        setIsGenerating(false);
      }, 200);
    } else {
      setCurrentBarcode(null);
      setIsGenerating(false);
    }
    return () => { if (generateTimeout.current) clearTimeout(generateTimeout.current); };
  }, [storePrefix, sectionA, sectionB, sectionC, sectionD, position, useManualInput, manualInput, generateBarcode, buildBarcodeText]);

  const handleAddBarcode = () => {
    if (currentBarcode) {
      const newBarcode = { ...currentBarcode, id: Date.now() + Math.random() * 100000 };
      setBarcodes([...barcodes, newBarcode]);
      setSelectedBarcodes([...selectedBarcodes, newBarcode.id]);
    }
  };

  const downloadBarcode = (barcode, format = "png") => {
    const link = document.createElement("a");
    const fileName = barcode.value.replace(/-/g, '_');
    if (format === "svg" && barcode.svgData) {
      link.download = `${fileName}.svg`;
      link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(barcode.svgData);
    } else {
      link.download = `${fileName}.${format}`;
      link.href = format === "png" ? (barcode.downloadUrl || barcode.dataUrl) : barcode.dataUrl;
    }
    link.click();
  };

  const downloadSelectedAsPdf = async () => {
    const selected = barcodes.filter(item => selectedBarcodes.includes(item.id));
    if (!selected.length) return alert('Select at least one barcode.');

    setIsPdfGenerating(true);

    try {
      if (!window.jspdf) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        await new Promise((resolve, reject) => { script.onload = resolve; script.onerror = reject; document.body.appendChild(script); });
      }

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const margin = 15;
      const usableWidth = pageWidth - (margin * 2);
      
      const itemsPerRow = 2;
      const barcodeWidth = (usableWidth / itemsPerRow) - 5;
      const barcodeHeight = 55;
      const rowHeight = barcodeHeight + 22;
      const maxRowsPerPage = 10;
      const actualRowsPerPage = Math.min(pdfRowsPerPage, maxRowsPerPage);
      const itemsPerPage = itemsPerRow * actualRowsPerPage;

      let x = margin, y = margin + 10;
      let pageCount = 0;

      for (let i = 0; i < selected.length; i++) {
        if (i > 0 && i % itemsPerPage === 0) {
          pdf.addPage();
          pageCount++;
          y = margin + 10;
          x = margin;
        }

        const barcode = selected[i];
        const imgData = barcode.downloadUrl || barcode.dataUrl;
        
        pdf.addImage(imgData, 'PNG', x + 2, y + 2, barcodeWidth - 4, barcodeHeight - 10);
        
        pdf.setFontSize(7);
        pdf.setTextColor(0);
        const displayText = barcode.value.length > 28 ? barcode.value.substring(0, 25) + '...' : barcode.value;
        pdf.text(displayText, x + (barcodeWidth / 2), y + barcodeHeight + 4, { align: 'center' });
        
        pdf.setFontSize(6);
        pdf.setTextColor(150);
        pdf.text(`#${String(i + 1).padStart(2, '0')}`, x + 2, y + barcodeHeight + 4);

        if ((i + 1) % itemsPerRow === 0) {
          x = margin;
          y += rowHeight;
        } else {
          x += barcodeWidth + 5;
        }
      }

      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(7);
        pdf.setTextColor(180);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 290, { align: 'center' });
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin, 290, { align: 'right' });
        pdf.text(`${selected.length} barcodes`, margin, 290);
      }

      pdf.save('store-bins-barcodes.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const downloadSelectedAsZip = () => {
    const selected = barcodes.filter(item => selectedBarcodes.includes(item.id));
    if (!selected.length) return alert('Select at least one barcode.');

    if (window.JSZip) { createZip(selected); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    script.onload = () => createZip(selected);
    script.onerror = () => alert("Unable to load ZIP library.");
    document.body.appendChild(script);
  };

  const createZip = async (items) => {
    try {
      const zip = new window.JSZip();
      const format = downloadFormat === "svg" ? "svg" : "png";
      
      items.forEach((barcode, index) => {
        if (format === "svg" && barcode.svgData) {
          zip.file(`${String(index + 1).padStart(3, '0')}-${barcode.value.replace(/[^\w-]/g, '_')}.svg`, barcode.svgData);
        } else {
          const imageData = (barcode.downloadUrl || barcode.dataUrl).split(',')[1];
          zip.file(`${String(index + 1).padStart(3, '0')}-${barcode.value.replace(/[^\w-]/g, '_')}.png`, imageData, { base64: true });
        }
      });
      
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.download = `store-bins-barcodes.${format === "svg" ? "svg" : "zip"}`;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { alert("Failed to create ZIP."); }
  };

  const downloadAll = () => {
    if (barcodes.length === 0) return;
    const filtered = searchTerm ? barcodes.filter(b => b.value.includes(searchTerm.toUpperCase())) : barcodes;
    filtered.forEach((barcode, index) => {
      setTimeout(() => downloadBarcode(barcode, downloadFormat), index * 250);
    });
  };

  const clearAll = () => {
    setBarcodes([]);
    setCurrentBarcode(null);
    setManualInput("");
    setSelectedBarcodes([]);
    setSelectAll(false);
    setSearchTerm("");
  };

  const deleteBarcode = (id) => {
    setBarcodes(barcodes.filter(b => b.id !== id));
    setSelectedBarcodes(selectedBarcodes.filter(sid => sid !== id));
  };

  const deleteSelected = () => {
    setBarcodes(barcodes.filter(item => !selectedBarcodes.includes(item.id)));
    setSelectedBarcodes([]);
    setSelectAll(false);
  };

  const toggleSelect = (id) => {
    setSelectedBarcodes(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const filtered = searchTerm ? barcodes.filter(b => b.value.includes(searchTerm.toUpperCase())) : barcodes;
    const filteredIds = filtered.map(b => b.id);
    const allSelected = filteredIds.every(id => selectedBarcodes.includes(id));
    
    if (allSelected) {
      setSelectedBarcodes(selectedBarcodes.filter(id => !filteredIds.includes(id)));
    } else {
      const newSelected = [...new Set([...selectedBarcodes, ...filteredIds])];
      setSelectedBarcodes(newSelected);
    }
  };

  useEffect(() => {
    const filtered = searchTerm ? barcodes.filter(b => b.value.includes(searchTerm.toUpperCase())) : barcodes;
    if (filtered.length > 0 && filtered.every(b => selectedBarcodes.includes(b.id))) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedBarcodes, barcodes, searchTerm]);

  const parseManualInput = (input) => {
    const parts = input.split('-');
    if (parts.length >= 4) {
      setStorePrefix(parts[0]);
      setSectionA(parts[1]?.toUpperCase() || "A");
      setSectionB(parseInt(parts[2]) || 1);
      setSectionC(parts[3]?.toUpperCase() || "A");
      setSectionD(parseInt(parts[4]) || 1);
      setPosition(parts[5]?.toUpperCase() === "BACK" || parts[5]?.toUpperCase() === "FRONT" ? parts[5].toUpperCase() : "NONE");
    }
  };

  const getCurrentText = buildBarcodeText();
  const filteredBarcodes = searchTerm ? barcodes.filter(b => b.value.includes(searchTerm.toUpperCase())) : barcodes;

  return (
    <div className="zepto-bins-page-zeps">
      <div className="zepto-container-zeps">
        {/* Header */}
        <header className="zepto-header-zeps">
          <div className="header-brand-zeps">
            <div className="brand-icon-zeps">🏪</div>
            <div>
              <h1 className="header-title-zeps">Store Bins</h1>
              <p className="header-sub-zeps">Generate bin barcodes</p>
            </div>
          </div>
          <div className="format-display-zeps">
            <code className="format-code-zeps">{getCurrentText}</code>
          </div>
        </header>

        <div className="zepto-main-zeps">
          {/* Row 1: Store Prefix */}
          <div className="controls-row-zeps row-prefix-zeps">
            <label className="row-label-zeps">Store Prefix</label>
            <input
              type="text"
              value={storePrefix}
              onChange={(e) => setStorePrefix(e.target.value.toUpperCase())}
              className="prefix-input-big-zeps"
              maxLength={5}
              placeholder="MYN"
            />
            <span className="prefix-hint-zeps">Default: MYN</span>
          </div>

          {/* Row 2: A B C D */}
          <div className="controls-row-zeps row-abcd-zeps">
            <div className="control-group-zeps">
              <label className="control-label-zeps">A</label>
              <select value={sectionA} onChange={(e) => { setSectionA(e.target.value); setUseManualInput(false); }} className="big-select-zeps">
                {BIN_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="control-group-zeps">
              <label className="control-label-zeps">B</label>
              <select value={sectionB} onChange={(e) => { setSectionB(Number(e.target.value)); setUseManualInput(false); }} className="big-select-zeps">
                {SECTION_B.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="control-group-zeps">
              <label className="control-label-zeps">C</label>
              <select value={sectionC} onChange={(e) => { setSectionC(e.target.value); setUseManualInput(false); }} className="big-select-zeps">
                {BIN_TYPES.slice(0, 15).map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="control-group-zeps">
              <label className="control-label-zeps">D</label>
              <select value={sectionD} onChange={(e) => { setSectionD(Number(e.target.value)); setUseManualInput(false); }} className="big-select-zeps">
                {SECTION_D.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Row 3: Position */}
          <div className="controls-row-zeps row-position-zeps">
            <label className="row-label-zeps">Position</label>
            <div className="position-btns-row-zeps">
              {POSITIONS.map(p => (
                <button
                  key={p.value}
                  className={`pos-btn-big-zeps ${position === p.value ? 'active-zeps' : ''}`}
                  onClick={() => { setPosition(p.value); setUseManualInput(false); }}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Manual Input + Enter Location */}
          <div className="controls-row-zeps row-manual-zeps">
            <div className="manual-group-zeps">
              <label className="manual-label-zeps">Enter Location</label>
              <input
                type="text"
                value={manualInput}
                onChange={(e) => { setManualInput(e.target.value.toUpperCase()); parseManualInput(e.target.value.toUpperCase()); }}
                placeholder="MYN-A-1-A-1"
                className="manual-input-big-zeps"
              />
              <button 
                className={`manual-toggle-big-zeps ${useManualInput ? 'active-zeps' : ''}`}
                onClick={() => setUseManualInput(!useManualInput)}
              >
                {useManualInput ? '🔒' : '🔓'}
              </button>
            </div>
            <div className="action-buttons-zeps">
              <button className="btn-add-zeps" onClick={handleAddBarcode} disabled={!currentBarcode}>
                ➕ Add
              </button>
              <button className="btn-clear-big-zeps" onClick={clearAll} disabled={barcodes.length === 0}>
                🗑 Clear
              </button>
            </div>
          </div>

          {/* Row 5: Barcode Preview */}
          <div className="preview-section-zeps">
            <div className="preview-box-zeps">
              {isGenerating && (
                <div className="preview-loading-zeps">
                  <div className="spinner-zeps"></div>
                  <span>Generating...</span>
                </div>
              )}

              {currentBarcode && !isGenerating && (
                <div className="preview-content-zeps">
                  <div className="preview-barcode-large-zeps">
                    <img src={currentBarcode.dataUrl} alt={currentBarcode.value} />
                  </div>
                  <div className="preview-info-zeps">
                    <div className="preview-value-zeps">{currentBarcode.value}</div>
                    <div className="preview-actions-btns-zeps">
                      <button className="preview-btn-zeps png-zeps" onClick={() => downloadBarcode(currentBarcode, "png")}>
                        ⬇ PNG
                      </button>
                      {currentBarcode.svgData && (
                        <button className="preview-btn-zeps svg-zeps" onClick={() => downloadBarcode(currentBarcode, "svg")}>
                          📐 SVG
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!currentBarcode && !isGenerating && (
                <div className="preview-empty-zeps">
                  <div className="empty-icon-zeps">🏪</div>
                  <p>Select bin location</p>
                  <span>Barcode preview will appear here</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="actions-section-zeps">
            <div className="actions-row-zeps">
              <button className="action-btn-zeps primary-zeps" onClick={handleAddBarcode} disabled={!currentBarcode}>
                ➕ Add to Collection
              </button>
              <button className="action-btn-zeps secondary-zeps" onClick={() => downloadBarcode(currentBarcode, "png")} disabled={!currentBarcode}>
                ⬇ PNG
              </button>
              {currentBarcode?.svgData && (
                <button className="action-btn-zeps secondary-zeps" onClick={() => downloadBarcode(currentBarcode, "svg")} disabled={!currentBarcode}>
                  📐 SVG
                </button>
              )}
              <button className="action-btn-zeps danger-zeps" onClick={clearAll} disabled={barcodes.length === 0}>
                🗑 Clear All
              </button>
            </div>
          </div>

          {/* Collection */}
          {barcodes.length > 0 && (
            <div className="collection-section-zeps">
              <div className="collection-header-zeps">
                <div className="collection-info-zeps">
                  <span>📚 {barcodes.length}</span>
                  <span className="selected-count-zeps">{selectedBarcodes.length} selected</span>
                </div>
                <div className="collection-actions-zeps">
                  <button className="col-btn-zeps pdf-zeps" onClick={downloadSelectedAsPdf} disabled={selectedBarcodes.length === 0 || isPdfGenerating}>
                    {isPdfGenerating ? '⏳' : '📄'} PDF
                  </button>
                  <button className="col-btn-zeps zip-zeps" onClick={downloadSelectedAsZip} disabled={selectedBarcodes.length === 0}>
                    ▣ ZIP
                  </button>
                  <button className="col-btn-zeps del-zeps" onClick={deleteSelected} disabled={selectedBarcodes.length === 0}>
                    ✕ Delete
                  </button>
                </div>
              </div>

              <div className="collection-controls-zeps">
                <div className="left-controls-zeps">
                  <label className="select-all-zeps">
                    <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                    Select All
                  </label>
                  <div className="search-box-zeps">
                    <input
                      type="text"
                      placeholder="🔍 Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                      className="search-input-zeps"
                    />
                  </div>
                </div>
                <div className="right-controls-zeps">
                  <div className="format-select-zeps">
                    <select value={downloadFormat} onChange={(e) => setDownloadFormat(e.target.value)}>
                      <option value="png">PNG</option>
                      <option value="svg">SVG</option>
                    </select>
                    <button className="download-all-btn-zeps" onClick={downloadAll}>⬇ All</button>
                  </div>
                  <div className="pdf-rows-select-zeps">
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

              <div className="barcode-grid-large-zeps">
                {filteredBarcodes.map((barcode, index) => (
                  <div key={barcode.id} className={`barcode-item-large-zeps ${selectedBarcodes.includes(barcode.id) ? 'selected-zeps' : ''}`}>
                    <div className="barcode-item-top-zeps">
                      <input type="checkbox" checked={selectedBarcodes.includes(barcode.id)} onChange={() => toggleSelect(barcode.id)} />
                      <span className="item-num-zeps">#{index + 1}</span>
                      <span className="item-value-display-zeps">{barcode.value}</span>
                    </div>
                    <div className="barcode-item-image-large-zeps">
                      <img src={barcode.dataUrl} alt={barcode.value} loading="lazy" />
                    </div>
                    <div className="barcode-item-bottom-zeps">
                      <div className="item-parts-zeps">
                        <span>{barcode.storePrefix}</span>
                        <span>A:{barcode.sectionA}</span>
                        <span>B:{barcode.sectionB}</span>
                        <span>C:{barcode.sectionC}</span>
                        <span>D:{barcode.sectionD}</span>
                        {barcode.position !== "NONE" && <span>{barcode.position}</span>}
                      </div>
                      <div className="item-actions-zeps">
                        <button onClick={() => downloadBarcode(barcode, "png")} title="PNG">📷</button>
                        {barcode.svgData && (
                          <button onClick={() => downloadBarcode(barcode, "svg")} title="SVG">📐</button>
                        )}
                        <button className="delete-zeps" onClick={() => deleteBarcode(barcode.id)}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}