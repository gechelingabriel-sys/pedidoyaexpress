/**
 * Canvas Video Renderer for 9:16 Cinematic PedidosYa Delivery Story
 * 720 x 1280 resolution (9:16 aspect ratio)
 * 10 seconds total duration (0.00s to 10.00s)
 */

import { Particle, VideoConfig } from '../types';

export class CinematicRenderer {
  private width: number = 720;
  private height: number = 1280;

  // Preloaded image assets
  private buildingImg: HTMLImageElement | null = null;
  private boxImg: HTMLImageElement | null = null;
  private chinitaImg: HTMLImageElement | null = null;
  private isAssetsLoaded: boolean = false;

  // Confetti particle system
  private confettiParticles: Particle[] = [];

  constructor() {
    this.initConfetti();
  }

  public async preloadAssets(customPhotoUrl?: string): Promise<boolean> {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => {
          console.warn('Failed to load image:', src);
          resolve(img); // resolve anyway to avoid blocking
        };
        img.src = src;
      });
    };

    try {
      const [building, box, chinita] = await Promise.all([
        loadImage('/assets/building_entrance.jpg'),
        loadImage('/assets/pedidosya_box.jpg'),
        loadImage(customPhotoUrl || '/assets/chinita.jpg'),
      ]);

      this.buildingImg = building;
      this.boxImg = box;
      this.chinitaImg = chinita;
      this.isAssetsLoaded = true;
      return true;
    } catch (e) {
      console.error('Error preloading assets:', e);
      return false;
    }
  }

  public updatePhoto(newUrl: string) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.chinitaImg = img;
    };
    img.src = newUrl;
  }

  private initConfetti() {
    this.confettiParticles = [];
    const colors = ['#E31A38', '#FFD700', '#29C5F6', '#FFFFFF', '#FFB800', '#FF3B56'];
    for (let i = 0; i < 65; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * -this.height * 0.5,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 2.2 + Math.random() * 3.5,
        size: 7 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        tilt: Math.random() * 180,
        tiltSpeed: 3 + Math.random() * 6,
        opacity: 0.85 + Math.random() * 0.15,
      });
    }
  }

  /**
   * Main render function called per frame
   * t: current time in seconds (0.00 to 10.00)
   */
  public renderFrame(
    ctx: CanvasRenderingContext2D,
    t: number,
    config: VideoConfig
  ) {
    const w = this.width;
    const h = this.height;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // Natural Handheld camera movement (subtle drift + micro breathing)
    let camShakeX = 0;
    let camShakeY = 0;
    let camRotate = 0;

    if (config.enableHandheldShake) {
      camShakeX = Math.sin(t * 3.2) * 2.5 + Math.cos(t * 5.7) * 1.5;
      camShakeY = Math.cos(t * 2.8) * 3.0 + Math.sin(t * 4.9) * 1.8;
      camRotate = (Math.sin(t * 1.5) * 0.004) + (Math.cos(t * 3.1) * 0.002);

      // Extra bump when motorcycle stops at 1.8s
      if (t >= 1.6 && t <= 2.0) {
        const bumpT = (t - 1.6) / 0.4;
        const decay = Math.exp(-bumpT * 4);
        camShakeY += Math.sin(bumpT * Math.PI * 4) * 8 * decay;
      }
    }

    ctx.translate(w / 2 + camShakeX, h / 2 + camShakeY);
    ctx.rotate(camRotate);
    ctx.translate(-w / 2, -h / 2);

    // ROUTE TO SCENE RENDERER BASED ON TIME
    if (t < 2.0) {
      this.renderScene1_Exterior(ctx, t, w, h);
    } else if (t < 3.5) {
      this.renderScene2_BoxCloseUp(ctx, t, w, h);
    } else if (t < 6.0) {
      this.renderScene3_Unzipping(ctx, t, w, h);
    } else if (t < 8.0) {
      this.renderScene4_PhotoEmerges(ctx, t, w, h);
    } else {
      this.renderScene5_Celebration(ctx, t, w, h, config);
    }

    ctx.restore();

    // Cinematic Daylight Color Grade & Lens Vignette
    this.renderCinematicPostProcess(ctx, w, h, config.enableGrain, t);
  }

  // -------------------------------------------------------------
  // SCENE 1: Exterior of residential building & motorcycle arrival (0:00 - 2:00)
  // -------------------------------------------------------------
  private renderScene1_Exterior(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
    const progress = t / 2.0;

    // Building entrance background with gentle handheld push
    const scale = 1.05 + progress * 0.04;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(scale, scale);
    ctx.translate(-w / 2, -h / 2);

    if (this.buildingImg && this.buildingImg.complete) {
      // Draw building entrance covering 9:16
      this.drawCoverImage(ctx, this.buildingImg, 0, 0, w, h, 0.5, 0.45);
    } else {
      // Fallback procedural modern building facade
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#5A6F82');
      grad.addColorStop(0.5, '#7F8C8D');
      grad.addColorStop(1, '#34495E');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Daylight ambient street lighting
    const sunGrad = ctx.createRadialGradient(w * 0.8, h * 0.15, 20, w * 0.8, h * 0.15, w * 0.9);
    sunGrad.addColorStop(0, 'rgba(255, 252, 235, 0.35)');
    sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // Motorcycle approaching into frame from bottom-left (0.0s to 1.8s)
    // At t=0.0, off-screen left/bottom. At t=1.8s, decelerates to a stop at the curb.
    const bikeArrivalProgress = Math.min(1.0, Math.pow(t / 1.7, 0.75)); // deceleration ease
    const bikeX = -w * 0.6 + bikeArrivalProgress * (w * 0.6 + w * 0.05);
    const bikeY = h * 0.65 - (1 - bikeArrivalProgress) * 60;

    // Draw motorcycle mirror & PedidosYa box edge pulling into curb
    ctx.save();
    ctx.translate(bikeX, bikeY);

    if (this.boxImg && this.boxImg.complete) {
      // Render the rear rack and red delivery box pulling up
      const boxW = w * 0.75;
      const boxH = boxW * 0.75;
      ctx.drawImage(this.boxImg, 0, 0, boxW, boxH);
    } else {
      ctx.fillStyle = '#E31A38';
      ctx.fillRect(0, 0, w * 0.7, h * 0.4);
    }
    ctx.restore();

    // Street curb and pavement overlay at bottom
    ctx.fillStyle = 'rgba(30, 35, 40, 0.2)';
    ctx.fillRect(0, h * 0.88, w, h * 0.12);
  }

  // -------------------------------------------------------------
  // SCENE 2: Close-up of PedidosYa box on motorcycle (2:00 - 3:50)
  // -------------------------------------------------------------
  private renderScene2_BoxCloseUp(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
    const sceneT = t - 2.0; // 0.0 to 1.5
    const progress = sceneT / 1.5;

    // Cinematic push-in towards the red box and logo
    const zoom = 1.25 + progress * 0.18; // smooth camera push-in

    ctx.save();
    ctx.translate(w / 2, h * 0.48);
    ctx.scale(zoom, zoom);
    ctx.translate(-w / 2, -h * 0.48);

    if (this.boxImg && this.boxImg.complete) {
      // Focus on the prominent red and grey insulated box with the "P" icon
      this.drawCoverImage(ctx, this.boxImg, 0, 0, w, h, 0.58, 0.38);
    } else {
      this.drawProceduralBox(ctx, w, h, 0);
    }

    // Doorbell chime visual resonance pulse at 2.3s - 2.6s
    if (t >= 2.3 && t <= 2.9) {
      const pulseT = (t - 2.3) / 0.6;
      const alpha = Math.max(0, 1 - pulseT) * 0.3;
      const radius = 60 + pulseT * 180;

      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 4 * (1 - pulseT);
      ctx.beginPath();
      ctx.arc(w * 0.52, h * 0.4, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(227, 26, 56, ${alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(w * 0.52, h * 0.4, radius * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  // -------------------------------------------------------------
  // SCENE 3: Extreme close-up, zipper unzips & lid opens (3:50 - 6:00)
  // -------------------------------------------------------------
  private renderScene3_Unzipping(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
    const sceneT = t - 3.5; // 0.0 to 2.5
    const unzipProgress = Math.min(1.0, Math.max(0, (sceneT - 0.1) / 1.2)); // 3.6s to 4.8s
    const lidOpenProgress = Math.min(1.0, Math.max(0, (sceneT - 0.7) / 1.5)); // 4.2s to 5.7s

    // Extreme close up of the top lid of the box
    ctx.save();

    // Red ripstop nylon fabric base of the bag
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#B71029');
    bgGrad.addColorStop(0.3, '#E31A38');
    bgGrad.addColorStop(0.7, '#D41733');
    bgGrad.addColorStop(1, '#8C0B1D');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Fabric weave texture overlay
    this.drawRipstopPattern(ctx, w, h);

    // Box top perimeter boundary
    const boxLeft = w * 0.12;
    const boxRight = w * 0.88;
    const boxTop = h * 0.28;
    const boxBottom = h * 0.72;

    // Inside the box: Silver thermal foil lining + warm golden light inside!
    if (lidOpenProgress > 0) {
      ctx.save();
      // Draw interior opening cavity
      ctx.beginPath();
      ctx.roundRect(boxLeft, boxTop, boxRight - boxLeft, boxBottom - boxTop, 16);
      ctx.clip();

      // Silver embossed thermal foil lining
      this.drawThermalFoil(ctx, boxLeft, boxTop, boxRight - boxLeft, boxBottom - boxTop);

      // Warm golden glow radiating from inside
      const glowIntensity = Math.min(1.0, lidOpenProgress * 1.4);
      const innerGlow = ctx.createRadialGradient(
        w / 2, h * 0.52, 20,
        w / 2, h * 0.52, (boxRight - boxLeft) * 0.65
      );
      innerGlow.addColorStop(0, `rgba(255, 235, 160, ${0.9 * glowIntensity})`);
      innerGlow.addColorStop(0.35, `rgba(255, 180, 50, ${0.7 * glowIntensity})`);
      innerGlow.addColorStop(0.7, `rgba(227, 26, 56, ${0.4 * glowIntensity})`);
      innerGlow.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
      ctx.fillStyle = innerGlow;
      ctx.fillRect(boxLeft, boxTop, boxRight - boxLeft, boxBottom - boxTop);

      // Volumetric light rays spilling out
      if (glowIntensity > 0.3) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const numRays = 8;
        for (let i = 0; i < numRays; i++) {
          const angle = (i / numRays) * Math.PI - Math.PI / 2;
          const rayGrad = ctx.createLinearGradient(
            w / 2, h * 0.5,
            w / 2 + Math.cos(angle) * w * 0.6,
            h * 0.5 + Math.sin(angle) * h * 0.4
          );
          rayGrad.addColorStop(0, `rgba(255, 240, 180, ${0.35 * glowIntensity})`);
          rayGrad.addColorStop(1, 'rgba(255, 200, 100, 0)');
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(w / 2, h * 0.5);
          ctx.lineTo(w / 2 + Math.cos(angle - 0.15) * w * 0.8, h * 0.5 + Math.sin(angle - 0.15) * h * 0.6);
          ctx.lineTo(w / 2 + Math.cos(angle + 0.15) * w * 0.8, h * 0.5 + Math.sin(angle + 0.15) * h * 0.6);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.restore();
    }

    // Top flap: folds open backwards with 3D perspective fold
    if (lidOpenProgress < 1.0) {
      ctx.save();
      const foldAmount = Math.pow(lidOpenProgress, 1.3);
      const flapY = boxTop;
      const flapHeight = (boxBottom - boxTop) * (1 - foldAmount);

      ctx.beginPath();
      ctx.roundRect(boxLeft, flapY, boxRight - boxLeft, flapHeight, 16);
      ctx.fillStyle = '#E31A38';
      ctx.fill();

      // Flap seam & PedidosYa logo on flap
      ctx.strokeStyle = '#B71029';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Prominent white 'P' icon on top lid
      if (flapHeight > 80) {
        ctx.save();
        ctx.translate(w / 2, flapY + flapHeight * 0.45);
        const iconScale = Math.min(1.0, flapHeight / 250);
        ctx.scale(iconScale, iconScale);
        this.drawPedidosYaIcon(ctx, 0, 0, 52);
        ctx.restore();
      }

      ctx.restore();
    }

    // Zipper Track & Zipper Pulls
    this.drawZipperTrack(ctx, boxLeft, boxTop, boxRight, boxBottom, unzipProgress);

    ctx.restore();
  }

  // -------------------------------------------------------------
  // SCENE 4: Photographic print emerges from the glowing box (6:00 - 8:00)
  // -------------------------------------------------------------
  private renderScene4_PhotoEmerges(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
    const sceneT = t - 6.0; // 0.0 to 2.0
    const emergeProgress = Math.min(1.0, sceneT / 1.7);
    const easeOut = 1 - Math.pow(1 - emergeProgress, 3); // cubic ease out

    // Background: Warmly glowing opened thermal box, softly blurred
    ctx.save();
    // Bokeh blurred delivery box interior
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#5C0816');
    bgGrad.addColorStop(0.4, '#B71029');
    bgGrad.addColorStop(0.8, '#D97706'); // warm golden light from box
    bgGrad.addColorStop(1, '#1A0A05');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Warm radial core illumination
    const warmCore = ctx.createRadialGradient(w / 2, h * 0.58, 40, w / 2, h * 0.58, w * 0.7);
    warmCore.addColorStop(0, 'rgba(255, 230, 150, 0.75)');
    warmCore.addColorStop(0.5, 'rgba(245, 158, 11, 0.4)');
    warmCore.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = warmCore;
    ctx.fillRect(0, 0, w, h);

    // Photographic print rising upright out of the box
    // Photo starts tilted slightly, rising up from h * 0.75 to h * 0.48
    const photoY = h * 0.72 - easeOut * (h * 0.24);
    const photoTilt = (1 - easeOut) * 0.08; // tilts slightly as it emerges, then straightens
    const photoScale = 0.75 + easeOut * 0.22;

    ctx.translate(w / 2, photoY);
    ctx.rotate(photoTilt);
    ctx.scale(photoScale, photoScale);

    this.drawPhotographicPrint(ctx, 0, 0, w * 0.78, w * 0.78 * 1.33, true);

    ctx.restore();
  }

  // -------------------------------------------------------------
  // SCENE 5: Photo Centered + ¡FELICIDADES CHINITA! + Confetti (8:00 - 10:00)
  // -------------------------------------------------------------
  private renderScene5_Celebration(
    ctx: CanvasRenderingContext2D,
    t: number,
    w: number,
    h: number,
    config: VideoConfig
  ) {
    const sceneT = t - 8.0; // 0.0 to 2.0 seconds

    // Rich cinematic background with PedidosYa signature gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#0F172A');
    bgGrad.addColorStop(0.3, '#1E293B');
    bgGrad.addColorStop(0.7, '#881337');
    bgGrad.addColorStop(1, '#E31A38');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Warm ambient halo behind the photo
    const halo = ctx.createRadialGradient(w / 2, h * 0.46, 50, w / 2, h * 0.46, w * 0.65);
    halo.addColorStop(0, 'rgba(255, 235, 180, 0.35)');
    halo.addColorStop(0.6, 'rgba(227, 26, 56, 0.25)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);

    // 1. Center Photographic Print
    ctx.save();
    ctx.translate(w / 2, h * 0.46);

    // Subtle gentle breathing scale
    const breath = 1.0 + Math.sin(sceneT * 2.5) * 0.012;
    ctx.scale(breath, breath);

    this.drawPhotographicPrint(ctx, 0, 0, w * 0.82, w * 0.82 * 1.32, false);
    ctx.restore();

    // 2. Confetti Particles Simulation
    if (config.enableConfetti) {
      this.drawConfetti(ctx, sceneT);
    }

    // 3. Impactful Celebration Typography (Appears suddenly at t=8.0s)
    // Large, bold, white text suddenly appears over the image:
    // "¡FELICIDADES CHINITA! TU PEDIDO FUE ENTREGADO!"
    this.drawCelebrationTypography(ctx, sceneT, w, h, config);
  }

  // -------------------------------------------------------------
  // HELPER DRAWING ROUTINES
  // -------------------------------------------------------------

  private drawPhotographicPrint(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    printW: number,
    printH: number,
    withGlow: boolean
  ) {
    ctx.save();
    ctx.translate(x, y);

    // Print drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 18;

    // White Archival Photo Paper Border
    ctx.fillStyle = '#FFFFFF';
    const borderX = -printW / 2;
    const borderY = -printH / 2;
    const radius = 8;
    ctx.beginPath();
    ctx.roundRect(borderX, borderY, printW, printH, radius);
    ctx.fill();

    // Reset shadow for inner photo
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Inner photo area (classic Polaroid/portrait margins)
    const margin = printW * 0.045;
    const marginBottom = printW * 0.12; // bottom margin
    const innerX = borderX + margin;
    const innerY = borderY + margin;
    const innerW = printW - margin * 2;
    const innerH = printH - margin - marginBottom;

    // Clip for photo
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(innerX, innerY, innerW, innerH, 4);
    ctx.clip();

    if (this.chinitaImg && this.chinitaImg.complete && this.chinitaImg.naturalWidth > 0) {
      this.drawCoverImage(ctx, this.chinitaImg, innerX, innerY, innerW, innerH, 0.5, 0.4);
    } else {
      // Elegant placeholder portrait if still loading
      const pGrad = ctx.createLinearGradient(innerX, innerY, innerX, innerY + innerH);
      pGrad.addColorStop(0, '#FBCFE8');
      pGrad.addColorStop(1, '#F43F5E');
      ctx.fillStyle = pGrad;
      ctx.fillRect(innerX, innerY, innerW, innerH);
    }

    // Photographic Gloss sheen across diagonal
    const gloss = ctx.createLinearGradient(
      innerX, innerY,
      innerX + innerW * 0.8, innerY + innerH * 0.8
    );
    gloss.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    gloss.addColorStop(0.35, 'rgba(255, 255, 255, 0.08)');
    gloss.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    gloss.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    ctx.fillStyle = gloss;
    ctx.fillRect(innerX, innerY, innerW, innerH);

    ctx.restore(); // end clip

    // PedidosYa Verified Delivery Watermark on bottom border
    ctx.fillStyle = '#64748B';
    ctx.font = '600 12px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PEDIDOSYA · ENTREGA CONFIRMADA', 0, borderY + printH - marginBottom * 0.38);

    // Warm golden rim highlight when emerging
    if (withGlow) {
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(borderX, borderY, printW, printH, radius);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawCelebrationTypography(
    ctx: CanvasRenderingContext2D,
    sceneT: number,
    w: number,
    h: number,
    config: VideoConfig
  ) {
    ctx.save();

    // Sudden bold impact punch: scales down from 1.25 to 1.0 in 0.18s
    const punchScale = sceneT < 0.18 ? 1.0 + (1 - sceneT / 0.18) * 0.25 : 1.0;

    // Dark readable translucent backing scrim over center-lower portion to guarantee maximum contrast
    const scrimGrad = ctx.createLinearGradient(0, h * 0.65, 0, h * 0.95);
    scrimGrad.addColorStop(0, 'rgba(15, 23, 42, 0)');
    scrimGrad.addColorStop(0.25, 'rgba(15, 23, 42, 0.88)');
    scrimGrad.addColorStop(0.8, 'rgba(15, 23, 42, 0.94)');
    scrimGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = scrimGrad;
    ctx.fillRect(0, h * 0.65, w, h * 0.3);

    ctx.translate(w / 2, h * 0.78);
    ctx.scale(punchScale, punchScale);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // PedidosYa Verified Tag Pill Above Text
    ctx.save();
    ctx.fillStyle = '#E31A38';
    const tagW = 210;
    const tagH = 32;
    ctx.beginPath();
    ctx.roundRect(-tagW / 2, -75, tagW, tagH, 16);
    ctx.fill();

    // White text in pill
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 12px Montserrat, sans-serif';
    ctx.letterSpacing = '1.5px';
    ctx.fillText('PEDIDO ENTREGADO', 0, -59);
    ctx.restore();

    // Main Title: "¡FELICIDADES CHINITA!"
    // Large, bold, white text with cinematic drop shadow
    const line1 = config.messageLine1 || '¡FELICIDADES CHINITA!';
    const line2 = config.messageLine2 || 'TU PEDIDO FUE ENTREGADO!';

    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 38px Montserrat, Bebas Neue, sans-serif';
    ctx.fillText(line1, 0, -15);

    // Subtitle Line 2: "TU PEDIDO FUE ENTREGADO!"
    ctx.font = '800 24px Montserrat, sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.shadowBlur = 12;
    ctx.fillText(line2, 0, 30);

    // Golden celebratory accent star/sparkle
    ctx.shadowColor = 'transparent';
    this.drawSparkle(ctx, -w * 0.34, -18, 14, '#FFD700');
    this.drawSparkle(ctx, w * 0.34, -18, 14, '#FFD700');

    ctx.restore();
  }

  private drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.quadraticCurveTo(0, 0, 0, r);
    ctx.quadraticCurveTo(0, 0, -r, 0);
    ctx.quadraticCurveTo(0, 0, 0, -r);
    ctx.fill();
    ctx.restore();
  }

  private drawConfetti(ctx: CanvasRenderingContext2D, sceneT: number) {
    ctx.save();
    this.confettiParticles.forEach((p, idx) => {
      // Advance particle physics based on scene time
      const timeOffset = sceneT * 60;
      const currentY = (p.y + p.vy * timeOffset) % (this.height + 100);
      const currentX = p.x + Math.sin(sceneT * 2 + idx) * 35;
      const rotation = (p.rotation + p.rotationSpeed * timeOffset) * (Math.PI / 180);
      const tilt = Math.cos((p.tilt + p.tiltSpeed * timeOffset) * (Math.PI / 180));

      ctx.save();
      ctx.translate(currentX, currentY);
      ctx.rotate(rotation);
      ctx.scale(1, tilt);

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;

      if (idx % 3 === 0) {
        // Ribbon / rectangle
        ctx.fillRect(-p.size / 2, -p.size * 0.8, p.size, p.size * 1.6);
      } else if (idx % 3 === 1) {
        // Square
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        // Circle dot
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
    ctx.restore();
  }

  private drawZipperTrack(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    unzipProgress: number
  ) {
    ctx.save();

    // Dark zipper tape path
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 14;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

    // Silver metallic teeth
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 3;
    ctx.setLineDash([4, 6]);
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    ctx.setLineDash([]);

    // Two Cyan zipper sliders (PedidosYa cyan signature pulls) moving along perimeter
    const perimeter = (x2 - x1) * 2 + (y2 - y1) * 2;
    const travelDist = (perimeter / 2) * unzipProgress;

    // Pull 1: Left-to-right top
    const pull1X = Math.min(x2, x1 + (x2 - x1) * unzipProgress);
    const pull1Y = y1;

    // Draw Cyan Slider 1
    this.drawZipperSlider(ctx, pull1X, pull1Y, '#29C5F6');

    // Pull 2: Left side going down
    const pull2X = x1;
    const pull2Y = Math.min(y2, y1 + (y2 - y1) * unzipProgress);
    this.drawZipperSlider(ctx, pull2X, pull2Y, '#29C5F6');

    ctx.restore();
  }

  private drawZipperSlider(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
    ctx.save();
    ctx.translate(x, y);

    // Metallic slider body
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(-10, -8, 20, 16);

    // Cyan pull tab hanging down
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-6, 8, 12, 28, 4);
    ctx.fill();

    // Hole in pull tab
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(0, 26, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawRipstopPattern(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    const grid = 18;

    ctx.beginPath();
    for (let x = 0; x < w; x += grid) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += grid) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  private drawThermalFoil(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.save();
    // Silver diamond quilted thermal foil
    const foilGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    foilGrad.addColorStop(0, '#CBD5E1');
    foilGrad.addColorStop(0.3, '#F1F5F9');
    foilGrad.addColorStop(0.6, '#94A3B8');
    foilGrad.addColorStop(1, '#E2E8F0');
    ctx.fillStyle = foilGrad;
    ctx.fillRect(x, y, w, h);

    // Embossed diamond quilt pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    const step = 28;
    ctx.beginPath();
    for (let d = -h; d < w + h; d += step) {
      ctx.moveTo(x + d, y);
      ctx.lineTo(x + d + h, y + h);

      ctx.moveTo(x + d, y + h);
      ctx.lineTo(x + d + h, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  private drawPedidosYaIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
    ctx.save();
    ctx.translate(cx, cy);

    // PedidosYa bold 'P' logo
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    // Outer stem & bowl of P
    const s = size / 50;
    ctx.scale(s, s);

    ctx.beginPath();
    ctx.roundRect(-22, -32, 14, 64, 4); // vertical bar
    ctx.roundRect(-10, -32, 34, 38, [0, 18, 18, 0]); // top curve
    ctx.fill();

    // Cutout hole
    ctx.fillStyle = '#E31A38';
    ctx.beginPath();
    ctx.roundRect(-6, -22, 18, 18, [0, 8, 8, 0]);
    ctx.fill();

    ctx.restore();
  }

  private drawProceduralBox(ctx: CanvasRenderingContext2D, w: number, h: number, open: number) {
    ctx.save();
    ctx.fillStyle = '#E31A38';
    ctx.fillRect(w * 0.15, h * 0.25, w * 0.7, h * 0.5);

    // Grey lower band
    ctx.fillStyle = '#64748B';
    ctx.fillRect(w * 0.15, h * 0.65, w * 0.7, h * 0.1);

    // PedidosYa text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 36px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PedidosYa', w * 0.5, h * 0.52);

    this.drawPedidosYaIcon(ctx, w * 0.5, h * 0.38, 55);
    ctx.restore();
  }

  private drawCoverImage(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    anchorX: number = 0.5,
    anchorY: number = 0.5
  ) {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const destRatio = w / h;

    let srcW = img.naturalWidth;
    let srcH = img.naturalHeight;
    let srcX = 0;
    let srcY = 0;

    if (imgRatio > destRatio) {
      srcW = img.naturalHeight * destRatio;
      srcX = (img.naturalWidth - srcW) * anchorX;
    } else {
      srcH = img.naturalWidth / destRatio;
      srcY = (img.naturalHeight - srcH) * anchorY;
    }

    ctx.drawImage(img, srcX, srcY, srcW, srcH, x, y, w, h);
  }

  private renderCinematicPostProcess(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    enableGrain: boolean,
    t: number
  ) {
    ctx.save();

    // Subtle lens vignette (darkens borders for film immersion)
    const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.45, w / 2, h / 2, w * 0.85);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.18)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Warm daylight color grading wash
    ctx.fillStyle = 'rgba(255, 175, 75, 0.04)';
    ctx.fillRect(0, 0, w, h);

    // Film grain simulation
    if (enableGrain) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
      const seed = Math.sin(t * 100);
      for (let i = 0; i < 40; i++) {
        const gx = ((Math.sin(seed * i * 3) + 1) * 0.5) * w;
        const gy = ((Math.cos(seed * i * 7) + 1) * 0.5) * h;
        ctx.fillRect(gx, gy, 2, 2);
      }
    }

    ctx.restore();
  }
}
