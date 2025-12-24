import { toast } from "react-toastify";
import type { ToastOptions, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultOptions: ToastOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  style: {
    
    width: "fit-content",
    minWidth: "150px",
    maxWidth: "90vw", 
    margin: "10px auto",
    
    
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(12px) saturate(180%)",
    WebkitBackdropFilter: "blur(12px) saturate(180%)",
    border: "1px solid rgba(209, 213, 219, 0.3)",
    borderRadius: "50px", 
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    
    textAlign: "center",
    fontWeight: "600",
    padding: "12px 28px",
    fontSize: "15px",
    lineHeight: "1.4",
    whiteSpace: "nowrap",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

type ToastType = "success" | "error" | "info" | "warning";

export function showToast(message: string, type: ToastType = "info") {
  const options: ToastOptions = { ...defaultOptions };
  let color = "#1f2937"; 
  let borderBottomColor = "#3b82f6";

  switch (type) {
    case "success":
      color = "#15803d";
      borderBottomColor = "#22c55e";
      break;
    case "error":
      color = "#b91c1c";
      borderBottomColor = "#ef4444";
      break;
    case "warning":
      color = "#a16207";
      borderBottomColor = "#facc15";
      break;
    case "info":
      color = "#1d4ed8";
      borderBottomColor = "#3b82f6";
      break;
  }

  options.style = {
    ...options.style,
    color: color,
    borderBottom: `1px solid ${borderBottomColor}`, 
  };

  toast(message, { ...options, type: type as TypeOptions });
}