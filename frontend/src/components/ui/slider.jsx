import React from "react";

export function Slider({ 
  value = [0], 
  onValueChange, 
  max = 100, 
  min = 0, 
  step = 1, 
  className = "", 
  ...props 
}) {
  const handleChange = (event) => {
    const newValue = [Number(event.target.value)];
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0] || 0}
      onChange={handleChange}
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${className}`}
      style={{
        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(value[0] / max) * 100}%, #e5e7eb ${(value[0] / max) * 100}%, #e5e7eb 100%)`
      }}
      {...props}
    />
  );
}
