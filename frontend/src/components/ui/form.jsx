import React from "react";

export function Form({ children, ...props }) {
  return <form {...props}>{children}</form>;
}

export function FormControl({ children, className = "", ...props }) {
  return <div className={`form-control ${className}`} {...props}>{children}</div>;
}

export function FormField({ children, name, control, render, ...props }) {
  if (render) {
    return render({ field: { name, ...props } });
  }
  return <div className="form-field" {...props}>{children}</div>;
}

export function FormItem({ children, className = "", ...props }) {
  return <div className={`form-item ${className}`} {...props}>{children}</div>;
}

export function FormLabel({ children, className = "", ...props }) {
  return <label className={`form-label font-medium ${className}`} {...props}>{children}</label>;
}

export function FormMessage({ children, className = "", ...props }) {
  return <div className={`form-message text-red-500 text-sm ${className}`} {...props}>{children}</div>;
}
