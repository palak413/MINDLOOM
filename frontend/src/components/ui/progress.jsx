import React from "react";

export function Progress({ value, max = 100, className = "", ...props }) {
  return (
    <progress value={value} max={max} className={`w-full h-2 rounded bg-gray-200 ${className}`} {...props} />
  );
}
