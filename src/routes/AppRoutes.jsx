import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";
import ImageToQR from "../pages/ImageToQR";
import UPIQR from "../pages/UPIQR";
import BatchQR from "../pages/BatchQR";
import TextToQR from "../pages/TextToQR";
import BarcodeGenerator from "../pages/BarcodeGenerator";
import ZeptoBinsBarcode from "../pages/ZeptoBinsBarcode";

/* Information / Legal Pages */
import About from "../pages/About";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import PrivacyPolicy from "../pages/Privacy";
import Terms from "../pages/Terms";
import ScrollToTop from "../components/ScrollToTop";


export default function AppRoutes() {
  return (
    <BrowserRouter>
          <ScrollToTop />


      <Routes>

        {/* =====================================================
            HOME
        ===================================================== */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =====================================================
            QR TOOLS
        ===================================================== */}

        <Route
          path="/image-to-qr"
          element={<ImageToQR />}
        />

        <Route
          path="/upi-qr"
          element={<UPIQR />}
        />

        <Route
          path="/batch-qr"
          element={<BatchQR />}
        />

        <Route
          path="/text-to-qr"
          element={<TextToQR />}
        />


        {/* =====================================================
            BARCODE TOOLS
        ===================================================== */}

        <Route
          path="/barcode-generator"
          element={<BarcodeGenerator />}
        />

        <Route
          path="/zep-barcode"
          element={<ZeptoBinsBarcode />}
        />


        {/* =====================================================
            INFORMATION PAGES
        ===================================================== */}

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/faq"
          element={<FAQ />}
        />


        {/* =====================================================
            LEGAL PAGES
        ===================================================== */}

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

      </Routes>

    </BrowserRouter>
  );
}