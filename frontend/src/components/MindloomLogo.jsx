import React from 'react';

const MindloomLogo = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Brain/Head Shape */}
      <path 
        d="M50 15 C30 15, 15 30, 15 50 C15 70, 30 85, 50 85 C70 85, 85 70, 85 50 C85 30, 70 15, 50 15 Z" 
        fill={color}
        opacity="0.9"
      />
      
      {/* Neural Network Lines */}
      <path 
        d="M35 35 L45 45 M65 35 L55 45 M35 65 L45 55 M65 65 L55 55" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round"
        opacity="0.8"
      />
      
      {/* Central Connection Point */}
      <circle 
        cx="50" 
        cy="50" 
        r="3" 
        fill="white"
        opacity="0.9"
      />
      
      {/* Leaf/Flower Petals */}
      <path 
        d="M50 20 C45 15, 40 20, 50 25 C60 20, 55 15, 50 20 Z" 
        fill="white" 
        opacity="0.7"
      />
      <path 
        d="M50 80 C45 85, 40 80, 50 75 C60 80, 55 85, 50 80 Z" 
        fill="white" 
        opacity="0.7"
      />
      <path 
        d="M20 50 C15 45, 20 40, 25 50 C20 60, 15 55, 20 50 Z" 
        fill="white" 
        opacity="0.7"
      />
      <path 
        d="M80 50 C85 45, 80 40, 75 50 C80 60, 85 55, 80 50 Z" 
        fill="white" 
        opacity="0.7"
      />
      
      {/* Small decorative dots */}
      <circle cx="30" cy="30" r="1.5" fill="white" opacity="0.6" />
      <circle cx="70" cy="30" r="1.5" fill="white" opacity="0.6" />
      <circle cx="30" cy="70" r="1.5" fill="white" opacity="0.6" />
      <circle cx="70" cy="70" r="1.5" fill="white" opacity="0.6" />
    </svg>
  );
};

export default MindloomLogo;
