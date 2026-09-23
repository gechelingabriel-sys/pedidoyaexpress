import React from 'react';

interface GiftPackageSvgProps {
  size?: number;
  className?: string;
  isUnwrapping?: boolean;
}

export const GiftPackageSvg: React.FC<GiftPackageSvgProps> = ({
  size = 290,
  className = '',
  isUnwrapping = false,
}) => {
  return (
    <svg
      viewBox="0 0 340 340"
      width={size}
      height={size}
      className={`overflow-visible select-none drop-shadow-[0_25px_45px_rgba(0,0,0,0.65)] ${className}`}
    >
      <defs>
        {/* Luxury PedidosYa Red Metallic Body Gradient */}
        <linearGradient id="luxuryRedBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF2E4F" />
          <stop offset="35%" stopColor="#EA1D2C" />
          <stop offset="75%" stopColor="#B30B1C" />
          <stop offset="100%" stopColor="#69030E" />
        </linearGradient>

        {/* Box Lid Gradient */}
        <linearGradient id="luxuryRedLid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF4767" />
          <stop offset="50%" stopColor="#E01726" />
          <stop offset="100%" stopColor="#8A0714" />
        </linearGradient>

        {/* Pure Gold Satin Ribbon Gradients */}
        <linearGradient id="goldSatinH" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFF2A3" />
          <stop offset="25%" stopColor="#FFD700" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="85%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="goldSatinV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="30%" stopColor="#FDE047" />
          <stop offset="70%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>

        {/* Shiny Cyan Accent Thread */}
        <linearGradient id="cyanThread" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>

        {/* Subtle Velvet Texture Pattern */}
        <radialGradient id="boxHighlight" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
        </radialGradient>
      </defs>

      {/* Ambient Floor Shadow with Gaussian Softness */}
      <ellipse cx="170" cy="305" rx="125" ry="18" fill="rgba(0, 0, 0, 0.55)" filter="blur(4px)" />

      {/* BOX BODY */}
      <g>
        {/* Main Base Box */}
        <rect
          x="60"
          y="115"
          width="220"
          height="175"
          rx="22"
          fill="url(#luxuryRedBody)"
          stroke="#4D0209"
          strokeWidth="3.5"
        />
        {/* Highlight Over Body */}
        <rect
          x="60"
          y="115"
          width="220"
          height="175"
          rx="22"
          fill="url(#boxHighlight)"
        />

        {/* Subtle Top Bevel */}
        <path
          d="M 68,124 L 272,124"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Vertical Gold Ribbon */}
        <rect
          x="151"
          y="115"
          width="38"
          height="175"
          fill="url(#goldSatinH)"
          stroke="#92400E"
          strokeWidth="1.5"
        />
        {/* Cyan center filament */}
        <line x1="170" y1="115" x2="170" y2="290" stroke="url(#cyanThread)" strokeWidth="3" />

        {/* Horizontal Gold Ribbon */}
        <rect
          x="60"
          y="185"
          width="220"
          height="36"
          fill="url(#goldSatinV)"
          stroke="#92400E"
          strokeWidth="1.5"
        />
        <line x1="60" y1="203" x2="280" y2="203" stroke="url(#cyanThread)" strokeWidth="3" />

        {/* PedidosYa Official Gold Seal in the Ribbon Crossing */}
        <g transform="translate(170, 203)">
          <circle cx="0" cy="0" r="26" fill="#FEF08A" stroke="#B45309" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="22" fill="#EA1D2C" />
          {/* Embossed 'P' */}
          <path
            d="M -7,-12 L 2,-12 C 9,-12 14,-7 14,0 C 14,7 9,12 2,12 L -7,12 Z"
            fill="#FFFFFF"
          />
          <path
            d="M -3,-7 L 2,-7 C 6,-7 9,-4 9,0 C 9,4 6,7 2,7 L -3,7 Z"
            fill="#EA1D2C"
          />
        </g>

        {/* Hanging Luxury Gift Tag */}
        <g transform="translate(100, 160) rotate(-12)">
          {/* Metallic Gold String */}
          <line x1="50" y1="-5" x2="0" y2="22" stroke="#FEF08A" strokeWidth="2.5" strokeDasharray="3,1" />
          {/* Tag Card */}
          <polygon
            points="0,22 34,38 18,78 -16,62"
            fill="#FFFDF7"
            stroke="#D97706"
            strokeWidth="2"
            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
          />
          <circle cx="2" cy="30" r="3.5" fill="#B45309" />
          {/* Calligraphic Recipient */}
          <text
            x="8"
            y="54"
            fontSize="9"
            fontWeight="900"
            fill="#B91C1C"
            fontFamily="Montserrat, sans-serif"
            transform="rotate(25, 8, 54)"
          >
            Para: Chinita ✨
          </text>
        </g>
      </g>

      {/* 
        BOX LID & GIANT SATIN BOW
        Animates flying up and untying when isUnwrapping is true
      */}
      <g
        style={{
          transform: isUnwrapping ? 'translateY(-95px) rotate(-14deg) scale(0.92)' : 'none',
          opacity: isUnwrapping ? 0 : 1,
          transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease-out',
          transformOrigin: '170px 100px',
        }}
      >
        {/* Lid Beveled Rim */}
        <rect
          x="48"
          y="88"
          width="244"
          height="44"
          rx="12"
          fill="url(#luxuryRedLid)"
          stroke="#4D0209"
          strokeWidth="3.5"
        />

        {/* Vertical Ribbon crossing Lid */}
        <rect
          x="151"
          y="88"
          width="38"
          height="44"
          fill="url(#goldSatinH)"
          stroke="#92400E"
          strokeWidth="1.5"
        />
        <line x1="170" y1="88" x2="170" y2="132" stroke="url(#cyanThread)" strokeWidth="3" />

        {/* GIANT 3D SATIN BOW (Moño de Lujo) */}
        <g transform="translate(170, 88)">
          {/* Left Ribbon Cascade Tail */}
          <path
            d="M -12,0 C -36,25 -58,55 -70,80 C -52,72 -40,62 -28,54 C -16,46 -6,28 0,0 Z"
            fill="url(#goldSatinV)"
            stroke="#92400E"
            strokeWidth="1.8"
          />

          {/* Right Ribbon Cascade Tail */}
          <path
            d="M 12,0 C 36,25 58,55 75,76 C 58,70 46,60 35,52 C 22,44 10,26 0,0 Z"
            fill="url(#goldSatinV)"
            stroke="#92400E"
            strokeWidth="1.8"
          />

          {/* Left Large Outer Loop */}
          <path
            d="M 0,-5 C -40,-42 -96,-34 -90,-2 C -84,28 -28,12 0,0 Z"
            fill="url(#goldSatinH)"
            stroke="#92400E"
            strokeWidth="2.2"
          />
          {/* Left Deep Fold Shadow */}
          <path
            d="M -6,-3 C -35,-26 -75,-22 -70,-2 C -64,16 -24,8 0,0 Z"
            fill="#B45309"
            opacity="0.65"
          />

          {/* Right Large Outer Loop */}
          <path
            d="M 0,-5 C 40,-42 96,-34 90,-2 C 84,28 28,12 0,0 Z"
            fill="url(#goldSatinH)"
            stroke="#92400E"
            strokeWidth="2.2"
          />
          {/* Right Deep Fold Shadow */}
          <path
            d="M 6,-3 C 35,-26 75,-22 70,-2 C 64,16 24,8 0,0 Z"
            fill="#B45309"
            opacity="0.65"
          />

          {/* Center Upper Tufts */}
          <ellipse cx="-20" cy="-18" rx="20" ry="14" transform="rotate(-30 -20 -18)" fill="url(#goldSatinV)" stroke="#92400E" strokeWidth="1.8" />
          <ellipse cx="20" cy="-18" rx="20" ry="14" transform="rotate(30 20 -18)" fill="url(#goldSatinV)" stroke="#92400E" strokeWidth="1.8" />

          {/* Center Rosette Knot */}
          <ellipse cx="0" cy="-4" rx="18" ry="15" fill="url(#goldSatinH)" stroke="#92400E" strokeWidth="2.2" />
          <circle cx="0" cy="-4" r="6" fill="#FEF08A" />
        </g>
      </g>
    </svg>
  );
};
