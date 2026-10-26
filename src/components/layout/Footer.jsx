import React from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 py-6 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        
        {/* Left: Copyright */}
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Universal Converter. Hak cipta dilindungi.</span>
        </div>

        {/* Center: Tech tags */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>FFmpeg WebAssembly</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Zero Data Leakage</span>
          </div>
        </div>

        {/* Right: Disclaimer & Links */}
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-300 transition-colors cursor-pointer">Kebijakan Privasi</span>
          <span className="text-slate-700">•</span>
          <span className="hover:text-slate-300 transition-colors cursor-pointer">Syarat & Ketentuan</span>
        </div>

      </div>
    </footer>
  );
}
