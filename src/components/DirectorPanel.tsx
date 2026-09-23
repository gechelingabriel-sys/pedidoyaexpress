import React, { useState } from 'react';
import {
  Download,
  Sliders,
  CheckCircle2,
  Volume2,
  Film,
  Camera,
  Layers,
  Wand2,
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { VideoConfig } from '../types';

interface DirectorPanelProps {
  config: VideoConfig;
  onUpdateConfig: (partial: Partial<VideoConfig>) => void;
  onStartExport: () => void;
  isExporting: boolean;
  exportProgress: number;
}

export const DirectorPanel: React.FC<DirectorPanelProps> = ({
  config,
  onUpdateConfig,
  onStartExport,
  isExporting,
  exportProgress,
}) => {
  const [activeTab, setActiveTab] = useState<'director' | 'customize' | 'audio'>('director');
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  const defaultPhotoUrl = '/assets/chinita.jpg';

  const handleApplyPhoto = () => {
    if (customPhotoInput.trim()) {
      onUpdateConfig({ photoUrl: customPhotoInput.trim() });
    }
  };

  const handleResetPhoto = () => {
    onUpdateConfig({ photoUrl: defaultPhotoUrl });
    setCustomPhotoInput('');
  };

  const testAudio = (type: 'motorcycle' | 'doorbell' | 'zipper' | 'glow' | 'celebration') => {
    audioEngine.init();
    if (type === 'motorcycle') audioEngine.playMotorcycle();
    if (type === 'doorbell') audioEngine.playDoorbell();
    if (type === 'zipper') {
      audioEngine.playZipper();
      audioEngine.playFabricRustle(0.5);
    }
    if (type === 'glow') audioEngine.playWarmGlow();
    if (type === 'celebration') audioEngine.playCelebrationNotification();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1">
        <button
          onClick={() => setActiveTab('director')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'director'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="w-3.5 h-3.5 text-red-400" />
          <span>Cinematic Script & Export</span>
        </button>

        <button
          onClick={() => setActiveTab('customize')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'customize'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>Story Customizer</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'audio'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Foley Soundboard</span>
        </button>
      </div>

      <div className="p-4 sm:p-5">
        {/* TAB 1: DIRECTOR & EXPORT */}
        {activeTab === 'director' && (
          <div className="space-y-5">
            {/* Export Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/50 via-slate-900 to-slate-900 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">Download 9:16 Video</span>
                  <span className="text-[10px] bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded">
                    MP4 / WebM
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Renders the complete 10-second photorealistic sequence with synchronized WebAudio sound effects into a shareable vertical video.
                </p>
              </div>

              <button
                onClick={onStartExport}
                disabled={isExporting}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-lg active:scale-95 ${
                  isExporting
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                }`}
              >
                {isExporting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Rendering ({Math.round(exportProgress * 100)}%)...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export 9:16 Video</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt Compliance Checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Prompt Specifications Status
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">0:00-0:02 · Building & Arrival</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Residential exterior entrance, motorcycle decelerating, stopping at curb, engine off at 1.8s, handheld camera drift.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">0:02-0:03.5 · PedidosYa Box & Doorbell</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Close-up of red/grey box from image_0.png on motorcycle, prominent &apos;P&apos; logo, camera moves towards box, &apos;DING-DONG&apos; chime &amp; pause.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">0:03.5-0:06 · Unzipping &amp; Thermal Glow</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Extreme macro close-up, zipper unzips along seams, red fabric, silver thermal foil lining, warm golden light radiates out.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    4
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">0:06-0:08 · Photo of Chinita Emerges</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      High-quality archival photo print of Chinita emerges upright from the warm box, shallow depth of field bokeh background.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 md:col-span-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    5
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">0:08-0:10 · Impact Celebration &amp; Text</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Photo centered. Large bold white text &quot;¡FELICIDADES CHINITA! TU PEDIDO FUE ENTREGADO!&quot; drops in suddenly. Floating confetti &amp; soft notification chime.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMIZE */}
        {activeTab === 'customize' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Celebration Title (Line 1)
                </label>
                <input
                  type="text"
                  value={config.messageLine1}
                  onChange={(e) => onUpdateConfig({ messageLine1: e.target.value })}
                  placeholder="¡FELICIDADES CHINITA!"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subtitle (Line 2)
                </label>
                <input
                  type="text"
                  value={config.messageLine2}
                  onChange={(e) => onUpdateConfig({ messageLine2: e.target.value })}
                  placeholder="TU PEDIDO FUE ENTREGADO!"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Recipient Photo URL or Reset */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Recipient Photograph</span>
                <button
                  onClick={handleResetPhoto}
                  className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Chinita&apos;s Photo</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPhotoInput}
                  onChange={(e) => setCustomPhotoInput(e.target.value)}
                  placeholder="Paste custom image URL (or keep Chinita's Cloudinary image)"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={handleApplyPhoto}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Visual Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 cursor-pointer">
                <span className="text-xs text-slate-300">Celebratory Confetti</span>
                <input
                  type="checkbox"
                  checked={config.enableConfetti}
                  onChange={(e) => onUpdateConfig({ enableConfetti: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 cursor-pointer">
                <span className="text-xs text-slate-300">Handheld Cam Drift</span>
                <input
                  type="checkbox"
                  checked={config.enableHandheldShake}
                  onChange={(e) => onUpdateConfig({ enableHandheldShake: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 cursor-pointer">
                <span className="text-xs text-slate-300">Cinematic Film Grain</span>
                <input
                  type="checkbox"
                  checked={config.enableGrain}
                  onChange={(e) => onUpdateConfig({ enableGrain: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: FOLEY SOUNDBOARD */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Test the real-time synthesized procedural Foley sound effects created specifically for this video story.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => testAudio('motorcycle')}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-amber-400">Motorcycle Engine</span>
                  <Volume2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                </div>
                <div className="text-[11px] text-slate-400">
                  4-stroke cylinder revs, deceleration, curb stop, key click &amp; exhaust cut.
                </div>
              </button>

              <button
                onClick={() => testAudio('doorbell')}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-emerald-400">Doorbell Ding-Dong</span>
                  <Volume2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                </div>
                <div className="text-[11px] text-slate-400">
                  Tubular two-tone residential chime (F#5 &rarr; D5) with acoustic reverberation.
                </div>
              </button>

              <button
                onClick={() => testAudio('zipper')}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-cyan-400">Zipper &amp; Flap</span>
                  <Volume2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <div className="text-[11px] text-slate-400">
                  Tactile zipper tooth friction (zzzzrrrip) and nylon thermal flap rustle.
                </div>
              </button>

              <button
                onClick={() => testAudio('glow')}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-purple-400">Thermal Glow Hum</span>
                  <Volume2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
                </div>
                <div className="text-[11px] text-slate-400">
                  Warm resonant harmonic chord as light radiates from within the open box.
                </div>
              </button>

              <button
                onClick={() => testAudio('celebration')}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-red-400">Notification Chime</span>
                  <Volume2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400" />
                </div>
                <div className="text-[11px] text-slate-400">
                  Celebratory crystal delivery chime and triumphant sub-bass impact.
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
