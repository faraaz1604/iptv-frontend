import { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

// ================= TOAST CONTEXT =================
const ToastContext = createContext();

// ================= TOAST PROVIDER =================
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();

    const newToast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// ================= CUSTOM HOOK =================
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  const { addToast } = context;

  return {
    success: (message, duration = 3000) =>
      addToast(message, "success", duration),
    error: (message, duration = 4000) => addToast(message, "error", duration),
    warning: (message, duration = 3500) =>
      addToast(message, "warning", duration),
    info: (message, duration = 3000) => addToast(message, "info", duration),
  };
}

// ================= TOAST CONTAINER =================
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
