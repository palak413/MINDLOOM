import React from "react";

export function Badge({ children, className = "", ...props }) {
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 ${className}`} {...props}>
      {children}
    </span>
  );
}
