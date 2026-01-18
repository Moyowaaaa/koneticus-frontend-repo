// src/utils/toast.ts
import { toast } from "sonner";

// Define the toast types and their associated styles
type ToastType = "success" | "error" | "info";

// Toast styles for each type
const toastStyles: Record<ToastType, React.CSSProperties> = {
  success: {
    background: "#00875A", // Green background for success
    color: "white",
    fontWeight: 500,
    height: "max-content",
    borderRadius: 1000,
    fontSize: 14,
    paddingLeft: 24,
    width: "max-content",
    maxWidth: "max-content",
    marginLeft: "auto",
    marginRight: "auto",
  },
  error: {
    background: "#D32F2F", // Red background for errors
    color: "white",
    fontWeight: 500,
    height: "max-content",
    borderRadius: 1000,
    fontSize: 14,
    paddingLeft: 24,
    width: "max-content",
    maxWidth: "max-content",
    marginLeft: "auto",
    marginRight: "auto",
  },
  info: {
    background: "#1d1d1d", // Black background for information
    color: "white",
    fontWeight: 500,
    height: "max-content",
    borderRadius: 1000,
    fontSize: 14,
    paddingLeft: 24,
    width: "max-content",
    maxWidth: "max-content",
    marginLeft: "auto",
    marginRight: "auto",
  },
};

// Checking the sonner types
type ToastOptions = Parameters<typeof toast>[1];

// Create the custom toast functions
export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      ...options,
      style: {
        ...toastStyles.success,
        ...(options?.style || {}),
      },
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      ...options,
      style: {
        ...toastStyles.error,
        ...(options?.style || {}),
      },
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast(message, {
      ...options,
      style: {
        ...toastStyles.info,
        ...(options?.style || {}),
      },
    });
  },
};
