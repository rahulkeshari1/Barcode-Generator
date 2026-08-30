import { useNavigate } from "react-router-dom";

export default function ToolCards() {
  const navigate =
    useNavigate();

  const tools = [
    {
      title: "Image To QR",
      desc: "OCR + QR",
      route:
        "/image-to-qr",
    },
    {
      title: "Text To QR",
      desc:
        "Generate instantly",
         route:
        "/text-to-qr",
    },
    {
      title: "Batch QR",
      desc:
        "Multiple records",
         route:
        "/batch-qr",
    },
  ];

  return (
    <>
      <h2 className="section-title">
        QR Tools
      </h2>

      <div className="tool-grid">

        {tools.map((tool) => (
          <div
            key={tool.title}
            className="tool-card"
            onClick={() =>
              tool.route &&
              navigate(
                tool.route
              )
            }
          >
            <h3>
              {tool.title}
            </h3>

            <p>
              {tool.desc}
            </p>

            <button>
              Open Tool
            </button>
          </div>
        ))}

      </div>
    </>
  );
}