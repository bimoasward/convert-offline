import React, { useState } from 'react';
import { ZoomIn, Sparkles, CheckCircle, Sliders, Wand2 } from 'lucide-react';
import ImageToolShell from './ImageToolShell';
import { useImageUpscaler, UPSCALE_FACTORS } from '../../hooks/useImageUpscaler';

const FEATURES = [
  { icon: Wand2, color: 'bg-indigo-500/10 text-indigo-400', title: 'AI Super Resolution', text: 'Model ESRGAN merekonstruksi detail sehingga gambar pecah/blur menjadi lebih tajam.' },
  { icon: CheckCircle, color: 'bg-emerald-500/10 text-emerald-400', title: '100% Client Side', text: 'Gambar diproses di browser Anda dan tidak pernah diunggah ke server.' },
  { icon: Sparkles, color: 'bg-purple-500/10 text-purple-400', title: 'Download Multi-Format', text: 'Simpan hasilnya sebagai PNG, JPG, atau WebP.' },
];

const TARGET_SIZE = { width: 1232, height: 1280 };
const TARGET_KEY = 'target-1232x1280';

/**
 * Fits an upscaled result inside width x height without distortion (letterbox).
 * The image keeps its aspect ratio, is centred, and the remaining area is filled
 * with a flat white background. Output is always exactly width x height.
 */
function resizeResultToTarget(result, width, height) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(result.blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      const fit = Math.min(width / img.naturalWidth, height / img.naturalHeight);
      const drawW = Math.round(img.naturalWidth * fit);
      const drawH = Math.round(img.naturalHeight * fit);
      const offsetX = Math.round((width - drawW) / 2);
      const offsetY = Math.round((height - drawH) / 2);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) {
          reject(new Error('Gagal mengubah ukuran gambar ke target.'));
          return;
        }
        resolve({
          ...result,
          blob,
          url: URL.createObjectURL(blob),
          width,
          height,
        });
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gagal membaca hasil upscale.'));
    };
    img.src = url;
  });
}

export default function ImageUpscaler() {
  const [scale, setScale] = useState(2);
  const [useTarget, setUseTarget] = useState(false);
  const { progress, statusMessage, isLoadingModel, upscaleImage } = useImageUpscaler();

  const processImage = async (file) => {
    const out = await upscaleImage(file, scale);
    if (useTarget === true) {
      return resizeResultToTarget(out, TARGET_SIZE.width, TARGET_SIZE.height);
    }
    return out;
  };

  const options = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
        <Sliders className="h-4 w-4 text-indigo-400" />
        <span>Faktor Pembesaran:</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {UPSCALE_FACTORS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              setScale(f);
              setUseTarget(false);
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
              useTarget === false && scale === f
                ? 'border-indigo-500 bg-indigo-600/10 ring-1 ring-indigo-500'
                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
            }`}
          >
            <span className="block text-sm font-semibold text-slate-100">{f}x</span>
            <span className="block text-xs text-slate-400 mt-0.5">
              {f === 2 ? 'Tercepat' : f === 3 ? 'Seimbang' : 'Resolusi maksimal'}
            </span>
          </button>
        ))}
        <button
          key={TARGET_KEY}
          type="button"
          onClick={() => setUseTarget(true)}
          className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
            useTarget === true
              ? 'border-indigo-500 bg-indigo-600/10 ring-1 ring-indigo-500'
              : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
          }`}
        >
          <span className="block text-sm font-semibold text-slate-100">1232×1280</span>
          <span className="block text-xs text-slate-400 mt-0.5">Ukuran target</span>
        </button>
      </div>
      <p className="text-xs text-slate-500">Proses berjalan di CPU/GPU perangkat Anda; gambar besar bisa memakan waktu beberapa menit.</p>
    </div>
  );

  return (
    <ImageToolShell
      badgeIcon={ZoomIn}
      badge="AI Image Upscaler"
      title="Naikkan Resolusi Gambar"
      description="Ubah gambar pecah atau beresolusi rendah menjadi lebih tajam dengan AI, lalu unduh sebagai JPG, PNG, atau format lain."
      features={FEATURES}
      options={options}
      actionLabel={useTarget === true ? 'Tingkatkan Resolusi ke 1232×1280' : `Tingkatkan Resolusi ${scale}x`}
      actionIcon={ZoomIn}
      process={processImage}
      progress={progress}
      statusMessage={statusMessage}
      isLoadingModel={isLoadingModel}
      suffix={useTarget === true ? 'upscaled-1232x1280' : `upscaled-${scale}x`}
    />
  );
}
