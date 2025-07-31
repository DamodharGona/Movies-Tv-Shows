import { useState } from "react";

// Different types of toast messages
type ToastType = "success" | "error" | "info";

// Interface for toast data
interface ToastData {
  message: string;
  type: ToastType;
}

// Custom hook for managing toast notifications
export const useToast = () => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Function to show a toast message
  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
    setIsVisible(true);
  };

  // Function to hide the toast
  const hideToast = () => {
    setIsVisible(false);
    // Clear the toast data after animation
    setTimeout(() => {
      setToast(null);
    }, 300);
  };

  // Helper functions for different toast types
  const showSuccess = (message: string) => showToast(message, "success");
  const showError = (message: string) => showToast(message, "error");
  const showInfo = (message: string) => showToast(message, "info");

  return {
    toast,
    isVisible,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showInfo,
  };
};
