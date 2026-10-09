import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  Mail,
  Search,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { SiteSettings } from '../../types';

interface NavbarProps {
  settings: SiteSettings;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const nav = settings.navVisibility || {};
  const showProducts = nav.products !== false;
  const showIndustries = nav.industries !== false;
  const showCapabilities = nav.capabilities !== false;
  const showProjects = nav.projects !== false;
  const showDocuments = nav.documents !== false;
  const showGallery = nav.gallery !== false;
  const showInsights = nav.insights !== false;
  const showAbout = nav.about !== false;
  const showContact = nav.contact !== false;

  return (
    <header className="w-full z-40 sticky top-0 transition-all duration-300">
      {/* Top Bar */}
      <div className="bg-industrial-dark text-white text-xs py-2 px-4 border-b border-industrial-slate hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center text-gray-300 hover:text-industrial-orange transition-colors">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-industrial-orange" />
              <span>{settings.phone}</span>
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center text-gray-300 hover:text-industrial-orange transition-colors">
              <Mail className="w-3.5 h-3.5 mr-1.5 text-industrial-orange" />
              <span>{settings.email}</span>
            </a>
            <div className="text-gray-400 border-l border-industrial-slate pl-4">
              <span>{settings.businessHours}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-xs font-semibold text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-industrial-orange" />
              Strengthen Engineering for Nation
            </span>
            {showDocuments && (
              <Link to="/resources/documents" className="text-gray-300 hover:text-white transition-colors">
                Document Center
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`transition-all duration-200 ${isScrolled ? 'glass-header shadow-subtle py-3 border-b border-industrial-border' : 'bg-white py-3 border-b border-industrial-border'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/logo.jpg"
              alt="Infinite Hardware Technology (P) Ltd."
              className="h-11 w-auto object-contain rounded border border-industrial-border bg-black p-0.5"
            />
            <div>
              <div className="text-base font-black text-industrial-dark tracking-tight leading-none group-hover:text-industrial-orange transition-colors">
                INFINITE HARDWARE
              </div>
              <div className="text-[9px] font-bold uppercase text-industrial-muted tracking-wider leading-tight mt-0.5">
                Technology (P) Ltd.
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2.5 xl:space-x-4 2xl:space-x-5 text-xs xl:text-sm font-semibold">
            <Link
              to="/"
              className={`whitespace-nowrap transition-colors ${isActive('/') ? 'text-industrial-orange font-bold' : 'text-industrial-dark hover:text-industrial-orange'}`}
            >
              Home
            </Link>

            {showProducts && (
              <Link
                to="/products"
                className={`whitespace-nowrap transition-colors ${isActive('/products') ? 'text-industrial-orange font-bold' : 'text-industrial-dark hover:text-industrial-orange'}`}
              >
                Products
              </Link>
            )}

            {showIndustries && (
              <Link
                to="/industries"
                className={`whitespace-nowrap transition-colors ${isActive('/industries') ? 'text-industrial-orange font-bold' : 'text-industrial-dark hover:text-industrial-orange'}`}
              >
                Industries
              </Link>
            )}

            {showCapabilities && (
              <Link
                to="/capabilities"
                className={`whitespace-nowrap transition-colors ${isActive('/capabilities') ? 'text-industrial-orange font-bold' : 'text-industrial-dark hover:text-industrial-orange'}`}
              >
                Capabilities
              </Link>
            )}

            {showProjects && (
              <Link
                to="/projects"
                className={`whitespace-nowrap transition-colors ${isActive('/projects') ? 'text-industrial-orange font-bold' : 'text-industrial-dark hover:text-industrial-orange'}`}
              >
                Projects
              </Link>
            )}

            {showDocuments && (
              <Link
                to="/resources/documents"
                className={`whitespace-nowrap transition-colors ${isActive('/resources') || isActive('/documents') ? 'text-industrial-orange font-bold' : 'text-industrial-dark hover:text-industrial-orange'}`}
              >
                Document Center
              </Link>
            )}

            {showGallery && (
              <Link
                to="/gallery"
                className={`whitespace-nowrap transition-colors ${isActive('/gallery') ? 'text-industrial-orange font-bold' : 'text-industrial-dark hover:text-industrial-orange'}`}
              >
                Media Gallery
              </Link>
            )}

            {showInsights && (
              <Link
                to="/insights"
                className={`whitespace-nowrap transition-colors ${isActive('/insights') ? 'text-industrial-orange font-bold' : 'text-industrial-dark hover:text-industrial-orange'}`}
              >
                Insights
              </Link>
            )}

            {showAbout && (
              <Link
                to="/about"
                className={`whitespace-nowrap transition-colors ${isActive('/about') ? 'text-industrial-orange font-bold' : 'text-industrial-dark hover:text-industrial-orange'}`}
              >
                About Us
              </Link>
            )}

            {showContact && (
              <Link
                to="/contact"
                className={`whitespace-nowrap transition-colors ${isActive('/contact') ? 'text-industrial-orange font-bold' : 'text-industrial-dark hover:text-industrial-orange'}`}
              >
                Contact
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-full text-industrial-dark hover:bg-industrial-light hover:text-industrial-orange transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {showContact && (
              <Link
                to="/contact"
                className="hidden sm:inline-flex items-center px-4 py-2 rounded text-sm font-bold text-white bg-industrial-orange hover:bg-industrial-orange-hover transition-colors shadow-sm whitespace-nowrap"
              >
                Contact Sales
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-industrial-dark hover:text-industrial-orange transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-industrial-border pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <img src="/logo.jpg" alt="Infinite Hardware" className="h-8 w-auto bg-black p-0.5 rounded" />
                  <div className="font-black text-industrial-dark text-sm">INFINITE HARDWARE</div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-industrial-muted hover:text-industrial-dark">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3.5">
                <Link to="/" className="block text-base font-semibold text-industrial-dark hover:text-industrial-orange">
                  Home
                </Link>

                {showProducts && (
                  <Link to="/products" className="block text-base font-semibold text-industrial-dark hover:text-industrial-orange">
                    Products
                  </Link>
                )}

                {showIndustries && (
                  <Link to="/industries" className="block text-base font-semibold text-industrial-dark hover:text-industrial-orange">
                    Industries
                  </Link>
                )}

                {showCapabilities && (
                  <Link to="/capabilities" className="block text-base font-semibold text-industrial-dark hover:text-industrial-orange">
                    Capabilities
                  </Link>
                )}

                {showProjects && (
                  <Link to="/projects" className="block text-base font-semibold text-industrial-dark hover:text-industrial-orange">
                    Projects
                  </Link>
                )}

                {showDocuments && (
                  <Link to="/resources/documents" className="block text-base font-semibold text-industrial-dark hover:text-industrial-orange">
                    Document Center
                  </Link>
                )}

                {showGallery && (
                  <Link to="/gallery" className="block text-base font-semibold text-industrial-dark hover:text-industrial-orange">
                    Media Gallery
                  </Link>
                )}

                {showInsights && (
                  <Link to="/insights" className="block text-base font-semibold text-industrial-dark hover:text-industrial-orange">
                    Insights
                  </Link>
                )}

                {showAbout && (
                  <Link to="/about" className="block text-base font-semibold text-industrial-dark hover:text-industrial-orange">
                    About Us
                  </Link>
                )}

                {showContact && (
                  <Link to="/contact" className="block text-base font-semibold text-industrial-dark hover:text-industrial-orange">
                    Contact Us
                  </Link>
                )}
              </div>
            </div>

            {showContact && (
              <div className="pt-6 border-t border-industrial-border space-y-3">
                <Link
                  to="/contact"
                  className="w-full text-center py-3 bg-industrial-orange text-white font-bold rounded shadow-sm hover:bg-industrial-orange-hover block text-sm"
                >
                  Enquire Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
