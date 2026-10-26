import React, { useState, useEffect, useRef } from 'react';
import FileDropzone from '../common/FileDropzone';
import ProgressBar from '../common/ProgressBar';
import ImageResultPanel from '../common/ImageResultPanel';
import { formatFileSize } from '../../utils/imageExport';
import { Image as ImageIcon, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';

const IMAGE_ACCEPT = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif', '.avif'] };

const CHECKERBOARD = {
  backgroundImage:
    'linear-gradient(45deg,#334155 25%,transparent 25%),linear-gradient(-45deg,#334155 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#334155 75%),linear-gradient(-45deg,transparent 75%,#334155 75%)',
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0,0 8px,8px -8px,-8px 0',
  backgroundColor: '#1e293b',
};

/**
 * Shared flow for single-image tools: pick file -> options -> process -> preview -> export.
 * `process(file)` must resolve to `{ blob, url, width, height, ... }`.
 */
export default function ImageToolShell({
  badgeIcon: BadgeIcon,
  badge,
  title,
  description,
  features,
  options,
  actionLabel,
  actionIcon: ActionIcon,
  process,
  progress,
  statusMessage,
  isLoadingModel,
  suffix,
  transparentResult = false,
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [state, setState] = useState('idle'); // idle | processing | completed | error
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const resultUrlRef = useRef(null);

  const revokeResult = () => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = null;
  };

  useEffect(() => revokeResult, []);
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const handleFileSelect = (selected) => {
    revokeResult();
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
    setState('idle');
    setErrorMessage('');
  };

  const handleReset = () => {
    revokeResult();
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setState('idle');
    setErrorMessage('');
  };

  const handleStart = async () => {
    revokeResult();
    setResult(null);
    setState('processing');
    setErrorMessage('');
    try {
      const out = await process(file);
      resultUrlRef.current = out.url;
      setResult(out);
      setState('completed');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses gambar.');
      setState('error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
          <BadgeIcon className="h-3.5 w-3.5" />
          <span>{badge}</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">{description}</p>
      </div>

      {!file && (
        <div className="space-y-6">
          <FileDropzone
            onFileSelect={handleFileSelect}
            accept={IMAGE_ACCEPT}
            maxSize={1024 * 1024 * 50}
            maxSizeLabel="50MB"
            icon={ImageIcon}
            dragText="Lepaskan gambar di sini..."
            idleText="Pilih atau Tarik Gambar ke Sini"
            formatsLabel="PNG, JPG, WebP, BMP, GIF, AVIF"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {features.map(({ icon: Icon, color, title: t, text }) => (
              <div key={t} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-white">{t}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {file && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="min-w-0 space-y-1">
              <h3 className="text-base sm:text-lg font-semibold text-white truncate max-w-md sm:max-w-lg" title={file.name}>
                {file.name}
              </h3>
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-300">
                {formatFileSize(file.size)}
              </span>
            </div>
            {state !== 'processing' && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
              >
                <Trash2 className="h-4 w-4" />
                <span>Ganti Gambar</span>
              </button>
            )}
          </div>

          <div className={`grid gap-4 ${result ? 'md:grid-cols-2' : ''}`}>
            <figure className="space-y-2">
              <figcaption className="text-xs font-medium text-slate-400">Asli</figcaption>
              <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 p-2">
                {previewUrl && <img src={previewUrl} alt="Gambar asli" className="max-h-96 w-auto object-contain" />}
              </div>
            </figure>
            {result && (
              <figure className="space-y-2">
                <figcaption className="text-xs font-medium text-emerald-400">Hasil</figcaption>
                <div
                  className="flex items-center justify-center overflow-hidden rounded-2xl border border-emerald-500/30 p-2"
                  style={transparentResult ? CHECKERBOARD : { backgroundColor: 'rgb(2 6 23 / 0.6)' }}
                >
                  <img src={result.url} alt="Hasil" className="max-h-96 w-auto object-contain" />
                </div>
              </figure>
            )}
          </div>

          {state === 'idle' && (
            <>
              {options}
              <div className="pt-4 flex justify-end border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleStart}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
                >
                  <ActionIcon className="h-4 w-4" />
                  <span>{actionLabel}</span>
                </button>
              </div>
            </>
          )}

          {state === 'processing' && (
            <div className="space-y-4">
              <ProgressBar progress={progress} statusMessage={statusMessage} isIndeterminate={isLoadingModel} />
              <p className="text-xs text-slate-400 text-center animate-pulse">
                Mohon jangan menutup tab browser selagi proses berlangsung...
              </p>
            </div>
          )}

          {state === 'completed' && result && (
            <>
              <ImageResultPanel
                result={result}
                originalName={file.name}
                suffix={suffix}
                transparent={transparentResult}
              />
              <div className="pt-4 flex justify-end border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Proses Gambar Lain</span>
                </button>
              </div>
            </>
          )}

          {state === 'error' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-4 text-red-300 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Proses Gagal</p>
                  <p className="text-xs text-slate-400 mt-1">{errorMessage}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleStart}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Coba Lagi</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
