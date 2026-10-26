import React, { useState, useEffect } from 'react';
import { useFFmpeg } from '../../hooks/useFFmpeg';
import FileDropzone from '../common/FileDropzone';
import ProgressBar from '../common/ProgressBar';
import { 
  Music, 
  FileVideo, 
  ArrowRight, 
  Download, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Sliders, 
  FileAudio,
  Trash2,
  Sparkles,
  Info
} from 'lucide-react';

export default function VideoToMp3() {
  const [file, setFile] = useState(null);
  const [bitrate, setBitrate] = useState('192');
  const [conversionState, setConversionState] = useState('idle'); // 'idle' | 'converting' | 'completed' | 'error'
  const [convertedResult, setConvertedResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    isLoaded,
    isLoading: isEngineLoading,
    loadError,
    progress,
    statusMessage,
    loadFFmpeg,
    convertVideoToMp3,
  } = useFFmpeg();

  // Pre-load FFmpeg WebAssembly engine quietly on mount
  useEffect(() => {
    loadFFmpeg().catch((err) => {
      console.warn('Background FFmpeg preloading error:', err);
    });
  }, [loadFFmpeg]);

  // Format file size nicely
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file select
  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setConversionState('idle');
    setConvertedResult(null);
    setErrorMessage('');
  };

  // Reset all state for new conversion
  const handleReset = () => {
    if (convertedResult?.url) {
      URL.revokeObjectURL(convertedResult.url);
    }
    setFile(null);
    setConversionState('idle');
    setConvertedResult(null);
    setErrorMessage('');
  };

  // Execute conversion
  const handleStartConversion = async () => {
    if (!file) return;

    setConversionState('converting');
    setErrorMessage('');

    try {
      const result = await convertVideoToMp3(file, {
        bitrate,
      });
      setConvertedResult(result);
      setConversionState('completed');
    } catch (err) {
      console.error('Error saat konversi:', err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat mengonversi video ke MP3.');
      setConversionState('error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
          <Music className="h-3.5 w-3.5" />
          <span>Audio Extraction Tool</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Convert Video to MP3
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Ekstrak audio berkualitas tinggi dari video apa pun (MP4, MOV, MKV, WebM) langsung di browser Anda secara instan dan tanpa batasan server.
        </p>
      </div>

      {/* Engine Status Banner if loading or failed */}
      {loadError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-4 text-red-200 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <p className="font-semibold text-red-300">Gagal menginisialisasi FFmpeg WebAssembly</p>
            <p className="text-slate-400">{loadError}</p>
            <button
              onClick={() => loadFFmpeg()}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Coba muat ulang engine</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 1: File Dropzone (if no file chosen) */}
      {!file && (
        <div className="space-y-6">
          <FileDropzone onFileSelect={handleFileSelect} disabled={isEngineLoading && !isLoaded} />

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Lossless Quality</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mengekstrak audio stream murni dengan encoder MP3 LAME hingga 320kbps.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">100% Client Side</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                File video Anda tidak diunggah ke server mana pun, privasi terlindungi penuh.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Info className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Tanpa Batas Kuota</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Konversi video sebanyak dan sebesar apa pun tanpa limit antrian harian.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: File Selected & Ready / In Progress / Completed */}
      {file && (
        <div className="space-y-6">
          {/* File Card Overview */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner">
                  <FileVideo className="h-7 w-7" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white truncate max-w-md sm:max-w-lg" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {formatFileSize(file.size)}
                    </span>
                    <span>•</span>
                    <span className="uppercase text-indigo-400 font-semibold">
                      {file.name.split('.').pop() || 'VIDEO'}
                    </span>
                  </div>
                </div>
              </div>

              {conversionState !== 'converting' && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
                  title="Ganti File"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Ganti File</span>
                </button>
              )}
            </div>

            {/* Quality & Bitrate Settings (Only in idle state) */}
            {conversionState === 'idle' && (
              <div className="py-6 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <Sliders className="h-4 w-4 text-indigo-400" />
                  <span>Pilih Kualitas Audio (Bitrate MP3):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: '128', label: 'Standard (128 kbps)', desc: 'Ukuran file lebih kecil' },
                    { value: '192', label: 'High Quality (192 kbps)', desc: 'Rekomendasi terbaik' },
                    { value: '320', label: 'Ultra High (320 kbps)', desc: 'Kualitas audio maksimal' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setBitrate(option.value)}
                      className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all duration-200 ${
                        bitrate === option.value
                          ? 'border-indigo-500 bg-indigo-600/10 text-white shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-sm font-semibold text-slate-100">{option.label}</span>
                      <span className="text-xs text-slate-400 mt-0.5">{option.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Converting Progress State */}
            {conversionState === 'converting' && (
              <div className="py-6 space-y-4">
                <ProgressBar
                  progress={progress}
                  statusMessage={statusMessage}
                  isIndeterminate={isEngineLoading}
                />
                <p className="text-xs text-slate-400 text-center animate-pulse">
                  Mohon jangan menutup tab browser selagi proses konversi berlangsung...
                </p>
              </div>
            )}

            {/* Completed State */}
            {conversionState === 'completed' && convertedResult && (
              <div className="py-6 space-y-6">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-emerald-300">Konversi Berhasil!</h4>
                      <p className="text-xs text-slate-400">
                        File MP3 siap diunduh ({formatFileSize(convertedResult.size)})
                      </p>
                    </div>
                  </div>

                  {/* Audio Player Preview */}
                  <div className="pt-2">
                    <p className="text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                      <FileAudio className="h-4 w-4 text-indigo-400" />
                      <span>Putar Preview Audio:</span>
                    </p>
                    <audio
                      controls
                      src={convertedResult.url}
                      className="w-full h-10 rounded-xl bg-slate-900 border border-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {conversionState === 'error' && (
              <div className="py-6 space-y-4">
                <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-4 text-red-300 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Konversi Gagal</p>
                    <p className="text-xs text-slate-400 mt-1">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-800">
              {conversionState === 'idle' && (
                <button
                  type="button"
                  onClick={handleStartConversion}
                  disabled={isEngineLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
                >
                  <Music className="h-4 w-4" />
                  <span>Convert to MP3</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {conversionState === 'completed' && convertedResult && (
                <>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-all"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Konversi Video Lain</span>
                  </button>

                  <a
                    href={convertedResult.url}
                    download={convertedResult.filename}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98]"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download MP3</span>
                  </a>
                </>
              )}

              {conversionState === 'error' && (
                <button
                  type="button"
                  onClick={handleStartConversion}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Coba Lagi</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
