import React from 'react';

// This is a simple, stylized SVG logo representing the concept of a growing mind.
function MindloomLogo({ className, color = 'currentColor' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M50 20 C25 20, 25 50, 50 50 C75 50, 75 20, 50 20 Z" />
            <path d="M50 50 V 80" />
            <path d="M35 70 Q 50 60, 65 70" />
            <path d="M40 80 Q 50 70, 60 80" />
        </svg>
    );
}

export default MindloomLogo;