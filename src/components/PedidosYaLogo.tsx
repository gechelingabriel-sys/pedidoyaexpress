import React from 'react';

interface PedidosYaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const PedidosYaLogo: React.FC<PedidosYaLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-xl',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon Badge */}
      <div className={`relative ${iconSizes[size]} rounded-2xl bg-gradient-to-br from-[#FF1E46] via-[#EA1D2C] to-[#B30B1C] flex items-center justify-center shadow-[0_6px_20px_rgba(234,29,44,0.45)] border border-white/25 overflow-hidden shrink-0 group`}>
        {/* Subtle glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-80" />
        
        {/* The Iconic PedidosYa 'P' */}
        <svg
          viewBox="0 0 32 32"
          className="w-[62%] h-[62%] text-white fill-current relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
        >
          {/* Official PedidosYa 'P' shape with rounded stem and bold loop */}
          <path d="M7 6.5 C 7 5.12 8.12 4 9.5 4 L 17.5 4 C 23.3 4 27.5 8.2 27.5 14 C 27.5 19.8 23.3 24 17.5 24 L 13.5 24 L 13.5 27.5 C 13.5 28.88 12.38 30 11 30 L 9.5 30 C 8.12 30 7 28.88 7 27.5 Z M 13.5 18 L 17.2 C 19.8 18 21.6 16.2 21.6 14 C 21.6 11.8 19.8 10 17.2 10 L 13.5 10 Z" />
        </svg>

        {/* Shimmer line */}
        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 animate-shimmer" />
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight">
          <span className={`font-black text-white ${textSizes[size]}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Pedidos
          </span>
          <span className={`font-black text-[#FF385C] ${textSizes[size]}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Ya
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] ml-1 shadow-[0_0_8px_#FFD700]" />
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 -mt-0.5">
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-amber-300 drop-shadow-sm">
              Entrega Especial a Córdoba
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
