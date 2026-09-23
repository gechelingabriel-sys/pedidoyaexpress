import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, Video } from 'lucide-react';
import { CinematicRenderer } from '../utils/canvasRenderer';
import { audioEngine } from '../utils/audioEngine';
import { VideoConfig, SceneDefinition } from '../types';
import { SCENES } from '../constants';

interface CinematicPlayerProps {
  currentTime: number;
  isPlaying: boolean;
  onTimeUpdate: (t: number) => void;
  onTogglePlay: () => void;
  onReset: () => void;
  config: VideoConfig;
  onUpdateConfig: (partial: Partial<VideoConfig>) => void;
  rendererRef: React.MutableRefObject<CinematicRenderer | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isRecording: boolean;
}

export const CinematicPlayer: React.FC<CinematicPlayerProps> = ({
  currentTime,
  isPlaying,
  onTimeUpdate,
  onTogglePlay,
  onReset,
  config,
  onUpdateConfig,
  rendererRef,
  canvasRef,
  isRecording,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);

  // Initialize renderer and preload assets
  useEffect(() => {
    if (!rendererRef.current) {
      rendererRef.current = new CinematicRenderer();
    }
    rendererRef.current.preloadAssets(config.photoUrl).then(() => {
      setAssetsReady(true);
    });
  }, [config.photoUrl, rendererRef]);

  // Render current frame whenever time changes or renderer updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !rendererRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    rendererRef.current.renderFrame(ctx, currentTime, config);
  }, [currentTime, config, canvasRef, rendererRef, assetsReady]);

  // Current scene detection
  const currentScene: SceneDefinition =
    SCENES.find((s) => currentTime >= s.startSec && currentTime < s.endSec) ||
    SCENES[SCENES.length - 1];

  const toggleMute = useCallback(() => {
    const newMuted = !config.isMuted;
    onUpdateConfig({ isMuted: newMuted });
    audioEngine.setMuted(newMuted);
  }, [config.isMuted, onUpdateConfig]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center bg-slate-950 p-2 sm:p-4 rounded-2xl shadow-2xl overflow-hidden border border-slate-800/80 group"
      style={{
        maxHeight: isFullscreen ? '100vh' : '78vh',
      }}
    >
      {/* 9:16 Aspect Ratio Frame */}
      <div className="relative aspect-[9/16] h-full max-h-[74vh] flex items-center justify-center rounded-xl overflow-hidden bg-black shadow-inner border border-slate-700/50">
        <canvas
          ref={canvasRef}
          width={720}
          height={1280}
          className="w-full h-full object-contain cursor-pointer select-none"
          onClick={onTogglePlay}
        />

        {/* Recording Active Indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/95 text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wider animate-pulse shadow-lg z-30">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            RECORDING 9:16 VIDEO...
          </div>
        )}

        {/* Top Header HUD overlay */}
        <div
          className={`absolute top-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none z-20 ${
            isHovered || !isPlaying ? 'opacity-100' : 'opacity-0 sm:opacity-75'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
                PedidosYa
              </span>
              <span className="font-semibold text-slate-200 truncate max-w-[170px] sm:max-w-none">
                {currentScene.name}: {currentScene.subtitle}
              </span>
            </div>
            <div className="font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded border border-white/10">
              {currentTime.toFixed(2)}s / 10.00s
            </div>
          </div>
        </div>

        {/* Big Center Play Button when paused */}
        {!isPlaying && (
          <button
            onClick={onTogglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-20 border border-white/20 hover:bg-red-600"
            aria-label="Play video"
          >
            <Play className="w-8 h-8 fill-current translate-x-0.5" />
          </button>
        )}

        {/* Bottom Floating Quick Controls */}
        <div
          className={`absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 transition-opacity duration-300 z-20 ${
            isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onTogglePlay}
              className="p-1.5 sm:p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={onReset}
              className="p-1.5 sm:p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMute}
              className="p-1.5 sm:p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              title={config.isMuted ? 'Unmute' : 'Mute'}
            >
              {config.isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[11px] font-mono text-slate-400">9:16 HD</span>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 sm:p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
