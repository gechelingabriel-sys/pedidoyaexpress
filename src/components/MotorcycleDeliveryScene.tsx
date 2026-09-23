import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MotorcycleSvg } from './MotorcycleSvg';
import { CleanPedidosYaBox } from './CleanPedidosYaBox';
import { HotFoodPackage } from './HotFoodPackage';
import { DeliveryTicket } from './DeliveryTicket';
import { GpsRouteHud } from './GpsRouteHud';
import { PedidosYaLogo } from './PedidosYaLogo';
import { audioEngine } from '../utils/audioEngine';
import { downloadChinitaPhoto } from '../utils/downloadPhoto';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const MotorcycleDeliveryScene: React.FC = () => {
  const [animTime, setAnimTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Responsive device check for iPhone, Samsung S24 and modern mobile devices
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // States for surprise download progression:
  // 'idle' -> 'animating' -> 'hot_package_showcase' (10s) -> 'ticket_ready' -> 'downloading' -> 'photo_revealed'
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isPhotoRevealed, setIsPhotoRevealed] = useState<boolean>(false);

  // TIMELINE MILESTONES:
  // 0.0s - 4.6s: Motorcycle travels with GPS Route HUD (Alicante -> Córdoba)
  // 4.9s - 5.8s: Arrival & Doorbell
  // 5.8s - 7.0s: Zoom-in directly on the thermal delivery box
  // 7.0s - 8.2s: Zipper unzips
  // 8.2s - 9.4s: Box lid opens with warm golden glow
  // 9.4s - 10.6s: Hot steaming package emerges
  // 10.6s - 20.6s: Exactly 10.0 seconds of hot package showcase (shaking with heat & steam)
  // 20.6s+: Ticket de Pedido Pagado y Entregado appears automatically!
  const deliveryCompleteTime = 20.6;
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const soundCuesTriggered = useRef<Set<string>>(new Set());

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioEngine.setMuted(next);
  };

  const handlePlayToggle = () => {
    audioEngine.init();
    if (!hasStarted) {
      setHasStarted(true);
      audioEngine.startBackgroundMusic();
    }
    if (animTime >= deliveryCompleteTime && !isPhotoRevealed) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    soundCuesTriggered.current.clear();
    setIsPhotoRevealed(false);
    setIsDownloading(false);
    setDownloadProgress(0);
    setAnimTime(0);
    setIsPlaying(true);
    audioEngine.startBackgroundMusic();
  };

  // Grand celebratory confetti cannons
  const triggerConfetti = useCallback(() => {
    const colors = ['#E31A38', '#FF5722', '#FFD700', '#FFFFFF', '#FF1E46', '#FFE082'];
    
    // Center blast
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.5 },
      colors,
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 90,
        angle: 60,
        spread: 75,
        origin: { x: 0.05, y: 0.6 },
        colors,
      });
    }, 200);

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 90,
        angle: 120,
        spread: 75,
        origin: { x: 0.95, y: 0.6 },
        colors,
      });
    }, 350);
  }, []);

  // Main animation ticker
  useEffect(() => {
    const updateLoop = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        setAnimTime((prev) => {
          const next = prev + delta;

          // Sound cues with smooth pacing
          if (next >= 0.05 && next < 0.3 && !soundCuesTriggered.current.has('motorcycle')) {
            soundCuesTriggered.current.add('motorcycle');
            audioEngine.playMotorcycle();
          }

          // GPS routing chime during motorcycle ride
          if (next >= 0.35 && next < 0.6 && !soundCuesTriggered.current.has('gps')) {
            soundCuesTriggered.current.add('gps');
            audioEngine.playGpsChime();
          }

          // Doorbell / Arrival
          if (next >= 4.9 && next < 5.2 && !soundCuesTriggered.current.has('doorbell')) {
            soundCuesTriggered.current.add('doorbell');
            audioEngine.playDoorbell();
          }

          if (next >= 7.0 && next < 7.3 && !soundCuesTriggered.current.has('zipper')) {
            soundCuesTriggered.current.add('zipper');
            audioEngine.playZipper();
            audioEngine.playFabricRustle(0.4);
          }

          if (next >= 9.2 && next < 9.5 && !soundCuesTriggered.current.has('steam')) {
            soundCuesTriggered.current.add('steam');
            audioEngine.playWarmGlow();
            audioEngine.playHotFoodSizzleAndSteam();
          }

          // At delivery arrival (20.6s), stop animation clock and display Ticket
          if (next >= deliveryCompleteTime && !isPhotoRevealed) {
            return deliveryCompleteTime;
          }

          return next;
        });
      }

      requestRef.current = requestAnimationFrame(updateLoop);
    };

    requestRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = null;
    };
  }, [isPlaying, deliveryCompleteTime, isPhotoRevealed]);

  /**
   * SURPRISE "ABRIR PEDIDO" FLOW:
   * 1. Clicking "Abrir Pedido" initiates download of the photo in background.
   * 2. THE PHOTO IS STRICTLY HIDDEN UNTIL THE DOWNLOAD COMPLETES.
   * 3. Sizzling steam & anticipation sound plays.
   * 4. ONLY once download resolves (100%): the photo reveals with fanfare and confetti!
   */
  const handleAbrirPedido = async () => {
    if (isDownloading) return;

    audioEngine.init();
    audioEngine.playClick();
    audioEngine.playHotFoodSizzleAndSteam();
    audioEngine.playDownloadSuspense();

    setIsDownloading(true);
    setDownloadProgress(15);

    // Start photo download in background
    const downloadPromise = downloadChinitaPhoto(
      '/assets/chinita.jpg',
      'foto-chinita-pedidosya-cordoba.jpg'
    );

    // Realistic suspense progression over 1.3 seconds
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 220);

    // Wait for actual file fetch & anchor click to complete
    await downloadPromise;
    clearInterval(interval);
    setDownloadProgress(100);

    // Brief beat at 100% before the explosive surprise reveal!
    setTimeout(() => {
      // STRICT REQUIREMENT: THE PHOTO ONLY APPEARS HERE ONCE DOWNLOAD IS DONE!
      setIsDownloading(false);
      setIsPhotoRevealed(true);
      audioEngine.playGrandCelebrationTheme();
      triggerConfetti();
    }, 450);
  };

  // -------------------------------------------------------------
  // ANIMATION MATHEMATICS WITH FULL MOBILE ADAPTATION
  // -------------------------------------------------------------
  // Drive phase: 0.0s to 4.6s (relaxed pacing so the GPS can be appreciated)
  const driveDuration = 4.6;
  const tNorm = Math.min(1.0, animTime / driveDuration);
  const driveProgress = 1 - Math.pow(1 - tNorm, 2.5);

  // Wheel spin and mechanical physics
  const wheelSpinDeg = (1 - driveProgress) * 1600;

  let suspensionDip = 0;
  if (animTime > 4.2 && animTime < 4.8) {
    const bp = (animTime - 4.2) / 0.6;
    suspensionDip = Math.sin(bp * Math.PI) * 5;
  }
  const engineVibration =
    animTime < 4.6 ? Math.sin(animTime * 60) * (animTime < 4.2 ? 1.2 : 0.6) : 0;
  const riderLeanDeg = (1 - driveProgress) * 3.0;

  // Zoom-in phase specifically on the thermal box: 5.8s to 7.4s
  const zoomProgress = Math.min(1.0, Math.max(0, (animTime - 5.8) / 1.6));
  const zoomEase = Math.sin((zoomProgress * Math.PI) / 2);

  // Background subtle zoom
  const bgScale = 1.0 + zoomEase * (isMobile ? 0.35 : 0.4);
  const bgShiftX = isMobile ? zoomEase * -4 : zoomEase * -8;
  const bgShiftY = isMobile ? zoomEase * 2 : zoomEase * 4;

  // Box unzipping & lid opening
  const unzipProgress = Math.min(1.0, Math.max(0, (animTime - 7.0) / 1.2));
  const lidOpenProgress = Math.min(1.0, Math.max(0, (animTime - 8.2) / 1.2));
  const isGlowing = animTime >= 8.8;

  // The hot food package emergence: 9.4s to 10.6s
  const foodEmergence = Math.min(1.0, Math.max(0, (animTime - 9.4) / 1.2));
  const foodEaseOut = 1 - Math.pow(1 - foodEmergence, 3);
  
  const foodY = isMobile
    ? 90 - foodEaseOut * 120  // Rises to -30px (perfect eye level on mobile)
    : 150 - foodEaseOut * 135;

  const foodScale = isMobile
    ? 0.5 + foodEaseOut * 0.44
    : 0.52 + foodEaseOut * 0.46;

  const doorbellActive = animTime >= 4.9 && animTime <= 5.8;

  // Show the hot food package for exactly 10.0 seconds (from ~10.6s to 20.6s)
  const isPackageShowcaseActive = animTime >= 9.6 && animTime < deliveryCompleteTime && !isPhotoRevealed;

  // Automatic transition to Ticket after 10 seconds of showcase
  const isDeliveryArrived = animTime >= deliveryCompleteTime && !isPhotoRevealed;

  // -------------------------------------------------------------
  // MOTORCYCLE & BOX RESPONSIVE GEOMETRY (NO CUTOFF ON ANY PHONE)
  // -------------------------------------------------------------
  // On mobile (< 640px): Base width = 290px
  // In a 290px container:
  // - Motorcycle front wheel edge: 34px
  // - PedidosYa Box right edge: 267px
  // - Total span: 233px!
  // On a 360px Samsung S24: 290px centered leaves 35px left, 35px right.
  // Real motorcycle margins: 69px left clearance, 58px right clearance!
  // On a 390px iPhone 13/14/15/16: 84px left clearance, 73px right clearance!
  const baseBikeWidth = isMobile ? 290 : 470;
  const baseBikeHeight = Math.round(baseBikeWidth * (320 / 480));
  const bikeScale = baseBikeWidth / 480;

  // Exact coordinates of PedidosYa Box mounted on rear luggage rack
  const boxLeft = Math.round(302 * bikeScale);
  const boxTop = Math.round(76 * bikeScale);
  const boxSize = Math.round(140 * bikeScale);
  const boxCenterX = Math.round(372 * bikeScale);
  const boxCenterY = Math.round(142 * bikeScale);

  // Travel physics:
  // Starts at +115vw (fully off-screen to the right)
  // Stops at 0vw (exactly in the centered stopped position)
  const driveOffsetX = (1 - driveProgress) * (isMobile ? 120 : 100);

  // During zoom (5.8s - 7.4s), camera pans to center the box
  // Difference between box center and container center:
  const containerCenterX = baseBikeWidth / 2;
  const boxOffsetFromCenter = boxCenterX - containerCenterX;
  // Shift container left so the box is dead center in the viewport:
  const zoomShiftX = -boxOffsetFromCenter * zoomEase;
  const zoomScale = 1.0 + zoomEase * (isMobile ? 0.65 : 0.6);

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[100dvh] sm:h-auto sm:aspect-[16/9] bg-slate-950 sm:rounded-3xl overflow-hidden border-0 sm:border border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.85)] select-none flex flex-col justify-between">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
        style={{
          backgroundImage: 'url(/assets/building_entrance.jpg)',
          transform: `scale(${bgScale}) translate(${bgShiftX}%, ${bgShiftY}%)`,
          filter: isDeliveryArrived ? 'blur(6px) brightness(0.6)' : isPackageShowcaseActive ? 'brightness(0.75)' : 'brightness(0.95)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/35" />
      </div>

      {/* TOP FLOATING HEADER WITH LOGO & CONTROLS */}
      <div className="absolute top-0 left-0 right-0 p-2.5 sm:p-5 pt-3 sm:pt-5 z-40 flex items-center justify-between pointer-events-none">
        {/* Modern PedidosYa Logo Badge with Entrega Especial a Córdoba */}
        <div className="pointer-events-auto bg-slate-950/80 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-2xl border border-white/10 shadow-lg scale-90 sm:scale-100 origin-left">
          <PedidosYaLogo size="sm" showSubtitle={true} />
        </div>

        {/* Floating Quick Controls */}
        {hasStarted && (
          <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 bg-slate-950/80 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl border border-white/10 shadow-lg scale-90 sm:scale-100 origin-right">
            <button
              onClick={handlePlayToggle}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="Reiniciar escena"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* 
        GPS NAVIGATION ROUTE HUD (ALICANTE -> CÓRDOBA)
        Displayed during motorcycle transit with comfortable, clear pacing
      */}
      {hasStarted && animTime > 0.1 && animTime <= 4.8 && (
        <div className="absolute top-14 sm:top-16 right-2 sm:right-5 left-2 sm:left-auto flex justify-center sm:justify-end z-30 animate-fade-in pointer-events-none">
          <GpsRouteHud progress={driveProgress} />
        </div>
      )}

      {/* Doorbell Sound Wave Pulse */}
      {doorbellActive && (
        <div
          className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: isMobile ? '45%' : '24%',
            top: isMobile ? '38%' : '35%',
          }}
        >
          <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-full border-4 border-amber-400/80 animate-ping" />
          <div className="absolute inset-0 m-auto w-8 sm:w-12 h-8 sm:h-12 rounded-full bg-amber-400/40 blur-md" />
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-xl tracking-wider whitespace-nowrap">
            DING-DONG!
          </span>
        </div>
      )}

      {/* Street & Curb */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-800/90 to-transparent border-t border-slate-700/40 pointer-events-none z-10 ${
          isMobile ? 'h-[30%]' : 'h-[28%]'
        }`}
      >
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-400/75" />
        <div className="absolute bottom-4 left-0 right-0 border-b-2 border-dashed border-white/25" />
      </div>

      {/* 
        ============================================================
        MOTORCYCLE & MOUNTED PEDIDOSYA BOX
        100% VISIBLE ON IPHONE, SAMSUNG S24 AND ALL SCREEN SIZES
        - Centered with generous safety margins
        - Perfectly scaled box mounted securely on the luggage rack
        - Smooth drive-in from the right, stopping precisely in frame
        - Seamless zoom centered directly on the box without cutting
        ============================================================
      */}
      <div
        className="absolute pointer-events-none z-20"
        style={{
          bottom: isMobile ? '16%' : '10%',
          left: isMobile ? '50%' : '44%',
          width: `${baseBikeWidth}px`,
          height: `${baseBikeHeight}px`,
          transform: `translateX(calc(-50% + ${driveOffsetX}vw + ${zoomShiftX}px)) translateY(${engineVibration + suspensionDip}px) rotate(${riderLeanDeg}deg) scale(${zoomScale})`,
          transformOrigin: `${boxCenterX}px ${boxCenterY}px`,
          transition: 'transform 0.08s ease-out',
        }}
      >
        <div className="relative w-full h-full">
          {/* Motorcycle SVG */}
          <MotorcycleSvg wheelRotation={wheelSpinDeg} size={baseBikeWidth} />

          {/* Exhaust smoke ping while driving */}
          {animTime < 4.6 && driveProgress > 0.05 && (
            <div
              className="absolute pointer-events-none"
              style={{
                right: `${Math.round(45 * bikeScale)}px`,
                bottom: `${Math.round(35 * bikeScale)}px`,
              }}
            >
              <span className="inline-block w-3.5 h-3.5 rounded-full bg-slate-400/35 blur-[2px] animate-ping" />
            </div>
          )}

          {/* Clean PedidosYa Box securely mounted on the rear luggage rack */}
          <div
            className="absolute pointer-events-auto"
            style={{
              left: `${boxLeft}px`,
              top: `${boxTop}px`,
              transform: `rotate(-4deg) scale(${zoomProgress > 0.6 ? 1.08 : 1.0})`,
              transition: 'transform 0.4s ease-out',
            }}
          >
            <CleanPedidosYaBox
              lidOpenProgress={lidOpenProgress}
              unzipProgress={unzipProgress}
              isGlowing={isGlowing}
              size={boxSize}
            />
          </div>
        </div>
      </div>

      {/* 
        ============================================================
        FASE: EL PAQUETE SE VE DURANTE 10 SEGUNDOS PRUDENCIALES
        (Se mueve de caliente con humito, sin botones de interrupción)
        ============================================================
      */}
      {isPackageShowcaseActive && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-30 transition-all duration-700 pointer-events-none px-3"
          style={{
            transform: `translateY(${foodY}px) scale(${foodScale})`,
            opacity: Math.min(1, foodEmergence * 1.6),
          }}
        >
          <div className="relative flex flex-col items-center scale-90 sm:scale-100 origin-center max-w-full">
            {/* Caution Hot Food Floating Badge */}
            <div className="absolute -top-7 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white border-2 border-yellow-300 text-[10px] sm:text-xs font-black shadow-[0_8px_25px_rgba(239,68,68,0.7)] flex items-center gap-1 backdrop-blur-md animate-bounce z-40 whitespace-nowrap">
              <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 fill-current animate-pulse" />
              <span>¡CUIDADO: RECIÉN SALIDO DEL HORNO · QUEMA!</span>
              <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 fill-current animate-pulse" />
            </div>

            {/* STEAMING BURNING FOOD PACKAGE SHAKING WITH INTENSE HEAT */}
            <HotFoodPackage size={isMobile ? 220 : 275} className="transition-all" />

            {/* Status caption (no manual buttons as requested) */}
            <div className="mt-2.5 text-center z-40 px-2">
              <p className="text-[11px] sm:text-sm text-amber-200 font-extrabold tracking-wide drop-shadow-md flex items-center justify-center gap-1">
                <span>🔥</span>
                <span>Comida caliente recién horneada · Alicante ➔ Córdoba</span>
                <span>🔥</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 
        ============================================================
        FASE 1: "¡FELICIDADES CHINITA! TU PEDIDO FUE ENTREGADO!"
        CON TICKET DE PEDIDO PAGADO Y ENTREGADO + BOTÓN "ABRIR PEDIDO"
        >>> APARECE AUTOMÁTICAMENTE TRAS LOS 10 SEGUNDOS <<<
        >>> LA FOTO NO SE VE EN ESTE PASO (FACTOR SORPRESA) <<<
        ============================================================
      */}
      {isDeliveryArrived && !isPhotoRevealed && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in pointer-events-auto overflow-y-auto overscroll-contain">
          {/* Main Delivery Congratulatory Header */}
          <div className="text-center mb-2 sm:mb-3 animate-slide-down shrink-0">
            <div className="inline-flex items-center gap-1 bg-emerald-500 text-slate-950 font-black px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[10px] sm:text-xs shadow-lg uppercase tracking-wider mb-1.5">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Estado: Pagado y Entregado</span>
            </div>

            <h2
              className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}
            >
              ¡FELICIDADES CHINITA!
            </h2>
            <p className="text-sm sm:text-xl font-extrabold text-amber-300 tracking-wide drop-shadow-sm">
              TU PEDIDO FUE ENTREGADO!
            </p>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-300 tracking-wider">
              Entrega especial a Córdoba
            </p>
          </div>

          {/* OFFICIAL TICKET DE PEDIDO PAGADO Y ENTREGADO */}
          <div className="w-full max-w-[320px] sm:max-w-md shrink-0">
            <DeliveryTicket
              onOpenOrder={handleAbrirPedido}
              isOpening={isDownloading}
            />
          </div>

          {/* Download progress bar indicator */}
          {isDownloading && (
            <div className="mt-2.5 flex flex-col items-center gap-1 shrink-0">
              <div className="w-56 sm:w-64 bg-slate-900 border border-slate-700 rounded-full h-2 sm:h-2.5 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-full transition-all duration-200"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <span className="text-[10px] sm:text-[11px] text-amber-300 font-extrabold tracking-wide animate-pulse">
                Abriendo y descargando pedido... {downloadProgress}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* 
        ============================================================
        FASE 2: LA FOTO SOLO SE VE UNA VEZ HECHA LA DESCARGA
        (Al tocar "Abrir Pedido" y finalizar la descarga)
        ============================================================
      */}
      {isPhotoRevealed && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-950/92 backdrop-blur-md animate-fade-in pointer-events-auto overflow-y-auto overscroll-contain">
          {/* Top Status */}
          <div className="mb-2 text-center shrink-0">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500 text-slate-950 font-black px-3.5 py-1 rounded-full text-[10px] sm:text-xs shadow-xl uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>¡Pedido Abierto y Foto Descargada!</span>
            </div>
          </div>

          {/* Deluxe Polaroid Print */}
          <div className="relative bg-white p-2.5 sm:p-4 pb-7 sm:pb-9 rounded-2xl sm:rounded-3xl shadow-[0_25px_75px_rgba(0,0,0,0.95)] border-3 sm:border-4 border-amber-300 w-full max-w-[250px] sm:max-w-[340px] animate-scale-up shrink-0">
            {/* Top Official Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#EA1D2C] to-[#B30B1C] text-white text-[9px] sm:text-[11px] font-extrabold px-3 py-0.5 sm:px-4 sm:py-1 rounded-full shadow-lg flex items-center gap-1 border border-amber-300/50 whitespace-nowrap">
              <Flame className="w-3 h-3 text-amber-300 fill-current" />
              <span>PEDIDOSYA · ENTREGA A CÓRDOBA</span>
            </div>

            {/* Photographic Print of Chinita in full resolution */}
            <div className="relative aspect-[3/4] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
              <img
                src="/assets/chinita.jpg"
                alt="Chinita"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
            </div>

            {/* Official Stamp & Caption */}
            <div className="mt-2 sm:mt-3 flex items-center justify-between text-[10px] sm:text-xs font-bold px-1">
              <div className="flex items-center gap-1 text-[#EA1D2C]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EA1D2C] animate-ping" />
                <span>PedidosYa Oficial</span>
              </div>
              <span className="text-slate-600 font-semibold">Entrega a Córdoba</span>
            </div>
          </div>

          {/* Bottom Action Controls (Re-download only) */}
          <div className="mt-3 flex items-center gap-3 shrink-0">
            <button
              onClick={handleAbrirPedido}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EA1D2C] to-[#B30B1C] hover:from-[#FF1E46] text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Volver a Descargar</span>
            </button>
          </div>
        </div>
      )}

      {/* START SCREEN OVERLAY */}
      {!hasStarted && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4 text-center">
          <div className="mb-4 scale-90 sm:scale-100">
            <PedidosYaLogo size="lg" showSubtitle={false} />
          </div>

          <button
            onClick={handlePlayToggle}
            className="w-18 sm:w-20 h-18 sm:h-20 rounded-3xl bg-gradient-to-br from-[#FF1E46] via-[#EA1D2C] to-[#B30B1C] text-white flex items-center justify-center shadow-[0_12px_35px_rgba(234,29,44,0.65)] border border-white/30 transition-all transform hover:scale-110 active:scale-95 mb-4 group cursor-pointer"
          >
            <Play className="w-8 sm:w-9 h-8 sm:h-9 fill-current translate-x-1 group-hover:scale-110 transition-transform" />
          </button>

          <h3 className="text-lg sm:text-2xl font-black text-white mb-1 tracking-tight">
            Entrega Especial a Córdoba
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xs sm:max-w-sm">
            Toca el botón para iniciar la animación y recibir tu comprobante de entrega
          </p>
        </div>
      )}
    </div>
  );
};
