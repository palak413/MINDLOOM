import React from "react";

export function Toaster({ className = "", ...props }) {
  return (
    <div 
      className={`fixed top-4 right-4 z-50 ${className}`} 
      {...props}
    >
      {/* Toast notifications will appear here */}
    </div>
  );
}
