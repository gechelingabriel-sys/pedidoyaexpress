import React from 'react';
import { ProSteamAnimation } from './ProSteamAnimation';

interface HotFoodPackageProps {
  size?: number;
  className?: string;
  isOpening?: boolean;
}

export const HotFoodPackage: React.FC<HotFoodPackageProps> = ({
  size = 300,
  className = '',
  isOpening = false,
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 
        PRO REALISTIC STEAM EMITTER (CANVAS VOLUMETRIC PUFFS)
      */}
      <div className="absolute -top-24 sm:-top-28 inset-x-0 flex justify-center pointer-events-none z-30">
        <ProSteamAnimation
          width={340}
          height={170}
          isBursting={isOpening}
          className="scale-105"
        />
      </div>

      {/* 
        ADDITIONAL STYLIZED STEAM STREAMS & WAVY VAPOR
      */}
      <div className="absolute -top-16 sm:-top-20 inset-x-0 flex justify-center pointer-events-none z-20">
        <svg
          viewBox="0 0 260 140"
          className="w-56 sm:w-64 h-28 sm:h-32 overflow-visible opacity-95"
        >
          <defs>
            <linearGradient id="steamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
              <stop offset="35%" stopColor="rgba(254, 215, 170, 0.65)" />
              <stop offset="70%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>
            <filter id="steamBlur">
              <feGaussianBlur stdDeviation="4.5" />
            </filter>
          </defs>

          {/* Left Steam Stream */}
          <path
            d="M 65,130 C 45,95 85,65 60,35 C 40,8 70,-15 55,-35"
            fill="none"
            stroke="url(#steamGrad)"
            strokeWidth="11"
            strokeLinecap="round"
            filter="url(#steamBlur)"
            className="animate-steam-1"
          />

          {/* Center Main Steam Cloud */}
          <path
            d="M 130,135 C 110,90 155,55 125,20 C 100,-15 145,-45 115,-70"
            fill="none"
            stroke="url(#steamGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            filter="url(#steamBlur)"
            className="animate-steam-2"
          />

          {/* Right Steam Stream */}
          <path
            d="M 195,130 C 215,95 175,65 200,35 C 220,8 190,-15 205,-35"
            fill="none"
            stroke="url(#steamGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            filter="url(#steamBlur)"
            className="animate-steam-3"
          />
        </svg>
      </div>

      {/* Heat Glow Aura (Pulsing Red/Amber Heat that burns) */}
      <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-t from-red-600/50 via-amber-500/40 to-yellow-400/25 blur-3xl pointer-events-none animate-heat-pulse" />

      {/* SIZZLING BURNING FOOD BAG / CONTAINER */}
      <div
        className={`relative ${
          isOpening
            ? 'scale-110 -translate-y-4 opacity-0 transition-all duration-700 ease-out'
            : 'animate-burning-shake'
        }`}
      >
        <svg
          viewBox="0 0 340 360"
          width={size}
          height={size * 1.05}
          className="overflow-visible drop-shadow-[0_25px_50px_rgba(234,29,44,0.45)]"
        >
          <defs>
            {/* Kraft Thermal Bag Gradients */}
            <linearGradient id="kraftBagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C88E53" />
              <stop offset="35%" stopColor="#B3783E" />
              <stop offset="70%" stopColor="#9C6228" />
              <stop offset="100%" stopColor="#784817" />
            </linearGradient>

            <linearGradient id="bagFoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D99F65" />
              <stop offset="100%" stopColor="#8A531F" />
            </linearGradient>

            {/* Glowing Internal Heat Escaping */}
            <radialGradient id="ventGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFAA00" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#FF3300" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FF0000" stopOpacity="0" />
            </radialGradient>

            {/* PedidosYa Red Seal Tape */}
            <linearGradient id="pyaTapeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF1E46" />
              <stop offset="50%" stopColor="#EA1D2C" />
              <stop offset="100%" stopColor="#B30B1C" />
            </linearGradient>
          </defs>

          {/* Ambient Floor Heat Shadow */}
          <ellipse cx="170" cy="335" rx="125" ry="18" fill="rgba(0, 0, 0, 0.65)" />
          <ellipse cx="170" cy="335" rx="100" ry="12" fill="rgba(255, 68, 0, 0.35)" filter="blur(6px)" />

          {/* MAIN KRAFT DELIVERY BAG BODY */}
          <g>
            {/* Bag Body with thermal crinkles and folded creases */}
            <path
              d="M 65,115 L 275,115 L 290,315 C 290,328 278,335 265,335 L 75,335 C 62,335 50,328 50,315 Z"
              fill="url(#kraftBagGrad)"
              stroke="#5A340E"
              strokeWidth="3.5"
            />

            {/* Left and Right Side Gusset Folds (Realistic food bag creases) */}
            <path
              d="M 65,115 L 85,335"
              stroke="rgba(0,0,0,0.22)"
              strokeWidth="3"
            />
            <path
              d="M 275,115 L 255,335"
              stroke="rgba(0,0,0,0.22)"
              strokeWidth="3"
            />

            {/* Heat vents on side emitting internal glowing warmth */}
            <ellipse cx="68" cy="210" rx="4" ry="10" fill="#2A1404" />
            <circle cx="68" cy="210" r="14" fill="url(#ventGlow)" />

            <ellipse cx="272" cy="210" rx="4" ry="10" fill="#2A1404" />
            <circle cx="272" cy="210" r="14" fill="url(#ventGlow)" />

            {/* STEAM VENTS AT TOP */}
            <ellipse cx="110" cy="115" rx="12" ry="4" fill="url(#ventGlow)" />
            <ellipse cx="170" cy="115" rx="18" ry="5" fill="url(#ventGlow)" />
            <ellipse cx="230" cy="115" rx="12" ry="4" fill="url(#ventGlow)" />

            {/* Top Rolled/Folded Paper Lip */}
            <path
              d="M 58,80 L 282,80 C 288,80 292,85 290,92 L 282,122 C 280,126 276,128 270,128 L 70,128 C 64,128 60,126 58,122 L 50,92 C 48,85 52,80 58,80 Z"
              fill="url(#bagFoldGrad)"
              stroke="#5A340E"
              strokeWidth="3"
            />

            {/* PedidosYa Red Security Thermal Seal Tape across fold */}
            <rect
              x="138"
              y="68"
              width="64"
              height="80"
              rx="6"
              fill="url(#pyaTapeGrad)"
              stroke="#990B19"
              strokeWidth="2"
              filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
            />
            {/* White 'P' icon on security seal */}
            <circle cx="170" cy="100" r="16" fill="#FFFFFF" />
            <path
              d="M 163,89 L 169,89 C 174,89 177,92 177,96 C 177,100 174,103 169,103 L 163,103 Z M 166,100 L 169,100 C 171,100 173,99 173,96 C 173,93 171,92 169,92 L 166,92 Z"
              fill="#EA1D2C"
              transform="scale(1.1) translate(-14, -8)"
            />

            {/* PedidosYa Official Hot Stamp on Bag */}
            <g transform="translate(170, 215)">
              <rect
                x="-95"
                y="-26"
                width="190"
                height="52"
                rx="14"
                fill="#FFFDF7"
                stroke="#EA1D2C"
                strokeWidth="2.5"
                filter="drop-shadow(0 6px 12px rgba(0,0,0,0.22))"
              />
              <text
                x="0"
                y="5"
                fontSize="20"
                fontWeight="900"
                fill="#EA1D2C"
                textAnchor="middle"
                fontFamily="Montserrat, sans-serif"
                letterSpacing="0.5"
              >
                Pedidos<tspan fill="#FF1E46">Ya</tspan>
              </text>
              <text
                x="0"
                y="18"
                fontSize="9"
                fontWeight="800"
                fill="#9C6228"
                textAnchor="middle"
                fontFamily="Montserrat, sans-serif"
                letterSpacing="1"
              >
                ENTREGA ESPECIAL A CÓRDOBA
              </text>
            </g>

            {/* Greaseproof paper rim peek */}
            <path
              d="M 85,115 Q 120,105 170,115 Q 220,105 255,115"
              fill="none"
              stroke="#FFF9C4"
              strokeWidth="4"
              strokeDasharray="6,4"
              opacity="0.8"
            />
          </g>
        </svg>
      </div>

      {/* Floating Thermal Steam Sparks (Ember Dots) */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <span className="absolute top-2 left-1/4 w-2 h-2 rounded-full bg-amber-400/90 animate-ping blur-[1px]" />
        <span className="absolute top-0 right-1/4 w-2.5 h-2.5 rounded-full bg-orange-500/80 animate-ping blur-[1px]" />
        <span className="absolute -top-4 left-1/2 w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping" />
      </div>
    </div>
  );
};
