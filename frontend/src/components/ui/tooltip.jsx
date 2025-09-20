import React from "react";

export function Tooltip({ children }) {
  return <div>{children}</div>;
}

export function TooltipProvider({ children }) {
  return <div>{children}</div>;
}

export function TooltipTrigger({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function TooltipContent({ children, className = "", ...props }) {
  return (
    <div className={`bg-black text-white p-2 rounded text-sm ${className}`} {...props}>
      {children}
    </div>
  );
}
