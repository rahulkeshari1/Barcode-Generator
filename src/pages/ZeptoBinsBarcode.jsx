// ZeptoBinsBarcode.jsx - WITH MYN PREFIX AND ZEPS SUFFIX IN CLASS NAMES

import { useState, useEffect, useRef, useCallback } from "react";
import { jsPDF } from "jspdf";
import JSZip from "jszip";

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



const getTimestamp = () => {
  const now = new Date();

  const pad = (value) =>
    String(value).padStart(2, "0");

  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
  ].join("-") +
    "_" +
    [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join("-");
};

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};

const svgDataUrlToPng = (
  svgData,
  width = 1400
) =>
  new Promise((resolve, reject) => {
    const svgBlob = new Blob(
      [svgData],
      {
        type: "image/svg+xml;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(svgBlob);

    const image = new Image();

    image.onload = () => {
      try {
        const scale =
          width / image.naturalWidth;

        const canvas =
          document.createElement("canvas");

        canvas.width = width;
        canvas.height = Math.max(
          1,
          Math.round(
            image.naturalHeight * scale
          )
        );

        const ctx =
          canvas.getContext("2d");

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        );

        URL.revokeObjectURL(url);

        resolve(
          canvas.toDataURL(
            "image/png",
            1
          )
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          "Unable to convert barcode SVG."
        )
      );
    };

    image.src = url;
  });

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
  const [workerReady, setWorkerReady] = useState(false);

  const barcodeWorkerRef = useRef(null);
  const workerRequestRef = useRef(0);



  // Barcode worker for fast live preview
  useEffect(() => {
    const workerCode = `
      importScripts(
        "https://cdn.jsdelivr.net/npm/bwip-js@4.11.2/dist/bwip-js-min.js"
      );

      self.postMessage({ type: "ready" });

      self.onmessage = (event) => {
        const { id, text } = event.data;

        try {
          if (!text || !self.bwipjs) {
            throw new Error("Barcode generator is not ready.");
          }

          const svg = self.bwipjs.toSVG({
            bcid: "code128",
            text,
            scaleX: 4,
            scaleY: 4,
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

          self.postMessage({
            id,
            text,
            svgData: svg,
          });
        } catch (error) {
          self.postMessage({
            id,
            error: error?.message || "Barcode generation failed.",
          });
        }
      };
    `;

    const blob = new Blob(
      [workerCode],
      { type: "application/javascript" }
    );

    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    const handleWorkerReady = (event) => {
      if (event.data?.type === "ready") {
        setWorkerReady(true);
      }
    };

    worker.addEventListener("message", handleWorkerReady);

    barcodeWorkerRef.current = worker;

    return () => {
      worker.removeEventListener("message", handleWorkerReady);
      worker.terminate();
      barcodeWorkerRef.current = null;
      setWorkerReady(false);
      URL.revokeObjectURL(workerUrl);
    };
  }, []);

  const buildBarcodeText = useCallback(() => {

    if (useManualInput && manualInput.trim()) return manualInput.trim();

    let text = `${storePrefix}-${sectionA}-${sectionB}-${sectionC}-${sectionD}`;

    if (position !== "NONE") text += `-${position}`;

    return text;

  }, [storePrefix, sectionA, sectionB, sectionC, sectionD, position, useManualInput, manualInput]);



  // Instant live preview
  // Generate the barcode in the worker and display the SVG directly.
  // There is no debounce, no Canvas conversion and no Blob URL lifecycle
  // in the live-preview path.
  useEffect(() => {
    const text = buildBarcodeText();

    if (!text.trim()) {
      setCurrentBarcode(null);
      setIsGenerating(false);
      return;
    }

    const worker = barcodeWorkerRef.current;

    if (!worker || !workerReady) {
      return;
    }

    const requestId = ++workerRequestRef.current;

    // Keep the existing preview visible while the new barcode is generated.
    // This avoids the blank/loading flash when changing A/B/C/D/location.
    setIsGenerating(true);

    const handleMessage = (event) => {
      const { id, svgData, error } = event.data || {};

      // Ignore the worker's "ready" message and stale barcode responses.
      if (id !== requestId) {
        return;
      }

      worker.removeEventListener("message", handleMessage);

      if (error || !svgData) {
        console.error(
          "Barcode worker error:",
          error || "No SVG returned."
        );
        setIsGenerating(false);
        return;
      }

      // Direct SVG data URL. This is immediately usable by <img>.
      const svgDataUrl =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(svgData);

      const newBarcode = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now() + Math.random() * 100000,

        value: text,

        // Live preview uses SVG directly.
        dataUrl: svgDataUrl,

        // Keep original SVG for SVG/PDF/ZIP.
        svgData,

        // PNG is generated only when downloaded.
        downloadUrl: null,

        sectionA,
        sectionB,
        sectionC,
        sectionD,
        position,
        storePrefix,
      };

      setCurrentBarcode(newBarcode);
      setIsGenerating(false);
    };

    worker.addEventListener("message", handleMessage);

    // No timeout/debounce: send immediately.
    worker.postMessage({
      id: requestId,
      text,
    });

    return () => {
      worker.removeEventListener("message", handleMessage);
    };
  }, [
    buildBarcodeText,
    workerReady,
    storePrefix,
    sectionA,
    sectionB,
    sectionC,
    sectionD,
    position,
    useManualInput,
    manualInput,
  ]);

  // Generate PNG only when the user actually downloads it.
  const svgToPngDataUrl = useCallback((svgData, multiplier = 4) => {
    return new Promise((resolve, reject) => {
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });

      const url = URL.createObjectURL(svgBlob);
      const image = new Image();

      image.onload = () => {
        try {
          const canvas = document.createElement("canvas");

          canvas.width = image.naturalWidth * multiplier;
          canvas.height = image.naturalHeight * multiplier;

          const ctx = canvas.getContext("2d");

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.imageSmoothingEnabled = false;

          ctx.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
          );

          URL.revokeObjectURL(url);

          resolve(canvas.toDataURL("image/png", 1));
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };

      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to convert barcode to PNG."));
      };

      image.src = url;
    });
  }, []);

  const handleAddBarcode = () => {

    if (currentBarcode) {

      const newBarcode = { ...currentBarcode, id: Date.now() + Math.random() * 100000 };

      setBarcodes([...barcodes, newBarcode]);

      setSelectedBarcodes([...selectedBarcodes, newBarcode.id]);

    }

  };



  const downloadBarcode = useCallback(
    async (barcode, format = "png") => {
      if (!barcode) return;

      const fileName = barcode.value.replace(/-/g, "_");
      const link = document.createElement("a");

      try {
        if (format === "svg" && barcode.svgData) {
          const svgBlob = new Blob([barcode.svgData], {
            type: "image/svg+xml;charset=utf-8",
          });

          const url = URL.createObjectURL(svgBlob);

          link.href = url;
          link.download = `${fileName}.svg`;

          document.body.appendChild(link);
          link.click();
          link.remove();

          setTimeout(() => URL.revokeObjectURL(url), 1000);
          return;
        }

        // PNG is intentionally generated only at download time.
        const pngDataUrl = await svgToPngDataUrl(
          barcode.svgData,
          4
        );

        link.href = pngDataUrl;
        link.download = `${fileName}.png`;

        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Barcode download error:", error);
        alert("Failed to download barcode.");
      }
    },
    [svgToPngDataUrl]
  );

  const downloadSelectedAsPdf = useCallback(
    async () => {
      const selected = barcodes.filter(
        (item) =>
          selectedBarcodes.includes(item.id)
      );

      if (!selected.length) {
        alert("Select at least one barcode.");
        return;
      }

      setIsPdfGenerating(true);

      try {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: true,
        });

        const pageWidth = 210;
        const pageHeight = 297;

        const margin = 10;
        const gap = 2;
        const columns = 3;

        const cardWidth =
          (pageWidth -
            margin * 2 -
            gap * (columns - 1)) /
          columns;

        const cardHeight = 62;
        const rowGap = 2;

        let pageNumber = 1;
        let y = 28;
        let renderedCount = 0;

        const drawHeader = () => {
          const dateTime =
            new Date().toLocaleString();

          pdf.setFont(
            "helvetica",
            "normal"
          );

          pdf.setFontSize(8);
          pdf.setTextColor(
            120,
            119,
            140
          );

          pdf.text(
            dateTime,
            margin,
            15
          );

          pdf.text(
            `Page ${pageNumber}`,
            pageWidth - margin,
            15,
            {
              align: "right",
            }
          );

          pdf.setDrawColor(
            230,
            228,
            240
          );

          pdf.line(
            margin,
            19,
            pageWidth - margin,
            19
          );
        };

        drawHeader();

        for (
          let index = 0;
          index < selected.length;
          index++
        ) {
          const barcode =
            selected[index];

          if (!barcode?.svgData) {
            continue;
          }

          const column =
            renderedCount % columns;

          if (
            column === 0 &&
            renderedCount > 0
          ) {
            y +=
              cardHeight +
              rowGap;
          }

          if (
            column === 0 &&
            y + cardHeight >
              pageHeight - margin
          ) {
            pdf.addPage();

            pageNumber += 1;
            y = 28;

            drawHeader();
          }

          const x =
            margin +
            column *
              (cardWidth + gap);

          pdf.setDrawColor(
            230,
            228,
            240
          );

          pdf.setFillColor(
            255,
            255,
            255
          );

          pdf.roundedRect(
            x,
            y,
            cardWidth,
            cardHeight,
            3,
            3,
            "FD"
          );

          const pngImage =
            await svgDataUrlToPng(
              barcode.svgData,
              1400
            );

          const imageWidth =
            cardWidth - 10;

          const imageHeight = 31;

          pdf.addImage(
            pngImage,
            "PNG",
            x + 5,
            y + 4,
            imageWidth,
            imageHeight,
            undefined,
            "FAST"
          );

          renderedCount += 1;
        }

        if (renderedCount === 0) {
          throw new Error(
            "No valid barcodes are available for the PDF."
          );
        }

        const pdfBlob =
          pdf.output("blob");

        downloadBlob(
          pdfBlob,
          `store-bins-barcodes-${getTimestamp()}.pdf`
        );
      } catch (error) {
        console.error(
          "PDF generation error:",
          error
        );

        alert(
          error?.message ||
            "Failed to generate PDF. Please try again."
        );
      } finally {
        setIsPdfGenerating(false);
      }
    },
    [barcodes, selectedBarcodes]
  );

  const downloadSelectedAsZip = async () => {
    const selected = barcodes.filter(
      (item) =>
        selectedBarcodes.includes(item.id)
    );

    if (!selected.length) {
      alert("Select at least one barcode.");
      return;
    }

    try {
      const zip = new JSZip();

      const format =
        downloadFormat === "svg"
          ? "svg"
          : "png";

      const pendingZipTasks = [];

      selected.forEach(
        (barcode, index) => {
          const safeName =
            barcode.value.replace(
              /[^\w-]/g,
              "_"
            );

          if (
            format === "svg" &&
            barcode.svgData
          ) {
            zip.file(
              `${String(
                index + 1
              ).padStart(
                3,
                "0"
              )}-${safeName}.svg`,
              barcode.svgData
            );
          } else {
            const addPngToZip = async () => {
              const pngDataUrl = await svgToPngDataUrl(
                barcode.svgData,
                4
              );

              const imageData = pngDataUrl.split(",")[1];

              zip.file(
                `${String(
                  index + 1
                ).padStart(
                  3,
                  "0"
                )}-${safeName}.png`,
                imageData,
                {
                  base64: true,
                }
              );
            };

            pendingZipTasks.push(addPngToZip());
          }
        }
      );

      await Promise.all(pendingZipTasks);

      const content =
        await zip.generateAsync({
          type: "blob",
        });

      downloadBlob(
        content,
        `store-bins-barcodes-${getTimestamp()}.zip`
      );
    } catch (error) {
      console.error(
        "ZIP generation error:",
        error
      );

      alert(
        "Failed to create ZIP."
      );
    }
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



  const previewSvgStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

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

              {!currentBarcode && !workerReady && (
                <div className="preview-loading-zeps">
                  <div className="spinner-zeps"></div>
                  <span>Loading barcode engine...</span>
                </div>
              )}

              {isGenerating && currentBarcode && (
                <div className="preview-generating-badge-zeps">
                  Updating…
                </div>
              )}

              {isGenerating && !currentBarcode && (
                <div className="preview-loading-zeps">
                  <div className="spinner-zeps"></div>
                  <span>Generating...</span>
                </div>
              )}



              {currentBarcode && !isGenerating && (

                <div className="preview-content-zeps">

                  <div
                    className="preview-barcode-large-zeps preview-barcode-svg-zeps"
                    role="img"
                    aria-label={`Barcode preview for ${currentBarcode.value}`}
                    dangerouslySetInnerHTML={{ __html: currentBarcode.svgData }}
                    style={previewSvgStyle}
                  />

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