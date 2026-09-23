import React, { useEffect, useRef } from 'react';

interface ProSteamAnimationProps {
  className?: string;
  isBursting?: boolean; // True when unboxing/downloading
  width?: number;
  height?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobbleOffset: number;
  hue: number;
}

export const ProSteamAnimation: React.FC<ProSteamAnimationProps> = ({
  className = '',
  isBursting = false,
  width = 360,
  height = 240,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const isBurstingRef = useRef<boolean>(isBursting);

  useEffect(() => {
    isBurstingRef.current = isBursting;
  }, [isBursting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const createParticle = (originX: number, originY: number, burst: boolean): Particle => {
      const spreadX = burst ? (Math.random() - 0.5) * 120 : (Math.random() - 0.5) * 55;
      const initialRadius = burst ? 12 + Math.random() * 16 : 8 + Math.random() * 10;
      const maxRadius = burst ? 55 + Math.random() * 45 : 36 + Math.random() * 26;
      const maxLife = burst ? 55 + Math.random() * 35 : 75 + Math.random() * 45;
      const vy = burst ? -(2.8 + Math.random() * 3.5) : -(1.2 + Math.random() * 1.5);
      const vx = (Math.random() - 0.5) * (burst ? 2.4 : 0.7);

      return {
        x: originX + spreadX,
        y: originY + (Math.random() - 0.5) * 12,
        vx,
        vy,
        radius: initialRadius,
        maxRadius,
        alpha: 0,
        maxAlpha: burst ? 0.75 + Math.random() * 0.2 : 0.45 + Math.random() * 0.25,
        life: 0,
        maxLife,
        wobbleSpeed: 0.04 + Math.random() * 0.05,
        wobbleAmp: 0.6 + Math.random() * 1.2,
        wobbleOffset: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.4 ? 40 : 25, // warm amber/ivory steam
      };
    };

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Spawn rate
      const spawnCount = isBurstingRef.current ? 4 : 1;
      const originX = width / 2;
      const originY = height - 15;

      for (let i = 0; i < spawnCount; i++) {
        if (particlesRef.current.length < (isBurstingRef.current ? 120 : 55)) {
          // Three main vent ports
          const portOffset = (Math.floor(Math.random() * 3) - 1) * 35;
          particlesRef.current.push(createParticle(originX + portOffset, originY, isBurstingRef.current));
        }
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life++;

        // Life progression 0 -> 1
        const progress = p.life / p.maxLife;

        // Smooth fade-in then fade-out
        if (progress < 0.2) {
          p.alpha = (progress / 0.2) * p.maxAlpha;
        } else {
          p.alpha = (1 - (progress - 0.2) / 0.8) * p.maxAlpha;
        }

        // Expansion
        p.radius = p.radius + (p.maxRadius - p.radius) * 0.035;

        // Physics motion with turbulent sine waft
        p.x += p.vx + Math.sin(time * 3 + p.wobbleOffset) * p.wobbleAmp;
        p.y += p.vy;

        // Draw soft volumetric puff
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, p.radius));
        grad.addColorStop(0, `rgba(255, 253, 245, ${p.alpha})`);
        grad.addColorStop(0.35, `rgba(254, 243, 199, ${p.alpha * 0.75})`);
        grad.addColorStop(0.7, `rgba(253, 230, 138, ${p.alpha * 0.35})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Remove dead particles
        if (p.life >= p.maxLife || p.y < -p.radius) {
          particlesRef.current.splice(i, 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [width, height]);

  return (
    <div className={`pointer-events-none relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full filter drop-shadow-[0_0_12px_rgba(255,200,100,0.35)]"
      />
    </div>
  );
};
