import React, { useState } from 'react';
import { ZoomIn, Sparkles, CheckCircle, Sliders, Wand2 } from 'lucide-react';
import ImageToolShell from './ImageToolShell';
import { useImageUpscaler, UPSCALE_FACTORS } from '../../hooks/useImageUpscaler';

const FEATURES = [
  { icon: Wand2, color: 'bg-indigo-500/10 text-indigo-400', title: 'AI Super Resolution', text: 'Model ESRGAN merekonstruksi detail sehingga gambar pecah/blur menjadi lebih tajam.' },
  { icon: CheckCircle, color: 'bg-emerald-500/10 text-emerald-400', title: '100% Client Side', text: 'Gambar diproses di browser Anda dan tidak pernah diunggah ke server.' },
  { icon: Sparkles, color: 'bg-purple-500/10 text-purple-400', title: 'Download Multi-Format', text: 'Simpan hasilnya sebagai PNG, JPG, atau WebP.' },
];

export default function ImageUpscaler() {
  const [scale, setScale] = useState(2);
  const { progress, statusMessage, isLoadingModel, upscaleImage } = useImageUpscaler();

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
            onClick={() => setScale(f)}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
              scale === f
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
      actionLabel={`Tingkatkan Resolusi ${scale}x`}
      actionIcon={ZoomIn}
      process={(file) => upscaleImage(file, scale)}
      progress={progress}
      statusMessage={statusMessage}
      isLoadingModel={isLoadingModel}
      suffix={`upscaled-${scale}x`}
    />
  );
}
