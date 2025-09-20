import React, { useState } from "react";

export function Tabs({ children, defaultValue = "", className = "" }) {
  const [activeValue, setActiveValue] = useState(defaultValue);
  const tabs = React.Children.toArray(children).filter(child => child.type.displayName === "TabsList");
  const contents = React.Children.toArray(children).filter(child => child.type.displayName === "TabsContent");

  return (
    <div className={className}>
      {tabs.map((tabList, idx) =>
        React.cloneElement(tabList, {
          key: idx,
          activeValue,
          setActiveValue
        })
      )}
      <div style={{ marginTop: "16px" }}>
        {contents.filter(content => content.props.value === activeValue)}
      </div>
    </div>
  );
}

export function TabsList({ children, activeValue, setActiveValue, className = "" }) {
  return (
    <div className={`flex gap-2 ${className}`} style={{ display: "flex", gap: "8px" }}>
      {React.Children.map(children, child =>
        React.cloneElement(child, {
          isActive: child.props.value === activeValue,
          onClick: () => setActiveValue(child.props.value)
        })
      )}
    </div>
  );
}
TabsList.displayName = "TabsList";

export function TabsTrigger({ children, value, isActive, onClick }) {
  return (
    <button
      style={{
        padding: "8px 16px",
        border: "none",
        borderBottom: isActive ? "2px solid #007bff" : "2px solid transparent",
        background: "none",
        cursor: "pointer",
        fontWeight: isActive ? "bold" : "normal"
      }}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
TabsTrigger.displayName = "TabsTrigger";

export function TabsContent({ children, value, className = "" }) {
  return <div className={className}>{children}</div>;
}
TabsContent.displayName = "TabsContent";
