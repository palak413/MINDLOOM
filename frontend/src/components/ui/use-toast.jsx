import React, { createContext, useContext } from "react";

const ToastContext = createContext();

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a mock toast function if no provider
    return {
      toast: ({ title, description, variant = "default" }) => {
        console.log(`Toast: ${title} - ${description} (${variant})`);
      }
    };
  }
  return context;
}

export function ToastProvider({ children }) {
  const toast = ({ title, description, variant = "default" }) => {
    // Simple alert for now - you can enhance this later
    alert(`${title}: ${description}`);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
    </ToastContext.Provider>
  );
}
