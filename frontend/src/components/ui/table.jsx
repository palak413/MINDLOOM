import React from "react";

export function Table({ children, className = "", ...props }) {
  return <table className={`min-w-full ${className}`} {...props}>{children}</table>;
}
export function TableHead({ children, className = "", ...props }) {
  return <thead className={className} {...props}>{children}</thead>;
}
export function TableBody({ children, className = "", ...props }) {
  return <tbody className={className} {...props}>{children}</tbody>;
}
export function TableRow({ children, className = "", ...props }) {
  return <tr className={className} {...props}>{children}</tr>;
}
export function TableCell({ children, className = "", ...props }) {
  return <td className={`px-4 py-2 border ${className}`} {...props}>{children}</td>;
}
export function TableHeader({ children, className = "", ...props }) {
  return <th className={`px-4 py-2 border bg-gray-100 ${className}`} {...props}>{children}</th>;
}
