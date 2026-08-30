import "./Snackbar.css";

export default function Snackbar({
  open,
  message,
}) {
  if (!open) return null;

  return (
    <div className="snackbar">
      {message}
    </div>
  );
}