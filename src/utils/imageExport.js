export const EXPORT_FORMATS = [
  { value: 'png', label: 'PNG', mime: 'image/png', ext: 'png', lossy: false, alpha: true },
  { value: 'jpg', label: 'JPG', mime: 'image/jpeg', ext: 'jpg', lossy: true, alpha: false },
  { value: 'webp', label: 'WebP', mime: 'image/webp', ext: 'webp', lossy: true, alpha: true },
];

export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Gagal membaca gambar. File mungkin rusak atau formatnya tidak didukung.'));
    img.src = src;
  });
}

/**
 * Re-encode a source image (Blob or URL) into the requested format.
 * Formats without alpha (JPG, BMP) get a flat background colour instead of black.
 */
export async function convertImage(source, formatValue, { quality = 0.92, background = '#ffffff' } = {}) {
  const format = EXPORT_FORMATS.find((f) => f.value === formatValue) || EXPORT_FORMATS[0];
  const objectUrl = source instanceof Blob ? URL.createObjectURL(source) : null;

  try {
    const img = await loadImage(objectUrl || source);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');

    if (!format.alpha) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, format.mime, format.lossy ? quality : undefined)
    );

    // Browsers silently fall back to PNG when they can't encode a type (e.g. WebP on older Safari).
    if (!blob || blob.type !== format.mime) {
      throw new Error(`Browser ini tidak mendukung ekspor ${format.label}. Pilih format lain.`);
    }

    return { blob, format, width: canvas.width, height: canvas.height };
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function baseName(filename) {
  return filename.replace(/\.[^.]+$/, '');
}
