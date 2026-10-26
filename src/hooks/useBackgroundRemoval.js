import { useCallback, useState } from 'react';

export function useBackgroundRemoval() {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoadingModel, setIsLoadingModel] = useState(false);

  const removeBackground = useCallback(async (file) => {
    setProgress(0);
    setIsLoadingModel(true);
    setStatusMessage('Memuat model AI...');

    const { removeBackground: run } = await import('@imgly/background-removal');

    // Model + ONNX runtime are served from /public/models/imgly (offline).
    const blob = await run(file, {
      publicPath: new URL(`${import.meta.env.BASE_URL}models/imgly/`, window.location.origin).href,
      model: 'isnet_fp16',
      output: { format: 'image/png' },
      progress: (key, current, total) => {
        const pct = total ? Math.round((current / total) * 100) : 0;
        if (key.startsWith('fetch')) {
          setStatusMessage('Memuat model AI...');
        } else {
          setIsLoadingModel(false);
          setStatusMessage('Menghapus background...');
        }
        setProgress(pct);
      },
    });

    setIsLoadingModel(false);
    setProgress(100);
    return { blob, url: URL.createObjectURL(blob) };
  }, []);

  return { progress, statusMessage, isLoadingModel, removeBackground };
}
