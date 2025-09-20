import React from "react";

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      {...props}
    />
  );
}
