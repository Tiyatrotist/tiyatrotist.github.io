/**
 * TIYATROTIST — DotTypography
 * Metin dizelerini nokta-grid koordinat haritalarına dönüştürür.
 * (Converts text strings into dot-grid coordinate maps)
 *
 * Çalışma prensibi:
 * 1. Metni offscreen canvas'a standart font ile render eder.
 * 2. Piksel verisini okur (getImageData).
 * 3. Dolu pikselleri yapılandırılabilir grid aralığında örnekler.
 * 4. Her karakterin nokta formunu temsil eden {x, y} koordinat dizisi döndürür.
 */

import { TextLayout } from './types';

/** DotTypography yapılandırması */
interface DotTypographyConfig {
  /** Font size for rendering (larger = more detail) */
  fontSize?: number;
  /** Font family to use for sampling */
  fontFamily?: string;
  /** Font weight */
  fontWeight?: string;
  /** Sampling grid spacing in pixels (lower = more dots, more detail) */
  gridSpacing?: number;
  /** Minimum alpha threshold to consider a pixel "filled" (0-255) */
  alphaThreshold?: number;
}

const DEFAULT_CONFIG: Required<DotTypographyConfig> = {
  fontSize: 120,
  fontFamily: 'Inter, Arial, sans-serif',
  fontWeight: '700',
  gridSpacing: 4,
  alphaThreshold: 128,
};

/**
 * Metni nokta koordinatlarına dönüştürür.
 * (Converts text to dot coordinates)
 *
 * @param text - Dönüştürülecek metin
 * @param config - Yapılandırma seçenekleri
 * @returns TextLayout — nokta pozisyonları ve sınır boyutları
 */
export function textToDots(
  text: string,
  config: DotTypographyConfig = {}
): TextLayout {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Debug: yapılandırmayı logla
  if (process.env.NODE_ENV === 'development') {
    console.debug('[DotTypography] textToDots called:', { text, config: cfg });
  }

  // Offscreen canvas oluştur
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('[DotTypography] Canvas 2D context oluşturulamadı');
    return { dots: [], width: 0, height: 0 };
  }

  // Font ayarla ve metin boyutlarını ölç
  const font = `${cfg.fontWeight} ${cfg.fontSize}px ${cfg.fontFamily}`;
  ctx.font = font;
  const metrics = ctx.measureText(text);

  // Canvas boyutlarını ayarla (padding ekle)
  const padding = cfg.fontSize * 0.3;
  const canvasWidth = Math.ceil(metrics.width + padding * 2);
  const canvasHeight = Math.ceil(cfg.fontSize * 1.4 + padding * 2);

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Font'u yeniden ayarla (canvas boyut değişikliği context'i sıfırlar)
  ctx.font = font;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'top';

  // Metni render et
  ctx.fillText(text, padding, padding);

  // Piksel verisini oku
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const pixels = imageData.data;

  // Grid aralığında örnekle
  const dots: Array<{ x: number; y: number }> = [];

  for (let y = 0; y < canvasHeight; y += cfg.gridSpacing) {
    for (let x = 0; x < canvasWidth; x += cfg.gridSpacing) {
      const index = (y * canvasWidth + x) * 4;
      const alpha = pixels[index + 3]; // Alpha kanalı

      if (alpha >= cfg.alphaThreshold) {
        // Koordinatları merkezle (0,0 metin merkezinde olsun)
        dots.push({
          x: x - canvasWidth / 2,
          y: y - canvasHeight / 2,
        });
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.debug(`[DotTypography] "${text}" → ${dots.length} dots generated`);
  }

  return {
    dots,
    width: canvasWidth,
    height: canvasHeight,
  };
}

/**
 * Birden fazla metin parçasını yan yana nokta koordinatlarına dönüştürür.
 * (Converts multiple text segments side by side)
 */
export function multiTextToDots(
  segments: string[],
  config: DotTypographyConfig = {},
  gap: number = 20
): TextLayout {
  const allDots: Array<{ x: number; y: number }> = [];
  let totalWidth = 0;
  let maxHeight = 0;

  const layouts = segments.map((seg) => textToDots(seg, config));

  // Toplam genişlik hesapla
  layouts.forEach((layout, i) => {
    totalWidth += layout.width;
    if (i < layouts.length - 1) totalWidth += gap;
    maxHeight = Math.max(maxHeight, layout.height);
  });

  // Her segmenti uygun pozisyona yerleştir
  let offsetX = -totalWidth / 2;

  layouts.forEach((layout, i) => {
    const centerX = offsetX + layout.width / 2;

    layout.dots.forEach((dot) => {
      allDots.push({
        x: dot.x + centerX,
        y: dot.y,
      });
    });

    offsetX += layout.width;
    if (i < layouts.length - 1) offsetX += gap;
  });

  return {
    dots: allDots,
    width: totalWidth,
    height: maxHeight,
  };
}
