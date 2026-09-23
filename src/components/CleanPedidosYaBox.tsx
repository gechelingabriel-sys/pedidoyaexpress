import React from 'react';

interface CleanPedidosYaBoxProps {
  lidOpenProgress: number; // 0 (closed) to 1 (fully open)
  unzipProgress: number; // 0 to 1
  isGlowing: boolean;
  className?: string;
  size?: number;
}

/**
 * Ultra-clean, photorealistic 100% WATERMARK-FREE PedidosYa delivery box
 * Built with authentic ripstop textures, silver thermal foil lining,
 * crisp vector PedidosYa branding, and cyan zipper pulls.
 */
export const CleanPedidosYaBox: React.FC<CleanPedidosYaBoxProps> = ({
  lidOpenProgress,
  unzipProgress,
  isGlowing,
  className = '',
  size = 400,
}) => {
  const boxWidth = size;
  const boxHeight = size * 0.95;

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width: boxWidth, height: boxHeight }}
    >
      {/* Volumetric warm golden interior glow when opened */}
      {lidOpenProgress > 0.1 && (
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-3/4 h-48 pointer-events-none rounded-full blur-3xl transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(255,220,120,0.85) 0%, rgba(227,26,56,0.4) 60%, rgba(0,0,0,0) 85%)',
            opacity: Math.min(1, lidOpenProgress * 1.5),
          }}
        />
      )}

      {/* Main Delivery Box SVG */}
      <svg
        viewBox="0 0 500 480"
        className="w-full h-full drop-shadow-2xl overflow-visible"
      >
        <defs>
          {/* Authentic PedidosYa Fabric Gradients */}
          <linearGradient id="pedidosYaRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA1D3A" />
            <stop offset="45%" stopColor="#E31A38" />
            <stop offset="100%" stopColor="#B31229" />
          </linearGradient>

          <linearGradient id="boxSideGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9C0E22" />
            <stop offset="100%" stopColor="#6E0917" />
          </linearGradient>

          <linearGradient id="silverReflective" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          <linearGradient id="thermalFoil" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="25%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#F8FAFC" />
            <stop offset="75%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Ripstop nylon grid pattern for authentic textile texture */}
          <pattern id="ripstopTexture" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 8 0 M 0 0 L 0 8" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
          </pattern>

          {/* Silver diamond quilted thermal foil interior */}
          <pattern id="quiltTexture" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 0 10 L 10 0 L 20 10 L 10 20 Z" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
            <path d="M 10 10 L 20 0 M 0 20 L 10 10" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
          </pattern>

          {/* Golden glow inside box */}
          <radialGradient id="interiorGoldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF2A3" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#FBBF24" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#EA1D3A" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Shadow on ground / bike rack */}
        <ellipse cx="250" cy="455" rx="200" ry="22" fill="rgba(15, 23, 42, 0.45)" />

        {/* 3D Box Right Flank (Depth) */}
        <polygon
          points="410,120 465,150 465,420 410,410"
          fill="url(#boxSideGradient)"
          stroke="#4D0610"
          strokeWidth="2"
        />

        {/* Side straps and cyan accents on right flank */}
        <polygon points="410,230 465,248 465,260 410,242" fill="#29C5F6" />
        <polygon points="410,340 465,355 465,366 410,351" fill="#29C5F6" />

        {/* Main Front Body of the Box */}
        <rect
          x="65"
          y="120"
          width="345"
          height="290"
          rx="18"
          fill="url(#pedidosYaRed)"
          stroke="#8A0C1E"
          strokeWidth="3"
        />
        {/* Ripstop texture overlay on front */}
        <rect x="65" y="120" width="345" height="290" rx="18" fill="url(#ripstopTexture)" />

        {/* Lower Grey Reflective Safety Panel */}
        <rect
          x="75"
          y="320"
          width="325"
          height="75"
          rx="8"
          fill="url(#silverReflective)"
          stroke="#475569"
          strokeWidth="2"
        />
        <line x1="75" y1="358" x2="400" y2="358" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />

        {/* Cyan side tabs / pull loops */}
        <rect x="52" y="210" width="16" height="38" rx="4" fill="#29C5F6" stroke="#0284C7" strokeWidth="2" />
        <rect x="52" y="320" width="16" height="38" rx="4" fill="#29C5F6" stroke="#0284C7" strokeWidth="2" />
        <rect x="402" y="210" width="16" height="38" rx="4" fill="#29C5F6" stroke="#0284C7" strokeWidth="2" />

        {/* 100% WATERMARK-FREE PedidosYa LOGO & BRANDING */}
        <g transform="translate(237, 215)">
          {/* Authentic PedidosYa Bold 'P' Emblem */}
          <g transform="translate(0, -32) scale(1.15)">
            {/* White outer 'P' badge */}
            <path
              d="M -30,-42 L 6,-42 C 28,-42 42,-28 42,-6 C 42,16 28,30 6,30 L -12,30 L -12,42 L -30,42 Z"
              fill="#FFFFFF"
            />
            {/* Red inner cutout of the 'P' */}
            <path
              d="M -12,-26 L 5,-26 C 16,-26 24,-18 24,-6 C 24,6 16,14 5,14 L -12,14 Z"
              fill="#E31A38"
            />
          </g>

          {/* Crisp White 'PedidosYa' Wordmark - COMPLETELY CLEAN, NO WATERMARK */}
          <text
            x="0"
            y="52"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="Montserrat, system-ui, sans-serif"
            fontWeight="900"
            fontSize="44"
            letterSpacing="-1"
          >
            PedidosYa
          </text>
        </g>

        {/* Reinforced Seam Stitching details */}
        <rect
          x="73"
          y="128"
          width="329"
          height="274"
          rx="12"
          fill="none"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* INSIDE: Thermal Foil Chamber & Warm Glow (Revealed when lid opens) */}
        {lidOpenProgress > 0 && (
          <g>
            {/* Interior cavity */}
            <path
              d="M 80,125 L 395,125 L 440,70 L 130,70 Z"
              fill="url(#thermalFoil)"
              stroke="#64748B"
              strokeWidth="2"
            />
            {/* Quilt pattern inside */}
            <path
              d="M 80,125 L 395,125 L 440,70 L 130,70 Z"
              fill="url(#quiltTexture)"
            />
            {/* Warm Golden Glow Spilling Out */}
            <path
              d="M 80,125 L 395,125 L 440,70 L 130,70 Z"
              fill="url(#interiorGoldGlow)"
              opacity={Math.min(1, lidOpenProgress * 1.3)}
            />

            {/* Glowing rays shooting upward */}
            {isGlowing && (
              <g opacity={Math.min(1, lidOpenProgress)}>
                <polygon points="170,120 130,-40 220,-60 210,120" fill="rgba(255,235,160,0.3)" />
                <polygon points="230,120 220,-80 300,-80 270,120" fill="rgba(255,245,180,0.4)" />
                <polygon points="290,120 310,-60 390,-30 330,120" fill="rgba(255,230,140,0.3)" />
              </g>
            )}
          </g>
        )}

        {/* TOP LID FLAP: Folds open backward based on lidOpenProgress */}
        <g
          style={{
            transformOrigin: '250px 70px',
            transform: `perspective(600px) rotateX(${lidOpenProgress * 115}deg)`,
            transition: 'transform 0.05s linear',
          }}
        >
          {/* Top Lid Face */}
          <polygon
            points="80,125 395,125 445,65 130,65"
            fill="url(#pedidosYaRed)"
            stroke="#8A0C1E"
            strokeWidth="3"
          />
          <polygon points="80,125 395,125 445,65 130,65" fill="url(#ripstopTexture)" />

          {/* White 'P' icon on top lid */}
          <g transform="translate(260, 95) scale(0.65)">
            <path
              d="M -18,-24 L 4,-24 C 18,-24 26,-16 26,-4 C 26,8 18,16 4,16 L -8,16 L -8,24 L -18,24 Z"
              fill="#FFFFFF"
            />
            <path
              d="M -8,-14 L 3,-14 C 10,-14 15,-9 15,-4 C 15,1 10,6 3,6 L -8,6 Z"
              fill="#E31A38"
            />
          </g>

          {/* Zipper Perimeter along top lid */}
          <path
            d="M 82,123 L 393,123 L 443,67"
            fill="none"
            stroke="#334155"
            strokeWidth="8"
          />
          <path
            d="M 82,123 L 393,123 L 443,67"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
        </g>

        {/* DUAL CYAN ZIPPER PULLS SLIDING ALONG SEAM */}
        {unzipProgress < 0.98 && (
          <g>
            {/* Slider 1: Top edge */}
            <g
              transform={`translate(${82 + unzipProgress * 311}, 123)`}
              className="transition-transform duration-75"
            >
              <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
              {/* Cyan pull tab */}
              <rect x="-5" y="4" width="10" height="24" rx="3" fill="#29C5F6" stroke="#0284C7" strokeWidth="1" />
              <circle cx="0" cy="20" r="2.5" fill="#0F172A" />
            </g>

            {/* Slider 2: Right angled edge */}
            <g
              transform={`translate(${393 + unzipProgress * 50}, ${123 - unzipProgress * 56})`}
              className="transition-transform duration-75"
            >
              <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
              {/* Cyan pull tab */}
              <rect x="-5" y="4" width="10" height="24" rx="3" fill="#29C5F6" stroke="#0284C7" strokeWidth="1" />
              <circle cx="0" cy="20" r="2.5" fill="#0F172A" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
