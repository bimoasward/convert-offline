import { useCallback, useRef, useState } from 'react';

const MAX_OUTPUT_PIXELS = 64_000_000; // keeps canvas + tensors within what browsers can allocate

export const UPSCALE_FACTORS = [2, 3, 4];

const MODEL_LOADERS = {
  2: () => import('@upscalerjs/esrgan-slim/2x'),
  3: () => import('@upscalerjs/esrgan-slim/3x'),
  4: () => import('@upscalerjs/esrgan-slim/4x'),
};

export function useImageUpscaler() {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const upscalers = useRef({});

  const getUpscaler = useCallback(async (scale) => {
    if (upscalers.current[scale]) return upscalers.current[scale];

    setIsLoadingModel(true);
    setStatusMessage('Memuat model AI...');
    try {
      const [{ default: Upscaler }, { default: model }] = await Promise.all([
        import('upscaler'),
        MODEL_LOADERS[scale](),
        import('@tensorflow/tfjs'),
      ]);
      // Weights are served from /public so the tool keeps working offline.
      const upscaler = new Upscaler({
        model: { ...model, path: `${import.meta.env.BASE_URL}models/esrgan-slim/x${scale}/model.json` },
      });
      upscalers.current[scale] = upscaler;
      return upscaler;
    } finally {
      setIsLoadingModel(false);
    }
  }, []);

  const upscaleImage = useCallback(
    async (file, scale) => {
      setProgress(0);
      const url = URL.createObjectURL(file);
      try {
        const img = await new Promise((resolve, reject) => {
          const i = new Image();
          i.onload = () => resolve(i);
          i.onerror = () => reject(new Error('Gagal membaca gambar.'));
          i.src = url;
        });

        if (img.naturalWidth * img.naturalHeight * scale * scale > MAX_OUTPUT_PIXELS) {
          throw new Error(
            `Gambar terlalu besar untuk diperbesar ${scale}x (hasil > ${MAX_OUTPUT_PIXELS / 1e6} megapiksel). Gunakan faktor lebih kecil atau gambar yang lebih kecil.`
          );
        }

        const upscaler = await getUpscaler(scale);
        setStatusMessage('Meningkatkan resolusi gambar...');

        const dataUrl = await upscaler.upscale(img, {
          patchSize: 64,
          padding: 4,
          awaitNextFrame: true,
          progress: (p) => setProgress(Math.round(p * 100)),
        });

        setProgress(100);
        const blob = await (await fetch(dataUrl)).blob();
        return {
          blob,
          url: URL.createObjectURL(blob),
          width: img.naturalWidth * scale,
          height: img.naturalHeight * scale,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
        };
      } finally {
        URL.revokeObjectURL(url);
      }
    },
    [getUpscaler]
  );

  return { progress, statusMessage, isLoadingModel, upscaleImage };
}
