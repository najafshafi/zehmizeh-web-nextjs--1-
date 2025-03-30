import { useEffect } from "react";
import toast from "react-hot-toast";

// This hook prevents unauthorized toasts on freelancer profile pages
export const useSuppressAuthErrors = () => {
  useEffect(() => {
    // Store original toast.error function
    const originalError = toast.error;

    // Replace toast.error with a wrapper that filters auth-related errors
    toast.error = function (message, options) {
      // Check if the error is auth-related
      if (
        typeof message === "string" &&
        (message.toLowerCase().includes("unauthorized") ||
          message.toLowerCase().includes("session expired") ||
          message.toLowerCase().includes("token") ||
          message.toLowerCase().includes("login"))
      ) {
        // Suppress the error by returning a fake toast ID
        return "suppressed-auth-error";
      }

      // Pass through non-auth errors to the original function
      return originalError(message, options);
    } as typeof toast.error;

    // Restore original function on cleanup
    return () => {
      toast.error = originalError;
    };
  }, []);
};
