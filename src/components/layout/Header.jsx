import React from 'react';
import { Menu, X, Zap, Shield, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  Universal Converter
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                  v1.0 WASM
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Client-side WebAssembly Tools</p>
            </div>
          </Link>
        </div>

        {/* Center/Right: Privacy Badge & Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <Shield className="h-3.5 w-3.5" />
            <span>100% Private (No Uploads to Server)</span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <Code2 className="h-4 w-4" />
              <span className="hidden sm:inline">Source</span>
            </a>
          </nav>
        </div>

      </div>
    </header>
  );
}
