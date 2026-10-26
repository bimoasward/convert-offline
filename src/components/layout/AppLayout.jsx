import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      {/* Main Body Area: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />

        {/* Scrollable Content Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-10 bg-radial from-slate-900/40 via-slate-950 to-slate-950">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sticky/Bottom Footer */}
      <Footer />
    </div>
  );
}
