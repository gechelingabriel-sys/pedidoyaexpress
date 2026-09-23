import React from 'react';

interface MotorcycleSvgProps {
  wheelRotation: number;
  className?: string;
  size?: number;
}

/**
 * High-detail delivery motorcycle with delivery rider, spinning wheels,
 * chrome details, and rear luggage rack mounting the PedidosYa delivery bag.
 */
export const MotorcycleSvg: React.FC<MotorcycleSvgProps> = ({
  wheelRotation,
  className = '',
  size = 480,
}) => {
  return (
    <svg
      viewBox="0 0 540 360"
      width={size}
      height={size * (360 / 540)}
      className={`drop-shadow-2xl overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id="motoFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <linearGradient id="motoChrome" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="40%" stopColor="#CBD5E1" />
          <stop offset="70%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        <linearGradient id="pedidosRedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EA1D3A" />
          <stop offset="100%" stopColor="#B31229" />
        </linearGradient>
      </defs>

      {/* Shadow under motorcycle */}
      <ellipse cx="270" cy="335" rx="230" ry="18" fill="rgba(15, 23, 42, 0.55)" />

      {/* FRONT WHEEL (Left side since bike is facing left) */}
      <g transform="translate(110, 270)">
        {/* Tire */}
        <circle cx="0" cy="0" r="54" fill="#0F172A" stroke="#1E293B" strokeWidth="8" />
        {/* Rim */}
        <circle cx="0" cy="0" r="38" fill="none" stroke="url(#motoChrome)" strokeWidth="6" />
        <circle cx="0" cy="0" r="14" fill="#334155" stroke="#94A3B8" strokeWidth="3" />
        {/* Spinning spokes */}
        <g style={{ transform: `rotate(${-wheelRotation}deg)`, transformOrigin: '0px 0px' }}>
          <line x1="-36" y1="0" x2="36" y2="0" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="0" y1="-36" x2="0" y2="36" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="-25" y1="-25" x2="25" y2="25" stroke="#94A3B8" strokeWidth="2.5" />
          <line x1="-25" y1="25" x2="25" y2="-25" stroke="#94A3B8" strokeWidth="2.5" />
        </g>
        {/* Disc brake caliper */}
        <path d="M 12,-18 A 24 24 0 0 1 28,6" fill="none" stroke="#E31A38" strokeWidth="8" strokeLinecap="round" />
      </g>

      {/* REAR WHEEL (Right side) */}
      <g transform="translate(420, 270)">
        {/* Tire */}
        <circle cx="0" cy="0" r="54" fill="#0F172A" stroke="#1E293B" strokeWidth="8" />
        {/* Rim */}
        <circle cx="0" cy="0" r="38" fill="none" stroke="url(#motoChrome)" strokeWidth="6" />
        <circle cx="0" cy="0" r="14" fill="#334155" stroke="#94A3B8" strokeWidth="3" />
        {/* Spinning spokes */}
        <g style={{ transform: `rotate(${-wheelRotation}deg)`, transformOrigin: '0px 0px' }}>
          <line x1="-36" y1="0" x2="36" y2="0" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="0" y1="-36" x2="0" y2="36" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="-25" y1="-25" x2="25" y2="25" stroke="#94A3B8" strokeWidth="2.5" />
          <line x1="-25" y1="25" x2="25" y2="-25" stroke="#94A3B8" strokeWidth="2.5" />
        </g>
        {/* Rear sprocket chain */}
        <circle cx="0" cy="0" r="22" fill="none" stroke="#64748B" strokeWidth="4" strokeDasharray="3 3" />
      </g>

      {/* MOTORCYCLE FRAME & SUSPENSION */}
      {/* Front telescopic fork */}
      <line x1="110" y1="270" x2="160" y2="135" stroke="url(#motoChrome)" strokeWidth="12" strokeLinecap="round" />
      <line x1="118" y1="270" x2="166" y2="135" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
      {/* Front fender / mudguard */}
      <path d="M 60,250 A 62 62 0 0 1 155,220" fill="none" stroke="#E31A38" strokeWidth="9" strokeLinecap="round" />

      {/* Rear swingarm & drive unit */}
      <polygon points="260,280 420,270 380,250 250,260" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      {/* Chrome exhaust muffler */}
      <path d="M 270,290 L 400,285 L 435,275 L 440,288 L 400,300 L 270,300 Z" fill="url(#motoChrome)" stroke="#475569" strokeWidth="2" />
      {/* Exhaust tip */}
      <ellipse cx="438" cy="281" rx="5" ry="8" fill="#0F172A" />

      {/* Main motorcycle body fairing */}
      <path
        d="M 155,140 L 210,140 L 260,185 L 340,190 L 400,225 L 350,260 L 230,265 L 175,225 Z"
        fill="url(#motoFrameGrad)"
        stroke="#0F172A"
        strokeWidth="3"
      />

      {/* Red sports trim accent on bike body */}
      <path
        d="M 165,150 L 205,150 L 245,185 L 210,215 L 180,180 Z"
        fill="url(#pedidosRedGrad)"
      />

      {/* Engine block */}
      <rect x="235" y="225" width="60" height="45" rx="6" fill="#475569" stroke="#1E293B" strokeWidth="2" />
      <line x1="240" y1="235" x2="290" y2="235" stroke="#94A3B8" strokeWidth="2" />
      <line x1="240" y1="245" x2="290" y2="245" stroke="#94A3B8" strokeWidth="2" />
      <line x1="240" y1="255" x2="290" y2="255" stroke="#94A3B8" strokeWidth="2" />

      {/* Driver Seat & Pillion */}
      <path
        d="M 240,185 C 265,180 295,185 330,192 C 345,195 370,198 385,200 L 375,215 L 245,210 Z"
        fill="#020617"
        stroke="#1E293B"
        strokeWidth="2"
      />

      {/* Front Headlight & Windscreen */}
      <polygon points="140,130 165,130 155,160 130,150" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
      <polygon points="138,132 145,132 135,152 130,148" fill="#FEF08A" opacity="0.9" />
      {/* Headlight beam glow */}
      <polygon points="130,140 -20,100 -20,240 130,155" fill="rgba(254, 240, 138, 0.15)" />

      {/* Handlebars & Mirror */}
      <line x1="165" y1="135" x2="190" y2="105" stroke="url(#motoChrome)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="190" cy="105" r="8" fill="#0F172A" />
      {/* Mirror */}
      <ellipse cx="195" cy="85" rx="10" ry="6" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />

      {/* REAR LUGGAGE RACK */}
      <path
        d="M 360,205 L 440,200 L 460,215 L 380,225 Z"
        fill="#1E293B"
        stroke="#475569"
        strokeWidth="3"
      />
      <line x1="390" y1="205" x2="420" y2="250" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

      {/* DELIVERY RIDER / COURIER */}
      {/* Torso with PedidosYa Red Jacket */}
      <g transform="translate(260, 105)">
        {/* Back and chest */}
        <path
          d="M -15,50 C -10,15 15,10 35,20 C 50,28 55,60 45,85 L 15,85 C 0,85 -10,75 -15,50 Z"
          fill="#E31A38"
          stroke="#9C0E22"
          strokeWidth="2"
        />
        {/* Arm reaching forward to handlebar */}
        <path
          d="M 25,30 L -50,15 L -68,5"
          fill="none"
          stroke="#B31229"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Glove */}
        <circle cx="-70" cy="5" r="8" fill="#0F172A" />

        {/* Head & Helmet */}
        <circle cx="28" cy="-5" r="26" fill="#E31A38" stroke="#9C0E22" strokeWidth="3" />
        {/* Dark Visor */}
        <path d="M 8,-10 Q 0,0 6,10 L 22,12 Q 18,-2 18,-10 Z" fill="#0F172A" stroke="#334155" strokeWidth="2" />
        {/* Helmet white 'P' badge */}
        <circle cx="34" cy="-5" r="5" fill="#FFFFFF" />
      </g>
    </svg>
  );
};
