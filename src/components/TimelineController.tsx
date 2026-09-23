import React, { useRef } from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Repeat, Bell, Bike, Sparkles, FolderArchive, Flame } from 'lucide-react';
import { SCENES } from '../constants';

interface TimelineControllerProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  onTogglePlay: () => void;
  onReset: () => void;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
  loop: boolean;
  onToggleLoop: () => void;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  currentTime,
  duration,
  isPlaying,
  onSeek,
  onTogglePlay,
  onReset,
  playbackRate,
  onChangePlaybackRate,
  loop,
  onToggleLoop,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const handleStep = (delta: number) => {
    onSeek(Math.max(0, Math.min(duration, currentTime + delta)));
  };

  const progressPercent = (currentTime / duration) * 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Scene Quick Jump Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {SCENES.map((scene) => {
          const isActive = currentTime >= scene.startSec && currentTime < scene.endSec;
          return (
            <button
              key={scene.id}
              onClick={() => onSeek(scene.startSec)}
              className={`text-left p-2.5 rounded-xl border transition-all ${
                isActive
                  ? 'bg-red-950/60 border-red-500 text-white shadow-md shadow-red-950/50'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className={isActive ? 'text-red-400 font-bold' : 'text-slate-400'}>
                  {scene.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {scene.startSec.toFixed(1)}s - {scene.endSec.toFixed(1)}s
                </span>
              </div>
              <div className="text-xs font-semibold truncate text-slate-200">
                {scene.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Scrubber Bar */}
      <div className="space-y-1.5 pt-1">
        <div
          ref={progressBarRef}
          onClick={handleSeekClick}
          className="relative h-9 bg-slate-950 rounded-xl overflow-hidden cursor-pointer border border-slate-800 select-none group"
        >
          {/* Scene background sections */}
          <div className="absolute inset-0 flex">
            {SCENES.map((scene, idx) => {
              const widthPct = ((scene.endSec - scene.startSec) / duration) * 100;
              return (
                <div
                  key={scene.id}
                  style={{ width: `${widthPct}%` }}
                  className={`h-full border-r border-slate-800/80 transition-colors ${
                    idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/70'
                  }`}
                />
              );
            })}
          </div>

          {/* Sound cue indicators along timeline */}
          <div
            className="absolute top-1 text-[10px] flex items-center gap-1 text-amber-400/90 pointer-events-none"
            style={{ left: '8%' }}
            title="Motorcycle Engine"
          >
            <Bike className="w-3 h-3" />
            <span className="hidden sm:inline">Engine</span>
          </div>

          <div
            className="absolute top-1 text-[10px] flex items-center gap-1 text-emerald-400/90 pointer-events-none"
            style={{ left: '23%' }}
            title="Doorbell Ding-Dong"
          >
            <Bell className="w-3 h-3" />
            <span className="hidden sm:inline">Ding-Dong</span>
          </div>

          <div
            className="absolute top-1 text-[10px] flex items-center gap-1 text-cyan-400/90 pointer-events-none"
            style={{ left: '38%' }}
            title="Zipper Unzips"
          >
            <Flame className="w-3 h-3" />
            <span className="hidden sm:inline">Zipper</span>
          </div>

          <div
            className="absolute top-1 text-[10px] flex items-center gap-1 text-purple-400/90 pointer-events-none"
            style={{ left: '62%' }}
            title="Photo Emerges"
          >
            <FolderArchive className="w-3 h-3" />
            <span className="hidden sm:inline">Photo</span>
          </div>

          <div
            className="absolute top-1 text-[10px] flex items-center gap-1 text-red-400 font-bold pointer-events-none"
            style={{ left: '81%' }}
            title="Celebration"
          >
            <Sparkles className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden sm:inline">Celebration!</span>
          </div>

          {/* Progress fill */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Playhead line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none z-10 transition-transform duration-75"
            style={{ left: `calc(${progressPercent}% - 2px)` }}
          >
            <div className="w-3.5 h-3.5 bg-white rounded-full -ml-[5px] -mt-1 shadow-md border border-red-500" />
          </div>
        </div>

        {/* Time labels below scrubber */}
        <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
          <span>00:00.00</span>
          <span>00:02.00</span>
          <span>00:03.50</span>
          <span>00:06.00</span>
          <span>00:08.00</span>
          <span>00:10.00</span>
        </div>
      </div>

      {/* Playback Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Restart to 0:00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleStep(-0.2)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Step back 0.2s"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all shadow-lg shadow-red-600/30 active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
                <span>Play Video</span>
              </>
            )}
          </button>
          <button
            onClick={() => handleStep(0.2)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Step forward 0.2s"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleLoop}
            className={`p-2.5 rounded-xl transition-colors ${
              loop
                ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
            }`}
            title={loop ? 'Loop Enabled' : 'Loop Disabled'}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Speed & Current Time display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
            {[0.5, 1, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => onChangePlaybackRate(rate)}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-colors ${
                  playbackRate === rate
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          <div className="font-mono text-sm font-semibold bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-200">
            <span className="text-red-400">{currentTime.toFixed(2)}s</span>
            <span className="text-slate-500"> / 10.00s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
