import React from 'react';
import { Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ImageToWebpPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
          <ImageIcon className="h-3.5 w-3.5" />
          <span>Image Compression Tool</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Convert Image to WebP
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Ubah format PNG, JPEG, GIF menjadi WebP modern dengan kompresi optimal untuk web.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
          <Sparkles className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Segera Hadir di Iterasi Berikutnya</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Fitur konversi gambar ke WebP sedang dalam tahap integrasi. Silakan nikmati fitur <strong>Video to MP3</strong> yang sudah aktif sepenuhnya.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-600/20"
          >
            <span>Buka Video to MP3</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
