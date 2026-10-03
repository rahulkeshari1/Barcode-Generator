import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { jsPDF } from "jspdf";
import JSZip from "jszip";

import "../App.css";
import "./bar.css";

/* =========================================================
   CONFIG
========================================================= */

const BWIP_URL =
  "https://cdn.jsdelivr.net/npm/bwip-js@4.11.2/dist/bwip-js-min.js";

const BARCODE_TYPES = [
  { value: "code128", label: "CODE 128" },
  { value: "code128a", label: "CODE 128 A" },
  { value: "code128b", label: "CODE 128 B" },
  { value: "code128c", label: "CODE 128 C" },
  { value: "gs1-128", label: "GS1-128" },
  { value: "ean13", label: "EAN-13" },
  { value: "ean8", label: "EAN-8" },
  { value: "upca", label: "UPC-A" },
  { value: "upce", label: "UPC-E" },
  { value: "itf14", label: "ITF-14" },
  { value: "itf", label: "ITF" },
  { value: "code39", label: "CODE 39" },
  { value: "code93", label: "CODE 93" },
  { value: "codabar", label: "CODABAR" },
  { value: "msi", label: "MSI" },
  { value: "pharmacode", label: "PHARMACODE" },
];

/* =========================================================
   HELPERS
========================================================= */

const createId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
};

const getTimestamp = () => {
  const date = new Date();

  const pad = (value) =>
    String(value).padStart(2, "0");

  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}_` +
    `${pad(date.getHours())}-` +
    `${pad(date.getMinutes())}-` +
    `${pad(date.getSeconds())}`
  );
};

const sanitizeFilename = (value) => {
  return String(value || "barcode")
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "barcode";
};

const downloadBlob = (blob, filename) => {
  if (!blob) {
    throw new Error("Download file could not be created.");
  }

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 2000);
};

const downloadDataUrl = (dataUrl, filename) => {
  if (!dataUrl) {
    throw new Error("Barcode image is missing.");
  }

  const link = document.createElement("a");

  link.href = dataUrl;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  link.remove();
};

/* =========================================================
   VALIDATION
========================================================= */

const validateBarcode = (value, type) => {
  const text = String(value || "").trim();

  if (!text) {
    return "Enter barcode data.";
  }

  switch (type) {
    case "ean13":
      if (!/^\d{12,13}$/.test(text)) {
        return "EAN-13 requires 12 or 13 digits.";
      }
      break;

    case "ean8":
      if (!/^\d{7,8}$/.test(text)) {
        return "EAN-8 requires 7 or 8 digits.";
      }
      break;

    case "upca":
      if (!/^\d{11,12}$/.test(text)) {
        return "UPC-A requires 11 or 12 digits.";
      }
      break;

    case "upce":
      if (!/^\d{6,8}$/.test(text)) {
        return "UPC-E requires 6 to 8 digits.";
      }
      break;

    case "itf14":
      if (!/^\d{13,14}$/.test(text)) {
        return "ITF-14 requires 13 or 14 digits.";
      }
      break;

    case "itf":
      if (!/^\d+$/.test(text)) {
        return "ITF accepts numbers only.";
      }

      if (text.length % 2 !== 0) {
        return "ITF requires an even number of digits.";
      }
      break;

    case "code128c":
      if (!/^\d+$/.test(text)) {
        return "CODE 128 C requires numbers only.";
      }

      if (text.length % 2 !== 0) {
        return "CODE 128 C requires an even number of digits.";
      }
      break;

    case "pharmacode": {
      if (!/^\d+$/.test(text)) {
        return "Pharmacode accepts numbers only.";
      }

      const number = Number(text);

      if (number < 3 || number > 131070) {
        return "Pharmacode must be between 3 and 131070.";
      }

      break;
    }

    default:
      break;
  }

  return "";
};

/* =========================================================
   SVG -> PNG
========================================================= */

const svgDataUrlToPng = (
  svgDataUrl,
  width = 1400
) => {
  return new Promise((resolve, reject) => {
    if (!svgDataUrl) {
      reject(
        new Error("Barcode image is missing.")
      );
      return;
    }

    const image = new Image();

    image.onload = () => {
      try {
        const sourceWidth =
          image.naturalWidth || width;

        const sourceHeight =
          image.naturalHeight ||
          Math.round(width * 0.35);

        const ratio =
          sourceHeight / sourceWidth;

        const canvasWidth = width;

        const canvasHeight = Math.max(
          180,
          Math.round(canvasWidth * ratio)
        );

        const canvas =
          document.createElement("canvas");

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const context =
          canvas.getContext("2d");

        if (!context) {
          reject(
            new Error(
              "Unable to create canvas."
            )
          );
          return;
        }

        context.fillStyle = "#ffffff";

        context.fillRect(
          0,
          0,
          canvasWidth,
          canvasHeight
        );

        context.imageSmoothingEnabled = false;

        context.drawImage(
          image,
          0,
          0,
          canvasWidth,
          canvasHeight
        );

        const png =
          canvas.toDataURL("image/png");

        if (
          !png ||
          png === "data:," ||
          png.length < 100
        ) {
          reject(
            new Error(
              "Barcode could not be converted to PNG."
            )
          );
          return;
        }

        resolve(png);
      } catch (error) {
        reject(error);
      }
    };

    image.onerror = () => {
      reject(
        new Error(
          "Unable to render barcode image."
        )
      );
    };

    image.src = svgDataUrl;
  });
};

/* =========================================================
   WEB WORKER
========================================================= */

const createBarcodeWorker = () => {
  const workerCode = `
    importScripts("${BWIP_URL}");

    self.onmessage = function(event) {
      const {
        id,
        value,
        type
      } = event.data;

      try {
        if (!value) {
          self.postMessage({
            id,
            empty: true
          });

          return;
        }

        const options = {
          bcid: type,
          text: value,

          scaleX: 3,
          scaleY: 3,

          height: 22,

          includetext: true,
          textxalign: "center",
          textsize: 9,
          textfont: "Helvetica",

          backgroundcolor: "FFFFFF",

          paddingwidth: 8,
          paddingheight: 8
        };

        const svg = bwipjs.toSVG(options);

        const encoded = btoa(
          unescape(
            encodeURIComponent(svg)
          )
        );

        const image =
          "data:image/svg+xml;base64," +
          encoded;

        self.postMessage({
          id,
          value,
          type,
          image,
          success: true
        });

      } catch (error) {
        self.postMessage({
          id,
          error:
            error?.message ||
            "Barcode generation failed"
        });
      }
    };
  `;

  const blob = new Blob(
    [workerCode],
    {
      type: "application/javascript",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const worker = new Worker(url);

  URL.revokeObjectURL(url);

  return worker;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function BarcodeGenerator() {
  const [inputText, setInputText] =
    useState("");

  const [barcodeType, setBarcodeType] =
    useState("code128");

  const [currentBarcode, setCurrentBarcode] =
    useState(null);

  const [barcodes, setBarcodes] =
    useState([]);

  const [selectedBarcodes, setSelectedBarcodes] =
    useState([]);

  const [isPreviewGenerating, setIsPreviewGenerating] =
    useState(false);

  const [isPdfGenerating, setIsPdfGenerating] =
    useState(false);

  const [isZipGenerating, setIsZipGenerating] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const workerRef = useRef(null);

  const requestIdRef = useRef(0);

  /* =======================================================
     WORKER INITIALIZATION
  ======================================================= */

  useEffect(() => {
    const worker =
      createBarcodeWorker();

    workerRef.current = worker;

    worker.onmessage = (event) => {
      const data = event.data;

      if (
        data.id !== requestIdRef.current
      ) {
        return;
      }

      setIsPreviewGenerating(false);

      if (data.error) {
        setCurrentBarcode(null);
        setErrorMessage(data.error);
        return;
      }

      if (data.empty) {
        setCurrentBarcode(null);
        return;
      }

      setCurrentBarcode({
        id: createId(),
        value: data.value,
        type: data.type,
        image: data.image,
      });

      setErrorMessage("");
    };

    worker.onerror = (error) => {
      console.error(
        "Barcode Worker Error:",
        error
      );

      setIsPreviewGenerating(false);

      setErrorMessage(
        "Barcode preview engine failed."
      );
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  /* =======================================================
     LIVE PREVIEW
  ======================================================= */

  useEffect(() => {
    const worker = workerRef.current;

    if (!worker) {
      return;
    }

    const value =
      inputText.trim();

    const id =
      ++requestIdRef.current;

    if (!value) {
      setCurrentBarcode(null);
      setIsPreviewGenerating(false);
      setErrorMessage("");
      return;
    }

    const validationError =
      validateBarcode(
        value,
        barcodeType
      );

    if (validationError) {
      setCurrentBarcode(null);
      setIsPreviewGenerating(false);
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");
    setIsPreviewGenerating(true);

    worker.postMessage({
      id,
      value,
      type: barcodeType,
    });
  }, [
    inputText,
    barcodeType,
  ]);

  /* =======================================================
     INPUT
  ======================================================= */

  const handleInputChange =
    useCallback((event) => {
      setInputText(
        event.target.value
      );
    }, []);

  const handleTypeChange =
    useCallback((event) => {
      setBarcodeType(
        event.target.value
      );
    }, []);

  const handleClear =
    useCallback(() => {
      ++requestIdRef.current;

      setInputText("");
      setCurrentBarcode(null);
      setErrorMessage("");
      setIsPreviewGenerating(false);
    }, []);

  /* =======================================================
     ADD BARCODE
  ======================================================= */

  const handleAddBarcode =
    useCallback(() => {
      if (!currentBarcode) {
        return;
      }

      const id = createId();

      const item = {
        ...currentBarcode,
        id,
      };

      setBarcodes((previous) => [
        ...previous,
        item,
      ]);

      setSelectedBarcodes(
        (previous) => [
          ...previous,
          id,
        ]
      );
    }, [currentBarcode]);

  /* =======================================================
     BATCH WORKER GENERATION
  ======================================================= */

  const generateWorkerBarcode =
    useCallback(
      (value, type) => {
        return new Promise(
          (resolve) => {
            const worker =
              workerRef.current;

            if (!worker) {
              resolve(null);
              return;
            }

            const id =
              ++requestIdRef.current;

            const handler =
              (event) => {
                if (
                  event.data.id !== id
                ) {
                  return;
                }

                worker.removeEventListener(
                  "message",
                  handler
                );

                resolve(
                  event.data
                );
              };

            worker.addEventListener(
              "message",
              handler
            );

            worker.postMessage({
              id,
              value,
              type,
            });
          }
        );
      },
      []
    );

  const handleBatchGenerate =
    useCallback(
      async () => {
        const values =
          inputText
            .split(/[,;\n]+/)
            .map((value) =>
              value.trim()
            )
            .filter(Boolean);

        if (!values.length) {
          setErrorMessage(
            "Enter multiple values separated by commas or new lines."
          );

          return;
        }

        const generated = [];
        const ids = [];

        for (const value of values) {
          const validationError =
            validateBarcode(
              value,
              barcodeType
            );

          if (validationError) {
            continue;
          }

          const result =
            await generateWorkerBarcode(
              value,
              barcodeType
            );

          if (result?.success) {
            const id = createId();

            generated.push({
              id,
              value,
              type: barcodeType,
              image: result.image,
            });

            ids.push(id);
          }
        }

        if (!generated.length) {
          setErrorMessage(
            "No valid barcode values found."
          );

          return;
        }

        setBarcodes((previous) => [
          ...previous,
          ...generated,
        ]);

        setSelectedBarcodes(
          (previous) => [
            ...previous,
            ...ids,
          ]
        );

        setCurrentBarcode(
          generated[
            generated.length - 1
          ]
        );

        setErrorMessage("");
      },
      [
        inputText,
        barcodeType,
        generateWorkerBarcode,
      ]
    );

  /* =======================================================
     SELECTION
  ======================================================= */

  const toggleSelection =
    useCallback((id) => {
      setSelectedBarcodes(
        (previous) => {
          if (
            previous.includes(id)
          ) {
            return previous.filter(
              (item) => item !== id
            );
          }

          return [
            ...previous,
            id,
          ];
        }
      );
    }, []);

  const toggleSelectAll =
    useCallback(() => {
      if (
        barcodes.length > 0 &&
        selectedBarcodes.length ===
          barcodes.length
      ) {
        setSelectedBarcodes([]);
        return;
      }

      setSelectedBarcodes(
        barcodes.map(
          (barcode) => barcode.id
        )
      );
    }, [
      selectedBarcodes,
      barcodes,
    ]);

  /* =======================================================
     DELETE
  ======================================================= */

  const deleteSelected =
    useCallback(() => {
      const selected =
        new Set(
          selectedBarcodes
        );

      setBarcodes(
        (previous) =>
          previous.filter(
            (barcode) =>
              !selected.has(
                barcode.id
              )
          )
      );

      setSelectedBarcodes([]);
    }, [selectedBarcodes]);

  /* =======================================================
     DOWNLOAD SINGLE SVG
  ======================================================= */

  const downloadBarcode =
    useCallback(
      (barcode, index = null) => {
        if (!barcode?.image) {
          return;
        }

        const prefix =
          index !== null
            ? `${String(
                index + 1
              ).padStart(3, "0")}-`
            : "";

        const filename =
          `${prefix}${barcode.type}-` +
          `${sanitizeFilename(
            barcode.value
          )}.svg`;

        downloadDataUrl(
          barcode.image,
          filename
        );
      },
      []
    );

  /* =======================================================
     DOWNLOAD MULTIPLE SVG
  ======================================================= */

  const downloadMultiple =
    useCallback(
      async (items) => {
        if (!items?.length) {
          setErrorMessage(
            "Select at least one barcode."
          );

          return;
        }

        try {
          for (
            let index = 0;
            index < items.length;
            index++
          ) {
            downloadBarcode(
              items[index],
              index
            );

            await new Promise(
              (resolve) =>
                setTimeout(
                  resolve,
                  180
                )
            );
          }
        } catch (error) {
          console.error(
            "SVG download error:",
            error
          );

          setErrorMessage(
            error?.message ||
              "Unable to download SVG files."
          );
        }
      },
      [downloadBarcode]
    );

  /* =======================================================
     PDF
  ======================================================= */

 const downloadPdf = useCallback(
  async (items) => {
    if (!items?.length) {
      setErrorMessage("Select at least one barcode.");
      return;
    }

    setIsPdfGenerating(true);
    setErrorMessage("");

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
        (pageWidth - margin * 2 - gap * (columns - 1)) /
        columns;

      const cardHeight = 62;
      const rowGap = 2;

      let pageNumber = 1;

      let y = 28;

      /*
       * Header
       * Only date/time + page number
       */
      const drawHeader = () => {
        const dateTime = new Date().toLocaleString();

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

        // Date / time - left
        pdf.text(
          dateTime,
          margin,
          15
        );

        // Page number - right
        pdf.text(
          `Page ${pageNumber}`,
          pageWidth - margin,
          15,
          {
            align: "right",
          }
        );

        // Header line
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

      let renderedCount = 0;

      for (
        let index = 0;
        index < items.length;
        index++
      ) {
        const barcode = items[index];

        if (!barcode?.image) {
          continue;
        }

        const column =
          renderedCount % columns;

        /*
         * Move to next row
         */
        if (
          column === 0 &&
          renderedCount > 0
        ) {
          y +=
            cardHeight +
            rowGap;
        }

        /*
         * New page
         */
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

        /*
         * Barcode card
         */
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

        /*
         * SVG -> PNG
         */
        const pngImage =
          await svgDataUrlToPng(
            barcode.image,
            1400
          );

        /*
         * Barcode image
         */
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

      /*
       * Create PDF blob
       */
      const pdfBlob =
        pdf.output("blob");

      if (!pdfBlob) {
        throw new Error(
          "PDF file could not be created."
        );
      }

      /*
       * Download
       */
      downloadBlob(
        pdfBlob,
        `linear-barcodes-${getTimestamp()}.pdf`
      );
    } catch (error) {
      console.error(
        "PDF generation error:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to generate PDF."
      );
    } finally {
      setIsPdfGenerating(false);
    }
  },
  []
);

  /* =======================================================
     ZIP
  ======================================================= */

  const downloadZip =
    useCallback(
      async (items) => {
        if (!items?.length) {
          setErrorMessage(
            "Select at least one barcode."
          );

          return;
        }

        setIsZipGenerating(true);
        setErrorMessage("");

        try {
          const zip =
            new JSZip();

          items.forEach(
            (barcode, index) => {
              if (!barcode?.image) {
                return;
              }

              const commaIndex =
                barcode.image.indexOf(
                  ","
                );

              if (
                commaIndex === -1
              ) {
                throw new Error(
                  "Invalid barcode SVG data."
                );
              }

              const base64 =
                barcode.image.slice(
                  commaIndex + 1
                );

              const filename =
                `${String(
                  index + 1
                ).padStart(
                  3,
                  "0"
                )}-${barcode.type}-` +
                `${sanitizeFilename(
                  barcode.value
                )}.svg`;

              zip.file(
                filename,
                base64,
                {
                  base64: true,
                }
              );
            }
          );

          const blob =
            await zip.generateAsync({
              type: "blob",
              compression:
                "DEFLATE",
              compressionOptions: {
                level: 6,
              },
            });

          downloadBlob(
            blob,
            `linear-barcodes-${getTimestamp()}.zip`
          );
        } catch (error) {
          console.error(
            "ZIP generation error:",
            error
          );

          setErrorMessage(
            error?.message ||
              "Unable to create ZIP."
          );
        } finally {
          setIsZipGenerating(false);
        }
      },
      []
    );

  /* =======================================================
     SELECTED ITEMS
  ======================================================= */

  const selectedItems = useMemo(
    () =>
      barcodes.filter(
        (barcode) =>
          selectedBarcodes.includes(
            barcode.id
          )
      ),
    [
      barcodes,
      selectedBarcodes,
    ]
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="barcode-page-gt">

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="barcode-hero-gt">
        <div className="barcode-hero-content-gt">

          <h1 className="barcode-title-gt">
            Generate barcodes{" "}
            <span className="barcode-title-accent-gt">
              instantly.
            </span>
          </h1>

          <p className="barcode-description-gt">
            Create clean, high-quality
            linear barcodes with real-time
            preview and simple exports.
          </p>

        </div>
      </section>

      {/* ===================================================
          GENERATOR
      =================================================== */}

      <section className="barcode-generator-card-gt">

        {/* TYPE */}

        <div className="barcode-controls-gt">

          <div className="barcode-field-gt">

            <label
              className="barcode-label-gt"
              htmlFor="barcode-type-gt"
            >
              Barcode Type
            </label>

            <select
              id="barcode-type-gt"
              className="barcode-select-gt"
              value={barcodeType}
              onChange={
                handleTypeChange
              }
            >
              {BARCODE_TYPES.map(
                (type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                )
              )}
            </select>

          </div>

        </div>

        {/* INPUT */}

        <div className="barcode-input-area-gt">

          <div className="barcode-field-gt">

            <label
              className="barcode-label-gt"
              htmlFor="barcode-data-gt"
            >
              Barcode Data
            </label>

            <div className="barcode-input-wrap-gt">

              <input
                id="barcode-data-gt"
                className="barcode-input-gt"
                type="text"
                value={inputText}
                onChange={
                  handleInputChange
                }
                placeholder="Start typing your barcode data..."
                autoComplete="off"
                spellCheck="false"
              />

              {inputText && (
                <button
                  type="button"
                  className="barcode-clear-input-gt"
                  onClick={
                    handleClear
                  }
                  aria-label="Clear input"
                >
                  ×
                </button>
              )}

            </div>

            {/* LIVE STATUS */}

            <div className="barcode-input-info-gt">

              <span
                className={
                  isPreviewGenerating
                    ? "barcode-live-loading-dot-gt"
                    : ""
                }
              />

              {isPreviewGenerating
                ? "Generating live preview..."
                : "Live preview"}

            </div>

          </div>

        </div>

        {/* BATCH */}

        <div className="barcode-batch-actions-gt">

          <button
            type="button"
            onClick={
              handleBatchGenerate
            }
            disabled={
              !inputText.trim()
            }
          >
            Generate Batch
          </button>

        </div>

        {/* ERROR */}

        {errorMessage && (
          <div className="barcode-error-gt">

            <span className="barcode-error-icon-gt">
              !
            </span>

            <span>
              {errorMessage}
            </span>

          </div>
        )}

      </section>

      {/* ===================================================
          LIVE PREVIEW
      =================================================== */}

      <section className="barcode-preview-card-gt">

        <div className="barcode-section-header-gt">

          {currentBarcode && (
            <span className="barcode-type-pill-gt">
              {currentBarcode.type.toUpperCase()}
            </span>
          )}

        </div>

        <div className="barcode-preview-stage-gt">

          {!currentBarcode ? (
            <div className="barcode-empty-gt">

              <div className="barcode-empty-icon-gt">
                ▥
              </div>

              <h3 className="barcode-empty-title-gt">
                Start typing
              </h3>

              <p className="barcode-empty-text-gt">
                Your barcode will appear
                here instantly.
              </p>

            </div>
          ) : (
            <div className="barcode-result-gt">

              <div className="barcode-image-box-gt">

                <img
                  className="barcode-main-image-gt"
                  src={
                    currentBarcode.image
                  }
                  alt={
                    currentBarcode.value
                  }
                  draggable="false"
                />

                <div className="barcode-value-gt">
                  {currentBarcode.value}
                </div>

                <div className="barcode-result-meta-gt">

                  <span>
                    {currentBarcode.type.toUpperCase()}
                  </span>

                  <span className="barcode-meta-separator-gt">
                    •
                  </span>

                  <span>
                    Live SVG
                  </span>

                </div>

              </div>

              <div className="barcode-result-actions-gt">

                <button
                  type="button"
                  className="barcode-button-primary-gt"
                  onClick={
                    handleAddBarcode
                  }
                >
                  ＋ Add Barcode
                </button>

                <button
                  type="button"
                  className="barcode-button-secondary-gt"
                  onClick={() =>
                    downloadBarcode(
                      currentBarcode
                    )
                  }
                >
                  ↓ Download SVG
                </button>

              </div>

            </div>
          )}

        </div>

      </section>

      {/* ===================================================
          COLLECTION
      =================================================== */}

      <section className="barcode-collection-card-gt">

        <div className="barcode-section-header-gt barcode-section-header-collection-gt">

          <div>

            <span className="barcode-kicker-gt">
              COLLECTION
            </span>

            <h2 className="barcode-heading-gt">

              Your Barcodes

              {barcodes.length > 0 && (
                <span className="barcode-count-gt">
                  {barcodes.length}
                </span>
              )}

            </h2>

          </div>

          {barcodes.length > 0 && (
            <button
              type="button"
              className="barcode-select-all-gt"
              onClick={
                toggleSelectAll
              }
            >
              {selectedBarcodes.length ===
              barcodes.length
                ? "Deselect all"
                : "Select all"}
            </button>
          )}

        </div>

        {barcodes.length === 0 ? (
          <div className="barcode-empty-collection-gt">

            <div className="barcode-empty-collection-icon-gt">
              ＋
            </div>

            <h3>
              No barcodes yet
            </h3>

            <p>
              Add your generated
              barcodes to build your
              collection.
            </p>

          </div>
        ) : (
          <>
            <div className="barcode-toolbar-gt">

              <div className="barcode-selected-count-gt">

                <strong>
                  {selectedBarcodes.length}
                </strong>

                <span>
                  selected
                </span>

              </div>

              <div className="barcode-toolbar-actions-gt">

                <button
                  type="button"
                  onClick={() =>
                    downloadMultiple(
                      selectedItems
                    )
                  }
                  disabled={
                    !selectedItems.length
                  }
                >
                  SVG
                </button>

                <button
                  type="button"
                  onClick={() =>
                    downloadPdf(
                      selectedItems
                    )
                  }
                  disabled={
                    !selectedItems.length ||
                    isPdfGenerating
                  }
                >
                  {isPdfGenerating
                    ? "PDF..."
                    : "PDF"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    downloadZip(
                      selectedItems
                    )
                  }
                  disabled={
                    !selectedItems.length ||
                    isZipGenerating
                  }
                >
                  {isZipGenerating
                    ? "ZIP..."
                    : "ZIP"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    downloadMultiple(
                      barcodes
                    )
                  }
                  disabled={
                    !barcodes.length
                  }
                >
                  All
                </button>

                <button
                  type="button"
                  className="barcode-delete-gt"
                  onClick={
                    deleteSelected
                  }
                  disabled={
                    !selectedItems.length
                  }
                >
                  Delete
                </button>

              </div>

            </div>

            <div className="barcode-grid-gt">

              {barcodes.map(
                (barcode, index) => {
                  const selected =
                    selectedBarcodes.includes(
                      barcode.id
                    );

                  return (
                    <article
                      key={
                        barcode.id
                      }
                      className={
                        `barcode-item-gt ${
                          selected
                            ? "barcode-item-selected-gt"
                            : ""
                        }`
                      }
                    >

                      <div className="barcode-item-header-gt">

                        <label className="barcode-checkbox-gt">

                          <input
                            type="checkbox"
                            checked={
                              selected
                            }
                            onChange={() =>
                              toggleSelection(
                                barcode.id
                              )
                            }
                          />

                          <span />

                        </label>

                        <span className="barcode-number-gt">
                          #
                          {String(
                            index + 1
                          ).padStart(
                            3,
                            "0"
                          )}
                        </span>

                      </div>

                      <div className="barcode-item-image-gt">

                        <img
                          src={
                            barcode.image
                          }
                          alt={
                            barcode.value
                          }
                          draggable="false"
                        />

                      </div>

                      <div className="barcode-item-value-gt">
                        {barcode.value}
                      </div>

                      <div className="barcode-item-type-gt">
                        {barcode.type.toUpperCase()}
                      </div>

                      <div className="barcode-item-actions-gt">

                        <button
                          type="button"
                          onClick={() =>
                            setCurrentBarcode(
                              barcode
                            )
                          }
                        >
                          Preview
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            downloadBarcode(
                              barcode,
                              index
                            )
                          }
                        >
                          Download
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          </>
        )}

      </section>

    </main>
  );
}