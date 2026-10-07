import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SearchModal } from './SearchModal';
import {
  subscribeToSiteSettings,
  getCachedSettings,
} from '../../services/settings.service';
import { configStatus, USE_DEMO_DATA } from '../../lib/firebase';
import { NavigationVisibility, SiteSettings } from '../../types';
import { AlertTriangle } from 'lucide-react';

const isPathHidden = (pathname: string, nav: NavigationVisibility = {}) => {
  if (pathname.startsWith('/products') && nav.products === false) return true;
  if (pathname.startsWith('/industries') && nav.industries === false) return true;
  if (pathname.startsWith('/capabilities') && nav.capabilities === false) return true;
  if (pathname.startsWith('/projects') && nav.projects === false) return true;
  if (pathname.startsWith('/resources/documents') && nav.documents === false) return true;
  if (pathname.startsWith('/gallery') && nav.gallery === false) return true;
  if (pathname.startsWith('/insights') && nav.insights === false) return true;
  if (pathname.startsWith('/about') && nav.about === false) return true;
  if (pathname.startsWith('/infrastructure') && nav.about === false) return true;
  if (pathname.startsWith('/quality') && nav.about === false) return true;
  if (pathname.startsWith('/contact') && nav.contact === false) return true;
  return false;
};

export const Layout: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(getCachedSettings());
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = subscribeToSiteSettings((latest) => {
      setSettings(latest);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (isPathHidden(location.pathname, settings.navVisibility)) {
    return <Navigate to="/" replace />;
  }

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
