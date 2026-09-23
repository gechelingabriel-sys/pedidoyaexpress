export interface SceneDefinition {
  id: number;
  name: string;
  subtitle: string;
  startSec: number;
  endSec: number;
  description: string;
  audioCue: string;
  visualCue: string;
  cameraMovement: string;
}

export interface VideoConfig {
  recipientName: string;
  messageLine1: string;
  messageLine2: string;
  photoUrl: string;
  enableConfetti: boolean;
  enableGrain: boolean;
  enableHandheldShake: boolean;
  volume: number;
  isMuted: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  tilt: number;
  tiltSpeed: number;
  opacity: number;
}
