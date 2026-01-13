import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Toast({ toast, onRemove }) {
  const [isExiting, setIsExiting] = useState(false);

  // Handle auto-dismiss animation
  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onRemove, 300); // Wait for animation
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, onRemove]);

  const getStyles = () => {
    const baseStyles = {
      bg: "",
      border: "",
      icon: "",
      text: "",
      Icon: Info,
    };

    switch (toast.type) {
      case "success":
        return {
          ...baseStyles,
          bg: "bg-green-50 dark:bg-green-900/30",
          border: "border-green-300 dark:border-green-700",
          icon: "text-green-600 dark:text-green-400",
          text: "text-green-800 dark:text-green-200",
          Icon: CheckCircle,
        };
      case "error":
        return {
          ...baseStyles,
          bg: "bg-red-50 dark:bg-red-900/30",
          border: "border-red-300 dark:border-red-700",
          icon: "text-red-600 dark:text-red-400",
          text: "text-red-800 dark:text-red-200",
          Icon: AlertCircle,
        };
      case "warning":
        return {
          ...baseStyles,
          bg: "bg-yellow-50 dark:bg-yellow-900/30",
          border: "border-yellow-300 dark:border-yellow-700",
          icon: "text-yellow-600 dark:text-yellow-400",
          text: "text-yellow-800 dark:text-yellow-200",
          Icon: AlertTriangle,
        };
      case "info":
      default:
        return {
          ...baseStyles,
          bg: "bg-blue-50 dark:bg-blue-900/30",
          border: "border-blue-300 dark:border-blue-700",
          icon: "text-blue-600 dark:text-blue-400",
          text: "text-blue-800 dark:text-blue-200",
          Icon: Info,
        };
    }
  };

  const styles = getStyles();
  const { Icon } = styles;

  return (
    <div
      className={`
        pointer-events-auto
        ${styles.bg}
        ${styles.border}
        border rounded-lg p-4
        flex items-start gap-3
        shadow-lg backdrop-blur-sm
        transform transition-all duration-300
        ${
          isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
        }
      `}
    >
      {/* Icon */}
      <Icon className={`w-5 h-5 ${styles.icon} flex-shrink-0 mt-0.5`} />

      {/* Message */}
      <p className={`text-sm font-medium ${styles.text} flex-1 break-words`}>
        {toast.message}
      </p>

      {/* Close Button */}
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onRemove, 300);
        }}
        className={`
          flex-shrink-0 p-1 rounded
          hover:bg-black/10 dark:hover:bg-white/10
          transition
        `}
      >
        <X className={`w-4 h-4 ${styles.icon}`} />
      </button>
    </div>
  );
}
