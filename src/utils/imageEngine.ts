export type ResizeMode = 'percentage' | 'exact' | 'preset';
export type OutputFormat = 'original' | 'webp' | 'jpeg' | 'png';

export interface PresetOption {
  id: string;
  name: string;
  category: 'social' | 'web';
  width: number;
  height: number;
}

export const PRESET_OPTIONS: PresetOption[] = [
  { id: 'ig-square', name: 'Instagram Post (1080 × 1080)', category: 'social', width: 1080, height: 1080 },
  { id: 'ig-story', name: 'Instagram Story / Reel (1080 × 1920)', category: 'social', width: 1080, height: 1920 },
  { id: 'ig-landscape', name: 'Instagram Landscape (1080 × 566)', category: 'social', width: 1080, height: 566 },
  { id: 'tw-post', name: 'X / Twitter Post (1200 × 675)', category: 'social', width: 1200, height: 675 },
  { id: 'tw-header', name: 'X / Twitter Header (1500 × 500)', category: 'social', width: 1500, height: 500 },
  { id: 'yt-thumb', name: 'YouTube Thumbnail (1280 × 720)', category: 'social', width: 1280, height: 720 },
  { id: 'yt-banner', name: 'YouTube Banner (2560 × 1440)', category: 'social', width: 2560, height: 1440 },
  { id: 'fb-post', name: 'Facebook Post (1200 × 630)', category: 'social', width: 1200, height: 630 },
  { id: 'linkedin-cover', name: 'LinkedIn Cover (1584 × 396)', category: 'social', width: 1584, height: 396 },
  { id: 'full-hd', name: 'Full HD (1920 × 1080)', category: 'web', width: 1920, height: 1080 },
  { id: '2k-qhd', name: '2K QHD (2560 × 1440)', category: 'web', width: 2560, height: 1440 },
  { id: '4k-uhd', name: '4K Ultra HD (3840 × 2160)', category: 'web', width: 3840, height: 2160 },
  { id: 'web-thumb', name: 'Web Thumbnail (400 × 400)', category: 'web', width: 400, height: 400 },
  { id: 'web-hero', name: 'Website Hero (1600 × 900)', category: 'web', width: 1600, height: 900 },
  { id: 'favicon', name: 'Favicon / Icon (512 × 512)', category: 'web', width: 512, height: 512 },
];

export interface ResizeSettings {
  mode: ResizeMode;
  percentage: number;
  exactWidth: number;
  exactHeight: number;
  lockAspectRatio: boolean;
  presetId: string;
  fitMode: 'contain' | 'cover' | 'stretch';
  format: OutputFormat;
  quality: number; // 1 to 100
  prefix: string;
}

export interface ImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  aspectRatio: number;
  previewUrl: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  errorMessage?: string;
  targetWidth?: number;
  targetHeight?: number;
  processedBlob?: Blob;
  processedSize?: number;
  processedUrl?: string;
  outputFilename?: string;
}

export async function readImageMetadata(file: File): Promise<{
  width: number;
  height: number;
  previewUrl: string;
}> {
  return new Promise((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        previewUrl,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error(`Failed to decode image: ${file.name}`));
    };
    img.src = previewUrl;
  });
}

export function computeTargetDimensions(
  origW: number,
  origH: number,
  settings: ResizeSettings
): { targetW: number; targetH: number } {
  if (settings.mode === 'percentage') {
    const scale = Math.max(0.01, settings.percentage / 100);
    return {
      targetW: Math.max(1, Math.round(origW * scale)),
      targetH: Math.max(1, Math.round(origH * scale)),
    };
  }

  if (settings.mode === 'preset') {
    const preset = PRESET_OPTIONS.find((p) => p.id === settings.presetId) || PRESET_OPTIONS[0];
    if (settings.fitMode === 'stretch') {
      return { targetW: preset.width, targetH: preset.height };
    }
    // Contain (preserve aspect ratio within preset box)
    const scale = Math.min(preset.width / origW, preset.height / origH);
    return {
      targetW: Math.max(1, Math.round(origW * scale)),
      targetH: Math.max(1, Math.round(origH * scale)),
    };
  }

  // Exact Dimensions
  const targetW = settings.exactWidth > 0 ? settings.exactWidth : origW;
  const targetH = settings.exactHeight > 0 ? settings.exactHeight : origH;

  if (settings.lockAspectRatio) {
    const ratio = origW / origH;
    if (settings.exactWidth > 0 && settings.exactHeight <= 0) {
      return {
        targetW: settings.exactWidth,
        targetH: Math.max(1, Math.round(settings.exactWidth / ratio)),
      };
    }
    if (settings.exactHeight > 0 && settings.exactWidth <= 0) {
      return {
        targetW: Math.max(1, Math.round(settings.exactHeight * ratio)),
        targetH: settings.exactHeight,
      };
    }
    // If both specified, fit within envelope preserving aspect ratio
    const scale = Math.min(targetW / origW, targetH / origH);
    return {
      targetW: Math.max(1, Math.round(origW * scale)),
      targetH: Math.max(1, Math.round(origH * scale)),
    };
  }

  return {
    targetW: Math.max(1, targetW),
    targetH: Math.max(1, targetH),
  };
}

export function determineMimeAndExtension(
  inputFile: File,
  chosenFormat: OutputFormat
): { mimeType: string; extension: string } {
  if (chosenFormat === 'webp') {
    return { mimeType: 'image/webp', extension: '.webp' };
  }
  if (chosenFormat === 'jpeg') {
    return { mimeType: 'image/jpeg', extension: '.jpg' };
  }
  if (chosenFormat === 'png') {
    return { mimeType: 'image/png', extension: '.png' };
  }

  // Original format
  const type = inputFile.type.toLowerCase();
  if (type === 'image/png') return { mimeType: 'image/png', extension: '.png' };
  if (type === 'image/webp') return { mimeType: 'image/webp', extension: '.webp' };
  if (type === 'image/jpeg' || type === 'image/jpg') return { mimeType: 'image/jpeg', extension: '.jpg' };
  if (type === 'image/avif') return { mimeType: 'image/webp', extension: '.webp' }; // Canvas fallback
  return { mimeType: 'image/jpeg', extension: '.jpg' };
}

export function generateOutputFilename(
  originalName: string,
  prefix: string,
  extension: string
): string {
  const dotIndex = originalName.lastIndexOf('.');
  const baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
  const safePrefix = prefix ? prefix.trim() : '';
  return `${safePrefix}${baseName}${extension}`;
}

/**
 * High-performance, multi-step bilinear image resizing using Canvas.
 * Employs stepped downsampling if reduction is greater than 50% to prevent aliasing.
 */
export async function resizeImageToBlob(
  file: File,
  targetW: number,
  targetH: number,
  mimeType: string,
  qualityPercent: number
): Promise<Blob> {
  // Load image
  const imgBitmap = await createImageBitmap(file);

  const origW = imgBitmap.width;
  const origH = imgBitmap.height;

  // If resizing requires significant downscaling, do multi-step downscale for pristine clarity
  let currentCanvas: HTMLCanvasElement | OffscreenCanvas;
  let currentCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

  const useOffscreen = typeof OffscreenCanvas !== 'undefined';

  if (useOffscreen) {
    currentCanvas = new OffscreenCanvas(origW, origH);
    currentCtx = currentCanvas.getContext('2d', { alpha: true }) as OffscreenCanvasRenderingContext2D;
  } else {
    currentCanvas = document.createElement('canvas');
    currentCanvas.width = origW;
    currentCanvas.height = origH;
    currentCtx = currentCanvas.getContext('2d', { alpha: true }) as CanvasRenderingContext2D;
  }

  currentCtx.imageSmoothingEnabled = true;
  currentCtx.imageSmoothingQuality = 'high';
  currentCtx.drawImage(imgBitmap, 0, 0, origW, origH);
  imgBitmap.close();

  // Multi-step reduction loop
  let curW = origW;
  let curH = origH;

  while (curW / 2 > targetW && curH / 2 > targetH) {
    curW = Math.round(curW / 2);
    curH = Math.round(curH / 2);

    let nextCanvas: HTMLCanvasElement | OffscreenCanvas;
    let nextCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

    if (useOffscreen) {
      nextCanvas = new OffscreenCanvas(curW, curH);
      nextCtx = nextCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    } else {
      nextCanvas = document.createElement('canvas');
      nextCanvas.width = curW;
      nextCanvas.height = curH;
      nextCtx = nextCanvas.getContext('2d') as CanvasRenderingContext2D;
    }

    nextCtx.imageSmoothingEnabled = true;
    nextCtx.imageSmoothingQuality = 'high';
    nextCtx.drawImage(currentCanvas, 0, 0, curW, curH);
    currentCanvas = nextCanvas;
    currentCtx = nextCtx;
  }

  // Final draw to exact target dimensions
  let finalCanvas: HTMLCanvasElement | OffscreenCanvas;
  let finalCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

  if (useOffscreen) {
    finalCanvas = new OffscreenCanvas(targetW, targetH);
    finalCtx = finalCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  } else {
    finalCanvas = document.createElement('canvas');
    finalCanvas.width = targetW;
    finalCanvas.height = targetH;
    finalCtx = finalCanvas.getContext('2d') as CanvasRenderingContext2D;
  }

  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = 'high';

  // If converting to JPEG, fill white background to avoid transparent black artifacts
  if (mimeType === 'image/jpeg') {
    finalCtx.fillStyle = '#ffffff';
    finalCtx.fillRect(0, 0, targetW, targetH);
  }

  finalCtx.drawImage(currentCanvas, 0, 0, targetW, targetH);

  // Convert to Blob
  const quality = Math.min(1.0, Math.max(0.01, qualityPercent / 100));

  if (useOffscreen && 'convertToBlob' in finalCanvas) {
    return await (finalCanvas as OffscreenCanvas).convertToBlob({
      type: mimeType,
      quality: mimeType === 'image/png' ? undefined : quality,
    });
  }

  return new Promise<Blob>((resolve, reject) => {
    (finalCanvas as HTMLCanvasElement).toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas blob generation failed'));
      },
      mimeType,
      quality
    );
  });
}

/**
 * Concurrency-controlled batch processor.
 * Processes items with up to maxConcurrent workers so UI stays responsive and memory usage is controlled.
 */
export async function processBatchQueue(
  items: ImageItem[],
  settings: ResizeSettings,
  onItemProgress: (updatedItem: ImageItem) => void,
  maxConcurrent = 4
): Promise<void> {
  const concurrency = Math.min(
    maxConcurrent,
    typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4
  );

  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      const item = items[currentIndex];

      // Mark processing
      onItemProgress({
        ...item,
        status: 'processing',
      });

      try {
        const { targetW, targetH } = computeTargetDimensions(
          item.originalWidth,
          item.originalHeight,
          settings
        );
        const { mimeType, extension } = determineMimeAndExtension(item.file, settings.format);
        const outputFilename = generateOutputFilename(item.name, settings.prefix, extension);

        const processedBlob = await resizeImageToBlob(
          item.file,
          targetW,
          targetH,
          mimeType,
          settings.quality
        );

        const processedUrl = URL.createObjectURL(processedBlob);

        onItemProgress({
          ...item,
          status: 'done',
          targetWidth: targetW,
          targetHeight: targetH,
          processedBlob,
          processedSize: processedBlob.size,
          processedUrl,
          outputFilename,
        });
      } catch (err: any) {
        onItemProgress({
          ...item,
          status: 'error',
          errorMessage: err?.message || 'Processing failed',
        });
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
}
