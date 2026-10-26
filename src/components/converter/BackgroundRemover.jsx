import React from 'react';
import { Eraser, Sparkles, CheckCircle, Layers } from 'lucide-react';
import ImageToolShell from './ImageToolShell';
import { useBackgroundRemoval } from '../../hooks/useBackgroundRemoval';

const FEATURES = [
  { icon: Eraser, color: 'bg-indigo-500/10 text-indigo-400', title: 'Hapus Background Otomatis', text: 'Model segmentasi AI memisahkan objek utama dari latar belakang dalam sekali klik.' },
  { icon: CheckCircle, color: 'bg-emerald-500/10 text-emerald-400', title: '100% Client Side', text: 'Berjalan offline di browser. Gambar Anda tidak pernah meninggalkan perangkat.' },
  { icon: Layers, color: 'bg-purple-500/10 text-purple-400', title: 'PNG Transparan', text: 'Unduh sebagai PNG/WebP transparan, atau JPG dengan warna latar pilihan Anda.' },
];

export default function BackgroundRemover() {
  const { progress, statusMessage, isLoadingModel, removeBackground } = useBackgroundRemoval();

  return (
    <ImageToolShell
      badgeIcon={Sparkles}
      badge="AI Background Remover"
      title="Remove Background"
      description="Hapus latar belakang gambar secara otomatis dan hasilkan gambar transparan siap pakai."
      features={FEATURES}
      actionLabel="Hapus Background"
      actionIcon={Eraser}
      process={async (file) => {
        const { blob, url } = await removeBackground(file);
        const img = await createImageBitmap(blob);
        const dims = { width: img.width, height: img.height };
        img.close();
        return { blob, url, ...dims };
      }}
      progress={progress}
      statusMessage={statusMessage}
      isLoadingModel={isLoadingModel}
      suffix="no-bg"
      transparentResult
    />
  );
}
