import React from 'react';
import { SCENES } from '../constants';
import { Play, Volume2, Camera } from 'lucide-react';

interface StoryboardViewProps {
  onSelectScene: (time: number) => void;
  currentTime: number;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({ onSelectScene, currentTime }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-red-500" />
            <span>Cinematic Storyboard &amp; Scene Breakdown</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            5 photorealistic scenes composing the 10-second delivery sequence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {SCENES.map((scene) => {
          const isCurrent = currentTime >= scene.startSec && currentTime < scene.endSec;
          return (
            <div
              key={scene.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-slate-800/90 border-red-500 ring-1 ring-red-500/50 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                    {scene.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {scene.startSec.toFixed(1)}s - {scene.endSec.toFixed(1)}s
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-100 mb-1.5 leading-tight">
                  {scene.subtitle}
                </h4>

                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {scene.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <div className="flex items-start gap-1.5 text-[10px] text-amber-300/90">
                  <Volume2 className="w-3 h-3 shrink-0 mt-0.5" />
                  <span className="truncate">{scene.audioCue}</span>
                </div>

                <button
                  onClick={() => onSelectScene(scene.startSec)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-medium transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Jump to Scene</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
