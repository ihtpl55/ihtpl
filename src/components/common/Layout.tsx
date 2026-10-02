import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SearchModal } from './SearchModal';
import { getSiteSettings } from '../../services/settings.service';
import { configStatus, USE_DEMO_DATA } from '../../lib/firebase';
import { SiteSettings } from '../../types';
import { initialSiteSettings } from '../../data/seedData';
import { AlertTriangle } from 'lucide-react';

export const Layout: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch((err) => {
      console.warn('Using default site settings:', err);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-industrial-dark font-sans selection:bg-industrial-orange selection:text-white">
      {/* Firebase Environment Error Banner (Shown ONLY when VITE_USE_DEMO_DATA=false and Firebase config is invalid) */}
      {!USE_DEMO_DATA && !configStatus.isConfigured && (
        <div className="bg-red-600 text-white px-4 py-3 text-xs font-bold text-center flex items-center justify-center space-x-2 z-50">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>FIREBASE CONFIGURATION ERROR: {configStatus.error}</span>
        </div>
      )}

      {/* Header */}
      <Navbar settings={settings} onOpenSearch={() => setSearchOpen(true)} />

      {/* Search Overlay */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet context={{ settings }} />
      </main>

      {/* Footer */}
      <Footer settings={settings} />
    </div>
  );
};
