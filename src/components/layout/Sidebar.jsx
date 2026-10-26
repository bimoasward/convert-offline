import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Music, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  Film, 
  Layers,
  ZoomIn,
  Eraser
} from 'lucide-react';

const conversionTools = [
  {
    category: 'Audio & Video',
    items: [
      {
        name: 'Video to MP3',
        path: '/',
        icon: Music,
        badge: 'Popular',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        active: true,
      },
      {
        name: 'Video Compressor',
        path: '/video-compressor',
        icon: Film,
        badge: 'Soon',
        badgeColor: 'bg-slate-800 text-slate-400 border-slate-700',
        active: false,
      },
    ]
  },
  {
    category: 'Images & Documents',
    items: [
      {
        name: 'Image Upscaler',
        path: '/image-upscaler',
        icon: ZoomIn,
        badge: 'New',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        active: true,
      },
      {
        name: 'Remove Background',
        path: '/remove-background',
        icon: Eraser,
        badge: 'New',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        active: true,
      },
      {
        name: 'Image to WebP',
        path: '/image-to-webp',
        icon: ImageIcon,
        badge: 'Soon',
        badgeColor: 'bg-slate-800 text-slate-400 border-slate-700',
        active: false,
      },
      {
        name: 'PDF to Word',
        path: '/pdf-to-word',
        icon: FileText,
        badge: 'Soon',
        badgeColor: 'bg-slate-800 text-slate-400 border-slate-700',
        active: false,
      },
    ]
  }
];

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const closeMobileMenu = () => {
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 flex-col justify-between border-r border-slate-800/80 bg-slate-900/90 p-5 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 flex' : '-translate-x-full lg:flex'
        }`}
      >
        <div className="flex flex-col gap-6 overflow-y-auto">
          {/* Section Header */}
          <div className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>Convert to...</span>
          </div>

          {/* Navigation Groups */}
          <div className="space-y-6">
            {conversionTools.map((group) => (
              <div key={group.category} className="space-y-1.5">
                <p className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {group.category}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                              : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div className="flex items-center gap-3">
                              <Icon
                                className={`h-4 w-4 transition-colors ${
                                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                                }`}
                              />
                              <span>{item.name}</span>
                            </div>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                                isActive 
                                  ? 'bg-indigo-400/20 text-white border-indigo-300/30' 
                                  : item.badgeColor
                              }`}
                            >
                              {item.badge}
                            </span>
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner: WASM Powered */}
        <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/40 to-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Browser-Native Engine</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ditenagai oleh WebAssembly (FFmpeg.wasm). Kecepatan tinggi dan data Anda tidak pernah meninggalkan perangkat.
          </p>
        </div>
      </aside>
    </>
  );
}
