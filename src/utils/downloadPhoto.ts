/**
 * Ultra-compatible photo download and saving engine
 * Optimized 100% for iOS (Safari, iPhone 12-16 Pro, iPad) and Android (Samsung Galaxy S24, Chrome, Samsung Internet)
 */

// Memory cache for instantaneous download without network wait
let cachedBlob: Blob | null = null;
let isPreloading = false;

/**
 * Preload the photo blob in the background as soon as the app starts
 */
export async function preloadPhotoBlob(url: string = '/assets/chinita.jpg'): Promise<Blob | null> {
  if (cachedBlob) return cachedBlob;
  if (isPreloading) return null;
  
  isPreloading = true;
  try {
    const res = await fetch(url, { cache: 'force-cache' });
    const blob = await res.blob();
    cachedBlob = new Blob([blob], { type: 'image/jpeg' });
    return cachedBlob;
  } catch (err) {
    console.warn('Preload photo warning:', err);
    return null;
  } finally {
    isPreloading = false;
  }
}

/**
 * Check if the browser natively supports sharing image files via Web Share API
 * (Supported on iOS Safari, Android Chrome, Samsung Internet)
 */
export function canShareFiles(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (!navigator.share || !navigator.canShare) return false;
  try {
    const testFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    return navigator.canShare({ files: [testFile] });
  } catch {
    return false;
  }
}

/**
 * Download or save Chinita's photo directly with platform-optimized methods:
 * - Android (Samsung S24, Chrome): Direct file download to Downloads folder
 * - iOS (iPhone): Direct download prompt or native Share Sheet ("Guardar imagen" in Photos)
 * - In-app webviews: Resilient fallback
 */
export async function downloadChinitaPhoto(
  url: string = '/assets/chinita.jpg',
  filename: string = 'foto-chinita-pedidosya-cordoba.jpg'
): Promise<{ success: boolean; method: string }> {
  try {
    // 1. Retrieve the JPEG blob (from preloaded cache or fetch)
    let blob = cachedBlob;
    if (!blob) {
      const response = await fetch(url, { cache: 'force-cache' });
      const rawBlob = await response.blob();
      blob = new Blob([rawBlob], { type: 'image/jpeg' });
      cachedBlob = blob;
    }

    // Detect iOS devices (iPhone, iPad, iPod)
    const isIOS =
      typeof navigator !== 'undefined' &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

    // File representation for Web Share / modern save
    const file = new File([blob], filename, { type: 'image/jpeg' });

    // On iOS Safari: Web Share API allows direct 1-tap "Guardar imagen" to Photos
    // if the user gesture allows it
    if (isIOS && typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Foto Chinita - PedidosYa Córdoba',
          text: '¡Entrega especial a Córdoba! Foto de Chinita',
        });
        return { success: true, method: 'ios-share' };
      } catch (shareErr: unknown) {
        const error = shareErr as { name?: string };
        if (error?.name === 'AbortError') {
          // User closed share sheet without error
          return { success: true, method: 'ios-share-dismissed' };
        }
        // If sharing failed, fallback immediately to blob link download
      }
    }

    // High-reliability Blob download (Standard for Android Chrome, Samsung Internet & Safari Downloads)
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.rel = 'noopener noreferrer';
    a.style.display = 'none';
    document.body.appendChild(a);

    // Trigger synthetic click
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvent);

    // Clean up
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(blobUrl);
    }, 2000);

    return { success: true, method: 'blob-download' };
  } catch (err) {
    console.warn('Direct blob download fallback to direct anchor:', err);
    // Absolute fallback: direct file link
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
      }, 500);
      return { success: true, method: 'direct-anchor' };
    } catch {
      return { success: false, method: 'error' };
    }
  }
}

/**
 * Explicit Share Action (especially handy for WhatsApp, Instagram, or iOS Photos)
 */
export async function shareChinitaPhoto(
  url: string = '/assets/chinita.jpg',
  filename: string = 'foto-chinita-pedidosya-cordoba.jpg'
): Promise<boolean> {
  try {
    let blob = cachedBlob;
    if (!blob) {
      const response = await fetch(url, { cache: 'force-cache' });
      blob = await response.blob();
      cachedBlob = new Blob([blob], { type: 'image/jpeg' });
    }

    const file = new File([blob], filename, { type: 'image/jpeg' });

    if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Foto Chinita - PedidosYa Córdoba',
        text: '¡Entrega especial a Córdoba! Foto de Chinita',
      });
      return true;
    }
  } catch (err: unknown) {
    const error = err as { name?: string };
    if (error?.name === 'AbortError') return true;
  }

  // Fallback to standard download if share is not available
  const res = await downloadChinitaPhoto(url, filename);
  return res.success;
}
