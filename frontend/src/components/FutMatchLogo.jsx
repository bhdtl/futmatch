import React from 'react';

export const FutMatchLogo = ({ className = "w-7 h-7" }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Abgerundeter Container mit dezentem Rand */}
      <rect
        width="32"
        height="32"
        rx="8"
        fill="#09090b"
        stroke="#27272a"
        strokeWidth="1.5"
      />
      
      {/* Linker Taktik-Winkel (steht für den Spieler/Klienten) */}
      <path
        d="M8 21V11H16"
        stroke="#10b981"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Rechter gespiegelter Winkel (steht für den passenden Verein/Vakanz) */}
      <path
        d="M24 11V21H16"
        stroke="#34d399"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.85"
      />

      {/* Zentraler Node / Schnittpunkt (Der Match-Score) */}
      <circle cx="16" cy="16" r="2" fill="#ffffff" />
    </svg>
  );
};
