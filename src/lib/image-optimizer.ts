/**
 * TIYATROTIST — Client-Side Image Optimizer & WebP Converter
 *
 * Utilizes native HTML5 Canvas API to:
 * - Crop images to standard aspect ratios (16:9, 4:3, 1:1, or free)
 * - Scale down ultra-large images to max dimensions (e.g. 1920x1080)
 * - Compress and convert into modern .webp format (reducing size by ~70-85%)
 * - Generate optimized File objects for instant Supabase upload
 */

'use client';

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default 0.85)
  aspectRatio?: number; // width / height (e.g. 16/9, 4/3, 1)
}

export interface OptimizationResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  optimizedSize: number;
  savedPercent: number;
  width: number;
  height: number;
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Optimizes, crops, and converts an image file to WebP
 */
export async function optimizeImageToWebP(
  inputFile: File,
  options: OptimizationOptions = {}
): Promise<OptimizationResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    aspectRatio,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Görsel işlenemedi.'));
      img.onload = () => {
        let srcX = 0;
        let srcY = 0;
        let srcW = img.naturalWidth;
        let srcH = img.naturalHeight;

        // Apply aspect ratio crop if requested
        if (aspectRatio && aspectRatio > 0) {
          const currentRatio = srcW / srcH;
          if (currentRatio > aspectRatio) {
            // Source is wider than target ratio: crop width
            const targetW = srcH * aspectRatio;
            srcX = (srcW - targetW) / 2;
            srcW = targetW;
          } else if (currentRatio < aspectRatio) {
            // Source is taller than target ratio: crop height
            const targetH = srcW / aspectRatio;
            srcY = (srcH - targetH) / 2;
            srcH = targetH;
          }
        }

        // Scale down to max dimensions if necessary
        let destW = srcW;
        let destH = srcH;

        if (destW > maxWidth || destH > maxHeight) {
          const ratio = Math.min(maxWidth / destW, maxHeight / destH);
          destW = Math.round(destW * ratio);
          destH = Math.round(destH * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = destW;
        canvas.height = destH;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas 2D context oluşturulamadı.'));
          return;
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw cropped and scaled image onto canvas
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, destW, destH);

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('WebP blob oluşturulamadı.'));
              return;
            }

            const cleanName = inputFile.name.replace(/\.[^/.]+$/, '');
            const webpFileName = `${cleanName}.webp`;
            const optimizedFile = new File([blob], webpFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            const dataUrl = canvas.toDataURL('image/webp', quality);
            const originalSize = inputFile.size;
            const optimizedSize = blob.size;
            const savedPercent =
              originalSize > 0
                ? Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100))
                : 0;

            resolve({
              file: optimizedFile,
              dataUrl,
              originalSize,
              optimizedSize,
              savedPercent,
              width: destW,
              height: destH,
            });
          },
          'image/webp',
          quality
        );
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(inputFile);
  });
}
