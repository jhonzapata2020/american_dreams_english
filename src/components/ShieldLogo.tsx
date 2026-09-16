import React from 'react';

interface ShieldLogoProps {
  className?: string;
}

export const ShieldLogo: React.FC<ShieldLogoProps> = ({ className = "h-12 w-auto max-h-12" }) => {
  return (
    <div className={`relative group inline-flex items-center justify-center perspective-1000 ${className}`}>
      {/* SVG Vectorial del Escudo Oficial */}
      <svg
        viewBox="0 0 200 220"
        className="h-full w-auto max-h-12 drop-shadow-sm transition-transform duration-700 ease-out group-hover:[transform:rotateY(360deg)] cursor-pointer block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="shield-clip">
            <path d="M10 20 C60 5, 140 5, 190 20 C195 90, 180 160, 100 215 C20 160, 5 90, 10 20 Z" />
          </clipPath>
          <clipPath id="flag-circle">
            <circle cx="100" cy="170" r="28" />
          </clipPath>
        </defs>

        {/* Silueta completa del Escudo */}
        <g clipPath="url(#shield-clip)">
          {/* Cabecera Roja */}
          <rect x="0" y="0" width="200" height="60" fill="#DC2626" />
          
          {/* Texto "AMERICAN" en cabecera */}
          <text
            x="100"
            y="42"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="sans-serif"
            fontSize="19"
            fontWeight="900"
            letterSpacing="3"
          >
            AMERICAN
          </text>

          {/* Línea divisoria blanca */}
          <rect x="0" y="58" width="200" height="3" fill="#FFFFFF" />

          {/* Cuerpo Azul Marino Institucional */}
          <rect x="0" y="61" width="200" height="160" fill="#0F2537" />

          {/* Texto "DREAM" */}
          <text
            x="100"
            y="108"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="sans-serif"
            fontSize="32"
            fontWeight="900"
            letterSpacing="1.5"
          >
            DREAM
          </text>

          {/* Texto "ENGLISH" */}
          <text
            x="100"
            y="132"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="sans-serif"
            fontSize="16"
            fontWeight="800"
            letterSpacing="4"
          >
            ENGLISH
          </text>

          {/* Círculo con Bandera de USA en la base */}
          <g clipPath="url(#flag-circle)">
            {/* Fondo de rayas rojas y blancas */}
            <rect x="70" y="140" width="60" height="60" fill="#FFFFFF" />
            <rect x="70" y="145" width="60" height="4.5" fill="#DC2626" />
            <rect x="70" y="154" width="60" height="4.5" fill="#DC2626" />
            <rect x="70" y="163" width="60" height="4.5" fill="#DC2626" />
            <rect x="70" y="172" width="60" height="4.5" fill="#DC2626" />
            <rect x="70" y="181" width="60" height="4.5" fill="#DC2626" />
            <rect x="70" y="190" width="60" height="4.5" fill="#DC2626" />

            {/* Cantón Azul con micro-estrellas */}
            <rect x="70" y="142" width="28" height="28" fill="#1E3A8A" />
            <circle cx="76" cy="148" r="1.5" fill="#FFFFFF" />
            <circle cx="84" cy="148" r="1.5" fill="#FFFFFF" />
            <circle cx="92" cy="148" r="1.5" fill="#FFFFFF" />
            <circle cx="80" cy="155" r="1.5" fill="#FFFFFF" />
            <circle cx="88" cy="155" r="1.5" fill="#FFFFFF" />
            <circle cx="76" cy="162" r="1.5" fill="#FFFFFF" />
            <circle cx="84" cy="162" r="1.5" fill="#FFFFFF" />
            <circle cx="92" cy="162" r="1.5" fill="#FFFFFF" />

            {/* Borde del botón circular de la bandera */}
            <circle cx="100" cy="170" r="27.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        </g>

        {/* Borde exterior del escudo */}
        <path
          d="M10 20 C60 5, 140 5, 190 20 C195 90, 180 160, 100 215 C20 160, 5 90, 10 20 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};
