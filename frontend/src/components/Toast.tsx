import React, { useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

// Different types of toast messages
type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
}) => {
  // Auto-close toast after 3 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // Don't render if not visible
  if (!isVisible) return null;

  // Get icon and colors based on type
  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: <FaCheckCircle className="text-green-500" />,
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
        };
      case "error":
        return {
          icon: <FaExclamationTriangle className="text-red-500" />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
        };
      case "info":
        return {
          icon: <FaInfoCircle className="text-blue-500" />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
      <div
        className={`${styles.bgColor} ${styles.borderColor} ${styles.textColor} border rounded-lg p-4 shadow-lg max-w-sm flex items-center gap-3`}
      >
        {styles.icon}
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <FaTimes size={14} />
        </button>
      </div>
    </div>
  );
};
