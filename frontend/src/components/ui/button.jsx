import React from "react";

export function Button({ children, onClick, type = "button", style = {}, ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: "8px 16px",
        background: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
}
