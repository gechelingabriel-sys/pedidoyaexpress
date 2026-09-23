/**
 * Procedural Web Audio Engine for PedidosYa Delivery Story
 * 
 * Includes:
 * 1. Ultra-realistic 4-stroke 150cc delivery motorcycle engine:
 *    Combustion pressure pulses, throttle revving, exhaust burble / compression brake,
 *    curb idle, and ignition key-off.
 * 2. Realistic "DING-DONG" doorbell chime.
 * 3. Tactile zipper & thermal lid fabric rustle.
 * 4. Ambient Cinematic Background Music (BGM) with chords, bass, and sparkling arpeggios.
 * 5. Download Suspense sequence (heartbeat kick, rising tension filter sweep).
 * 6. Grand Celebratory Fanfare & Joyful Anthem (triggered ONLY once download completes).
 */

export class CinematicAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.95;

  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private bgmStep: number = 0;

  constructor() {
    // Lazy initialize on user gesture
  }

  public init() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public duckBgm(level: number, rampTime: number = 0.3) {
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.linearRampToValueAtTime(level, this.ctx.currentTime + rampTime);
    }
  }

  /**
   * Starts warm, cinematic, uplifting background soundtrack
   */
  public startBackgroundMusic() {
    this.init();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.bgmStep = 0;

    // Progression in C Major / A Minor: C -> G -> Am -> F
    const chordProgressions = [
      { bass: 130.81, notes: [261.63, 329.63, 392.00] }, // C (C3, C4, E4, G4)
      { bass: 98.00,  notes: [246.94, 293.66, 392.00] }, // G (G2, B3, D4, G4)
      { bass: 110.00, notes: [220.00, 261.63, 329.63] }, // Am (A2, A3, C4, E4)
      { bass: 87.31,  notes: [220.00, 261.63, 349.23] }, // F (F2, A3, C4, F4)
    ];

    const playStep = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const now = this.ctx.currentTime;
      const chordIdx = Math.floor(this.bgmStep / 4) % chordProgressions.length;
      const chord = chordProgressions[chordIdx];
      const beatInBar = this.bgmStep % 4;

      // Bass note on beat 0 and 2
      if (beatInBar === 0 || beatInBar === 2) {
        this.playMellowBass(chord.bass, now, 0.65);
      }

      // Warm Electric Piano / Marimba note
      const noteToPlay = chord.notes[beatInBar % chord.notes.length];
      this.playRhodesNote(noteToPlay, now, 0.55);

      // Shimmering music box arpeggio on beats 1 and 3
      if (beatInBar === 1 || beatInBar === 3) {
        this.playMusicBoxArp(noteToPlay * 2, now);
      }

      this.bgmStep++;
      this.bgmTimer = window.setTimeout(playStep, 450); // ~133 BPM upbeat tempo
    };

    playStep();
  }

  public stopBackgroundMusic() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private playMellowBass(freq: number, start: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.35, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }

  private playRhodesNote(freq: number, start: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, start);
    filter.frequency.exponentialRampToValueAtTime(600, start + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.22, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }

  private playMusicBoxArp(freq: number, start: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.09, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(start);
    osc.stop(start + 0.4);
  }

  /**
   * Ultra-realistic 4-stroke delivery motorcycle acoustic model.
   */
  public playMotorcycle() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    this.duckBgm(0.08, 0.2); // Duck music while engine roars

    const now = this.ctx.currentTime;
    const sampleRate = this.ctx.sampleRate;
    const duration = 2.75;
    const totalSamples = Math.floor(sampleRate * duration);

    const audioBuffer = this.ctx.createBuffer(2, totalSamples, sampleRate);
    const leftData = audioBuffer.getChannelData(0);
    const rightData = audioBuffer.getChannelData(1);

    let phase = 0;
    let lastStrokeTime = -1;
    let t = 0;

    let randSeed = 12345;
    const pseudoRand = () => {
      randSeed = (randSeed * 16807) % 2147483647;
      return (randSeed - 1073741823) / 1073741824;
    };

    for (let i = 0; i < totalSamples; i++) {
      t = i / sampleRate;

      let strokeRate = 0;
      let throttleLoad = 0;
      let exhaustBackfire = 0;

      if (t < 1.1) {
        const p = t / 1.1;
        strokeRate = 34 - p * 6;
        throttleLoad = 0.85;
      } else if (t < 2.0) {
        const p = (t - 1.1) / 0.9;
        strokeRate = 28 - p * 13;
        throttleLoad = 0.35 + (1 - p) * 0.2;
        if (p > 0.2 && p < 0.85 && pseudoRand() > 0.96) {
          exhaustBackfire = 0.45;
        }
      } else if (t < 2.4) {
        strokeRate = 14.5;
        throttleLoad = 0.28;
      } else if (t < 2.55) {
        const p = (t - 2.4) / 0.15;
        strokeRate = 14.5 * (1 - p);
        throttleLoad = 0.28 * (1 - p);
      } else {
        strokeRate = 0;
        throttleLoad = 0;
      }

      if (strokeRate > 0) {
        phase += strokeRate / sampleRate;
        if (phase >= 1.0) {
          phase -= 1.0;
          lastStrokeTime = t;
        }
      }

      let sampleVal = 0;
      const dt = t - lastStrokeTime;

      if (lastStrokeTime >= 0 && dt < 0.09 && throttleLoad > 0) {
        const headerPulse = Math.sin(2 * Math.PI * 170 * dt) * Math.exp(-dt * 95);
        const mufflerThump = Math.sin(2 * Math.PI * 82 * dt) * Math.exp(-dt * 45);
        const detonationCrack = pseudoRand() * Math.exp(-dt * 380) * 0.45;
        const valveTick = Math.sin(2 * Math.PI * 1850 * dt) * Math.exp(-dt * 320) * 0.12;

        sampleVal =
          (headerPulse * 0.6 + mufflerThump * 0.75 + detonationCrack + valveTick) *
          throttleLoad;

        if (exhaustBackfire > 0) {
          sampleVal += (pseudoRand() * 0.8 + Math.sin(2 * Math.PI * 120 * dt)) * exhaustBackfire;
        }
      }

      const airRumble = pseudoRand() * 0.06 * Math.max(0.1, throttleLoad);
      sampleVal += airRumble;

      let envelope = 1.0;
      if (t < 0.7) {
        envelope = 0.25 + (t / 0.7) * 0.75;
      } else if (t > 2.35) {
        envelope = Math.max(0, 1 - (t - 2.35) / 0.2);
      }

      const pan = Math.min(0.1, -0.55 + (t / 1.8) * 0.65);
      const leftGain = Math.cos(((pan + 1) * Math.PI) / 4);
      const rightGain = Math.sin(((pan + 1) * Math.PI) / 4);

      const finalVal = Math.max(-1, Math.min(1, sampleVal * envelope * 1.35));
      leftData[i] = finalVal * leftGain;
      rightData[i] = finalVal * rightGain;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = audioBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.linearRampToValueAtTime(2400, now + 1.2);
    filter.frequency.linearRampToValueAtTime(1100, now + 2.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.9, now + 0.4);
    gain.gain.setValueAtTime(0.9, now + 2.3);
    gain.gain.linearRampToValueAtTime(0.001, now + 2.6);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start(now);
    source.stop(now + duration);

    // Ignition kill click
    const clickOsc = this.ctx.createOscillator();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(450, now + 2.42);
    clickOsc.frequency.exponentialRampToValueAtTime(90, now + 2.47);

    const clickGain = this.ctx.createGain();
    clickGain.gain.setValueAtTime(0, now);
    clickGain.gain.setValueAtTime(0.28, now + 2.42);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 2.49);

    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);
    clickOsc.start(now + 2.41);
    clickOsc.stop(now + 2.5);

    this.playExhaustHiss(now + 2.46);

    // Restore BGM after motor turns off
    setTimeout(() => {
      this.duckBgm(0.35, 0.8);
    }, 2500);
  }

  private playExhaustHiss(startTime: number) {
    if (!this.ctx || !this.masterGain) return;
    const duration = 0.35;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const bpf = this.ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(1600, startTime);
    bpf.frequency.exponentialRampToValueAtTime(400, startTime + duration);
    bpf.Q.setValueAtTime(1.8, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.14, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    source.connect(bpf);
    bpf.connect(gain);
    gain.connect(this.masterGain);

    source.start(startTime);
    source.stop(startTime + duration + 0.05);
  }

  /**
   * Realistic two-tone "DING-DONG" doorbell chime
   */
  public playDoorbell() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    this.createChimeTone(739.99, now, 1.3, 0.45);
    this.createChimeTone(739.99 * 2.76, now, 0.8, 0.15);

    this.createChimeTone(587.33, now + 0.38, 1.7, 0.5);
    this.createChimeTone(587.33 * 2.76, now + 0.38, 1.0, 0.18);
  }

  private createChimeTone(freq: number, start: number, duration: number, peakVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peakVol, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(start);
    osc.stop(start + duration + 0.1);
  }

  /**
   * Tactile zipper teeth unzipping friction sound
   */
  public playZipper() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const duration = 1.1;

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    const teethFrequency = 68;
    for (let i = 0; i < bufferSize; i++) {
      const t = i / this.ctx.sampleRate;
      const toothPulse = Math.sin(t * Math.PI * 2 * teethFrequency);
      const friction = Math.random() * 2 - 1;
      data[i] = friction * (0.4 + 0.6 * Math.max(0, toothPulse));
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const bpf = this.ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(2800, now);
    bpf.frequency.linearRampToValueAtTime(3600, now + duration);
    bpf.Q.setValueAtTime(3.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gain.gain.setValueAtTime(0.26, now + duration - 0.15);
    gain.gain.linearRampToValueAtTime(0.001, now + duration);

    source.connect(bpf);
    bpf.connect(gain);
    gain.connect(this.masterGain);

    source.start(now);
    source.stop(now + duration + 0.05);
  }

  public playFabricRustle(delaySec: number = 0) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime + delaySec;
    const duration = 0.8;

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;

    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(1200, now);
    lpf.frequency.linearRampToValueAtTime(600, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    src.connect(lpf);
    lpf.connect(gain);
    gain.connect(this.masterGain);

    src.start(now);
    src.stop(now + duration + 0.05);
  }

  public playWarmGlow() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const chords = [220, 277.18, 329.63, 440, 554.37];
    chords.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.05 / (idx + 1), now + 0.8);
      gain.gain.linearRampToValueAtTime(0.0001, now + 2.4);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 2.5);
    });

    this.playSparkleChimes(now + 0.3);
    this.playHotFoodSizzleAndSteam(now + 0.1);
  }

  /**
   * Sizzling hot food vapor and steam hiss effect
   * Realistic crackle of freshly cooked, burning hot food
   */
  public playHotFoodSizzleAndSteam(startTime?: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = startTime ?? this.ctx.currentTime;
    const duration = 2.2;

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / this.ctx.sampleRate;
      // White noise with random crackle pops (sizzling heat)
      const whiteNoise = Math.random() * 2 - 1;
      const isCrackle = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 2.5 : 0;
      data[i] = whiteNoise * 0.28 + isCrackle;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    // Steam bandpass filter
    const bpf = this.ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(3400, now);
    bpf.frequency.linearRampToValueAtTime(4800, now + 0.8);
    bpf.frequency.linearRampToValueAtTime(2200, now + duration);
    bpf.Q.setValueAtTime(2.2, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
    gain.gain.setValueAtTime(0.28, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(bpf);
    bpf.connect(gain);
    gain.connect(this.masterGain);

    source.start(now);
    source.stop(now + duration + 0.05);
  }

  private playSparkleChimes(startTime: number) {
    if (!this.ctx || !this.masterGain) return;
    const notes = [1318.51, 1567.98, 1975.53, 2637.02];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.08);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, startTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, startTime + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + i * 0.08 + 0.7);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime + i * 0.08);
      osc.stop(startTime + i * 0.08 + 0.8);
    });
  }

  /**
   * SUSPENSE RISER: Plays while download is taking place
   * Heartbeat thumps & rising futuristic whoosh building anticipation!
   */
  public playDownloadSuspense() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Heartbeats: Thump-thump
    [0.0, 0.15, 0.6, 0.75].forEach((t) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now + t);
      osc.frequency.exponentialRampToValueAtTime(45, now + t + 0.09);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + t);
      osc.stop(now + t + 0.12);
    });

    // Rising suspense sweep
    const sweepOsc = this.ctx.createOscillator();
    sweepOsc.type = 'sawtooth';
    sweepOsc.frequency.setValueAtTime(180, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(1200, now + 1.2);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 1.2);

    const sweepGain = this.ctx.createGain();
    sweepGain.gain.setValueAtTime(0.01, now);
    sweepGain.gain.linearRampToValueAtTime(0.2, now + 0.9);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

    sweepOsc.connect(filter);
    filter.connect(sweepGain);
    sweepGain.connect(this.masterGain);

    sweepOsc.start(now);
    sweepOsc.stop(now + 1.3);
  }

  /**
   * GRAND CELEBRATION THEME:
   * Triggered ONLY when download is 100% complete!
   * Explosive unwrapping, celebratory brass fanfare, sparkling confetti bells & driving anthem.
   */
  public playGrandCelebrationTheme() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    this.duckBgm(0.1, 0.1);
    const now = this.ctx.currentTime;

    // 1. Box lid "POP" release sound
    const popOsc = this.ctx.createOscillator();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(340, now);
    popOsc.frequency.exponentialRampToValueAtTime(80, now + 0.16);

    const popGain = this.ctx.createGain();
    popGain.gain.setValueAtTime(0.45, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    popOsc.connect(popGain);
    popGain.connect(this.masterGain);
    popOsc.start(now);
    popOsc.stop(now + 0.22);

    // 2. Confetti cannon burst (white noise blast with low rumble)
    const burstDuration = 0.5;
    const bufSize = Math.floor(this.ctx.sampleRate * burstDuration);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.4;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = 'bandpass';
    nFilter.frequency.setValueAtTime(2200, now);
    nFilter.frequency.exponentialRampToValueAtTime(500, now + burstDuration);
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.35, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + burstDuration);
    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + burstDuration + 0.05);

    // 3. Magical Crystal Cascade (arpeggios ascending)
    const crystalNotes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0]; // C Major
    crystalNotes.forEach((f, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + 0.08 + i * 0.055);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now + 0.08 + i * 0.055);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.08 + i * 0.055 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08 + i * 0.055 + 0.85);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + 0.08 + i * 0.055);
      osc.stop(now + 0.08 + i * 0.055 + 0.9);
    });

    // 4. Grand Brass Celebration Anthem Chord Progression
    // Joyous fanfare: F -> G -> C (with triumphant sustained final chord!)
    const brassChords = [
      { t: 0.35, dur: 0.35, notes: [349.23, 440.0, 523.25] },     // F Major
      { t: 0.72, dur: 0.40, notes: [392.00, 493.88, 587.33] },     // G Major
      { t: 1.15, dur: 2.20, notes: [523.25, 659.25, 783.99, 1046.5] }, // C Major Grand Finale!
    ];

    brassChords.forEach((chord) => {
      chord.notes.forEach((freq) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + chord.t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2600, now + chord.t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now + chord.t);
        gain.gain.linearRampToValueAtTime(0.22, now + chord.t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + chord.t + chord.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + chord.t);
        osc.stop(now + chord.t + chord.dur + 0.05);
      });
    });

    // Sub bass warmth for the grand arrival
    const bassOsc = this.ctx.createOscillator();
    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(130.81, now + 1.15);
    bassOsc.frequency.exponentialRampToValueAtTime(65.4, now + 2.8);

    const bassGain = this.ctx.createGain();
    bassGain.gain.setValueAtTime(0.001, now + 1.15);
    bassGain.gain.linearRampToValueAtTime(0.38, now + 1.2);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.9);

    bassOsc.connect(bassGain);
    bassGain.connect(this.masterGain);
    bassOsc.start(now + 1.15);
    bassOsc.stop(now + 3.0);
  }

  public playCelebrationNotification() {
    this.playGrandCelebrationTheme();
  }

  public playClick() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * POS terminal / postnet thermal printer paper feed followed by approved payment beeps
   */
  public playPosnetPrintAndBeep() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 1. Mechanical paper feed chatter (Posnet thermal head buzzing)
    const chatterSteps = 8;
    for (let i = 0; i < chatterSteps; i++) {
      const stepTime = now + i * 0.055;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.035);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = (Math.random() * 2 - 1) * 0.4;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 + (i % 2) * 400, stepTime);
      filter.Q.setValueAtTime(4.0, stepTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, stepTime);
      gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.032);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(stepTime);
      noise.stop(stepTime + 0.035);
    }

    // 2. High-pitch Posnet "Pago Aprobado" confirmation double beep
    const beepTimes = [now + 0.52, now + 0.68];
    beepTimes.forEach((bTime) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1864, bTime); // A#6 high POS tone

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, bTime);
      gain.gain.linearRampToValueAtTime(0.28, bTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, bTime + 0.11);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(bTime);
      osc.stop(bTime + 0.12);
    });
  }

  /**
   * GPS navigation routing chime (like Waze/Google Maps GPS recalculating or route set)
   */
  public playGpsChime() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const notes = [659.25, 987.77, 1318.51]; // E5, B5, E6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const noteTime = now + idx * 0.09;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.22, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.24);
    });
  }
}

export const audioEngine = new CinematicAudioEngine();
