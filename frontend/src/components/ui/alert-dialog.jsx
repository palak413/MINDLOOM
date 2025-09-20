import React from "react";

export function AlertDialog({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function AlertDialogAction({ children, onClick, className = "", ...props }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 bg-blue-500 text-white rounded ${className}`} {...props}>
      {children}
    </button>
  );
}

export function AlertDialogCancel({ children, onClick, className = "", ...props }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 bg-gray-300 text-black rounded ${className}`} {...props}>
      {children}
    </button>
  );
}

export function AlertDialogContent({ children, className = "", ...props }) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertDialogDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-gray-600 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function AlertDialogFooter({ children, className = "", ...props }) {
  return (
    <div className={`flex gap-2 mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertDialogHeader({ children, className = "", ...props }) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertDialogTitle({ children, className = "", ...props }) {
  return (
    <h3 className={`text-xl font-semibold ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function AlertDialogTrigger({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
