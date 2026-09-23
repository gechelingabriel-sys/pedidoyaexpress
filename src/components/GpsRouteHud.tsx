import React from 'react';
import { Navigation, MapPin, Compass, ShieldCheck } from 'lucide-react';

interface GpsRouteHudProps {
  progress: number; // 0 to 1
  className?: string;
}

export const GpsRouteHud: React.FC<GpsRouteHudProps> = ({ progress, className = '' }) => {
  const currentProgress = Math.min(1, Math.max(0, progress));
  
  // Real-time speed calculation that slows down smoothly as it approaches destination
  const speed = currentProgress < 0.85
    ? Math.round(42 + Math.sin(currentProgress * 15) * 6)
    : Math.max(0, Math.round((1 - currentProgress) * 110));

  // Winding route coordinates through the urban planito (SVG dimensions: 280 x 130)
  // Route: Alicante (left) -> Motorway curve -> Córdoba (right)
  // Path description: M 35,100 C 65,95 85,60 135,65 C 180,70 210,35 245,40
  const pathTotalLength = 230;
  const strokeDashoffset = pathTotalLength * (1 - currentProgress);

  // Approximate parametric coordinates for the courier marker on the curve
  // Curve from (35, 100) through (135, 65) to (245, 40)
  let markerX = 35 + currentProgress * 210;
  let markerY = 100 - currentProgress * 60 + Math.sin(currentProgress * Math.PI) * 12;

  // Turn prompt based on progress
  let navPrompt = 'Ruta Express Alicante ➔ Córdoba';
  let subPrompt = 'Por Autovía Especial de Entrega';
  if (currentProgress > 0.85) {
    navPrompt = 'Llegando al destino en Córdoba';
    subPrompt = 'Preparando entrega en domicilio';
  } else if (currentProgress > 0.45) {
    navPrompt = 'Aproximando a Córdoba Centro';
    subPrompt = 'Continuar 500m directo';
  }

  return (
    <div
      className={`bg-slate-950/95 backdrop-blur-xl border-2 border-emerald-500/80 rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.92)] p-2.5 sm:p-3 select-none transition-all duration-300 w-[calc(100vw-24px)] max-w-[310px] ${className}`}
    >
      {/* Header bar: GPS Route Header with Origin & Destination */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div className="flex items-center gap-1 text-[11px] font-black tracking-wide text-white">
            <span className="text-emerald-400">Alicante</span>
            <span className="text-amber-400 font-extrabold">➔</span>
            <span className="text-rose-400">Córdoba</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono font-black text-amber-300">
          <span>{speed}</span>
          <span className="text-[9px] text-slate-400 font-sans">km/h</span>
        </div>
      </div>

      {/* 
        DETAILED VECTOR CITY PLANITO (MAPA DE CALLES Y RUTA)
        With blocks, streets, roundabout, canal/green areas, and glowing route
      */}
      <div className="relative w-full h-28 bg-[#0D1520] rounded-xl overflow-hidden border border-slate-700/60 shadow-inner">
        <svg viewBox="0 0 280 130" className="w-full h-full">
          <defs>
            {/* Street Grid pattern */}
            <pattern id="streetBlocks" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect x="2" y="2" width="36" height="36" rx="4" fill="#132032" stroke="#1E293B" strokeWidth="0.8" />
            </pattern>

            {/* Glowing active route gradient */}
            <linearGradient id="routeGlow" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <filter id="routeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#06B6D4" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Urban City Blocks */}
          <rect width="280" height="130" fill="url(#streetBlocks)" opacity="0.85" />

          {/* Green Parks / Coastal curve background accents */}
          <path d="M 0,110 Q 50,120 70,130 L 0,130 Z" fill="#064E3B" opacity="0.35" />
          <path d="M 210,0 Q 250,20 280,10 L 280,0 Z" fill="#1E3A8A" opacity="0.3" />

          {/* Secondary Arterial Streets */}
          <path d="M 0,45 L 280,45" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
          <path d="M 0,90 L 280,90" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
          <path d="M 90,0 L 90,130" stroke="#334155" strokeWidth="3" opacity="0.5" />
          <path d="M 195,0 L 195,130" stroke="#334155" strokeWidth="3" opacity="0.5" />

          {/* Roundabout feature in middle */}
          <circle cx="135" cy="65" r="14" fill="#0D1520" stroke="#334155" strokeWidth="2.5" />
          <circle cx="135" cy="65" r="7" fill="#1E293B" />

          {/* Highway Planned Track */}
          <path
            d="M 35,100 C 65,95 85,60 135,65 C 180,70 210,35 245,40"
            fill="none"
            stroke="#1E293B"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 35,100 C 65,95 85,60 135,65 C 180,70 210,35 245,40"
            fill="none"
            stroke="#475569"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Active Glowing Route Path */}
          <path
            d="M 35,100 C 65,95 85,60 135,65 C 180,70 210,35 245,40"
            fill="none"
            stroke="url(#routeGlow)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={pathTotalLength}
            strokeDashoffset={strokeDashoffset}
            filter="url(#routeShadow)"
          />

          {/* ORIGIN PIN: ALICANTE */}
          <g transform="translate(35, 100)">
            <circle cx="0" cy="0" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="-24" y="-19" width="48" height="13" rx="3" fill="#0F172A" stroke="#10B981" strokeWidth="0.8" />
            <text x="0" y="-10" fill="#34D399" fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              ALICANTE
            </text>
          </g>

          {/* DESTINATION PIN: CÓRDOBA */}
          <g transform="translate(245, 40)">
            <circle cx="0" cy="0" r="8" fill="rgba(234, 29, 44, 0.35)" className="animate-ping" />
            <circle cx="0" cy="0" r="4.5" fill="#EA1D2C" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="-24" y="-21" width="48" height="13" rx="3" fill="#0F172A" stroke="#EA1D2C" strokeWidth="0.8" />
            <text x="0" y="-12" fill="#F87171" fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              CÓRDOBA
            </text>
          </g>

          {/* LIVE MOTORCYCLE COURIER POSITION */}
          <g transform={`translate(${markerX}, ${markerY})`}>
            <circle cx="0" cy="0" r="7" fill="rgba(56, 189, 248, 0.45)" className="animate-ping" />
            <circle cx="0" cy="0" r="4.5" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.5" />
            <path d="M -3,-3 L 3,0 L -3,3 Z" fill="#0F172A" transform="rotate(-15)" />
          </g>
        </svg>

        {/* Floating Mini Compass Tag */}
        <div className="absolute bottom-1.5 left-2 flex items-center gap-1 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700/60 text-[9px] font-bold text-slate-300">
          <Compass className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '9s' }} />
          <span>Ruta Alicante · Córdoba</span>
        </div>
      </div>

      {/* Turn Directive & Status */}
      <div className="flex items-center justify-between text-xs mt-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <Navigation className="w-3.5 h-3.5 fill-current rotate-45" />
          </div>
          <div>
            <div className="font-black text-white text-[11px] leading-tight">
              {navPrompt}
            </div>
            <div className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-[#EA1D2C]" />
              <span>{subPrompt}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-black font-mono text-emerald-400">
            {currentProgress >= 0.95 ? 'Llegando' : `${Math.round((1 - currentProgress) * 650)}m`}
          </span>
          <div className="text-[9px] text-slate-400 font-medium">
            {currentProgress >= 0.95 ? 'Destino' : 'ETA ~1 min'}
          </div>
        </div>
      </div>
    </div>
  );
};
