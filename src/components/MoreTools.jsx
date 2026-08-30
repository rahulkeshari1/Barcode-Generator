import {
  AccountBalanceWallet,
  Wifi,
  Link as LinkIcon,
  ContactPage,
  PictureAsPdf,
  History,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Snackbar from "./Snackbar";

const tools = [
  {
    title: "UPI QR",
    icon: <AccountBalanceWallet />,
    route: "/upi-qr",
  },
  {
    title: "WiFi QR",
    icon: <Wifi />,
  },
  {
    title: "URL QR",
    icon: <LinkIcon />,
  },
  {
    title: "vCard QR",
    icon: <ContactPage />,
  },
  {
    title: "PDF To QR",
    icon: <PictureAsPdf />,
  },
  {
    title: "QR History",
    icon: <History />,
  },
];

export default function MoreTools() {
  const navigate =
    useNavigate();

  const [snackbar, setSnackbar] =
    useState(false);

  const showComingSoon =
    () => {
      setSnackbar(true);

      setTimeout(() => {
        setSnackbar(false);
      }, 2500);
    };

  const handleClick = (
    tool
  ) => {
    if (tool.route) {
      navigate(tool.route);
      return;
    }

    showComingSoon();
  };

  return (
    <>
      <Snackbar
        open={snackbar}
        message="🚀 Coming Soon"
      />

      <h2 className="section-title">
        Want More?
      </h2>

      <div className="more-grid">

        {tools.map((tool) => (
          <div
            key={tool.title}
            className="more-card"
            onClick={() =>
              handleClick(tool)
            }
          >
            <div className="more-icon">
              {tool.icon}
            </div>

            <h4>
              {tool.title}
            </h4>
          </div>
        ))}

      </div>
    </>
  );
}



