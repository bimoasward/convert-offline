import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileVideo, AlertCircle, Sparkles } from 'lucide-react';

export default function FileDropzone({
  onFileSelect,
  accept = {
    'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.m4v']
  },
  maxSize = 1024 * 1024 * 500, // 500MB
  disabled = false,
  icon: Icon = FileVideo,
  dragText = 'Lepaskan file video di sini...',
  idleText = 'Pilih atau Tarik File Video ke Sini',
  formatsLabel = 'MP4, MOV, MKV, WebM, AVI',
  maxSizeLabel = '500MB',
}) {
  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
      if (fileRejections && fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const errorMsg = rejection.errors.map(e => e.message).join(', ');
        alert(`File ditolak: ${errorMsg}`);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 ${
        isDragActive && !isDragReject
          ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01] shadow-xl shadow-indigo-500/10'
          : isDragReject
          ? 'border-red-500 bg-red-500/10'
          : 'border-slate-700/80 bg-slate-900/50 hover:border-indigo-500/60 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-indigo-500/5'
      } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
    >
      <input {...getInputProps()} />

      {/* Ambient background glow on hover */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500" />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
        {/* Animated Icon */}
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 ${
            isDragActive
              ? 'bg-indigo-600 text-white scale-110 rotate-3 shadow-lg shadow-indigo-500/30'
              : 'bg-slate-800/80 text-indigo-400 group-hover:bg-indigo-600/20 group-hover:text-indigo-300 group-hover:scale-105'
          }`}
        >
          {isDragReject ? (
            <AlertCircle className="h-10 w-10 text-red-400" />
          ) : isDragActive ? (
            <UploadCloud className="h-10 w-10 animate-bounce" />
          ) : (
            <Icon className="h-10 w-10" />
          )}
        </div>

        {/* Text Instructions */}
        <div className="space-y-1.5 max-w-md">
          <p className="text-base sm:text-lg font-semibold text-slate-100">
            {isDragActive
              ? dragText
              : idleText}
          </p>
          <p className="text-sm text-slate-400">
            Mendukung format <span className="text-slate-300 font-medium">{formatsLabel}</span> (hingga {maxSizeLabel}).
          </p>
        </div>

        {/* Action Button Indicator */}
        <div className="pt-2">
          <span className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/25 group-hover:bg-indigo-500 transition-all">
            <UploadCloud className="h-4 w-4" />
            <span>Pilih File dari Komputer</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-slate-500 pt-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Diproses instan & aman langsung di memori browser Anda</span>
        </div>
      </div>
    </div>
  );
}
