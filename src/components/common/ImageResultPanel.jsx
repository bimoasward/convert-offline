import React, { useState } from 'react';
import { CheckCircle, Download, Loader2, AlertTriangle } from 'lucide-react';
import { EXPORT_FORMATS, convertImage, downloadBlob, formatFileSize, baseName } from '../../utils/imageExport';

/**
 * Shows the processed image and lets the user pick an output format before downloading.
 * `result.blob` is the lossless processed image (PNG); conversion happens on download.
 */
export default function ImageResultPanel({ result, originalName, suffix, defaultFormat = 'png', transparent = false }) {
  const [format, setFormat] = useState(defaultFormat);
  const [quality, setQuality] = useState(92);
  const [background, setBackground] = useState('#ffffff');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');

  const selected = EXPORT_FORMATS.find((f) => f.value === format);
  const needsBackground = transparent && !selected.alpha;

  const update = (setter) => (value) => {
    setError('');
    setter(value);
  };

  const handleDownload = async () => {
    setIsExporting(true);
    setError('');
    try {
      const out = await convertImage(result.blob, format, { quality: quality / 100, background });
      downloadBlob(out.blob, `${baseName(originalName)}-${suffix}.${out.format.ext}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-emerald-300">Proses Selesai!</h4>
            <p className="text-xs text-slate-400">
              {result.width} × {result.height} px
              {result.originalWidth ? ` (dari ${result.originalWidth} × ${result.originalHeight} px)` : ''}
              {' • '}
              {formatFileSize(result.blob.size)} (PNG)
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-200">Download sebagai:</p>
        <div className="flex flex-wrap gap-2">
          {EXPORT_FORMATS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => update(setFormat)(f.value)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                format === f.value
                  ? 'border-indigo-500 bg-indigo-600/10 text-white ring-1 ring-indigo-500'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {selected.lossy && (
          <label className="flex items-center gap-3 text-xs text-slate-400">
            <span className="w-16">Kualitas</span>
            <input
              type="range"
              min="50"
              max="100"
              value={quality}
              onChange={(e) => update(setQuality)(Number(e.target.value))}
              className="flex-1 accent-indigo-500"
            />
            <span className="w-10 text-right font-mono text-slate-300">{quality}%</span>
          </label>
        )}

        {needsBackground && (
          <label className="flex items-center gap-3 text-xs text-slate-400">
            <span>{selected.label} tidak mendukung transparansi. Warna latar:</span>
            <input
              type="color"
              value={background}
              onChange={(e) => update(setBackground)(e.target.value)}
              className="h-7 w-10 cursor-pointer rounded border border-slate-700 bg-transparent"
            />
          </label>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-3 text-red-300 flex items-start gap-3 text-xs">
          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleDownload}
        disabled={isExporting}
        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98]"
      >
        {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        <span>Download {selected.label}</span>
      </button>
    </div>
  );
}
