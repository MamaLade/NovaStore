import { createContext, useContext, useState, useRef } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import "./ToastContext.css";

const ToastContext = createContext();

const toastIcons = {
  success: FaCheckCircle,
  error: FaExclamationCircle,
  warning: FaExclamationTriangle,
  info: FaInfoCircle,
};

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const timer = useRef(null);

  const showToast = (message, type = "success", duration = 2500) => {
    clearTimeout(timer.current);

    setToast({
      show: true,
      message,
      type,
    });

    timer.current = setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, duration);
  };

  const Icon = toastIcons[toast.type] || FaInfoCircle;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast.show && (
        <div className={`toast ${toast.type}`} role="status">
          <Icon />
          <span>{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
