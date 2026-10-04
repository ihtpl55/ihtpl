import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import {
  Package,
  Briefcase,
  FileText,
  Mail,
  LogOut,
  LayoutDashboard,
  FolderTree,
  Tag,
  Image as ImageIcon,
  BookOpen,
  Settings,
  Menu,
  X,
  Building2,
  Wrench,
  Award,
} from 'lucide-react';
import { subscribeAuth, logoutAdmin } from '../../services/auth.service';
import { getEnquiries } from '../../services/enquiries.service';
import { Enquiry } from '../../types';

export const AdminLayout: React.FC = () => {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsub = subscribeAuth((user) => {
      if (!user) {
        setAuthed(false);
        navigate('/admin/login');
      } else {
        setAuthed(true);
        loadEnquiriesCount();
      }
    });
    return () => unsub();
  }, [navigate]);

  const loadEnquiriesCount = () => {
    getEnquiries()
      .then((enqs) => setEnquiries(enqs))
      .catch((err) => console.warn('Could not load enquiries count', err));
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  if (authed === null) {
    return (
      <div className="min-h-screen bg-industrial-light flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-industrial-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-semibold text-industrial-muted uppercase tracking-wider">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  if (!authed) return null;

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const currentPath = location.pathname;

  const isTabActive = (path: string, exact = false) => {
    if (exact) return currentPath === path;
    return currentPath.startsWith(path);
  };

  const navItems = [
    { label: 'Dashboard Home', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Products & Items', path: '/admin/crud/products', icon: Package },
    { label: 'Product Categories', path: '/admin/crud/categories', icon: FolderTree },
    { label: 'Industries Served', path: '/admin/crud/industries', icon: Building2 },
    { label: 'Capabilities & Services', path: '/admin/crud/capabilities', icon: Wrench },
    { label: 'Media Gallery', path: '/admin/crud/gallery', icon: ImageIcon },
    { label: 'Certifications', path: '/admin/crud/certifications', icon: Award },
    { label: 'Brands', path: '/admin/crud/brands', icon: Tag },
    { label: 'Case Studies / Projects', path: '/admin/crud/projects', icon: Briefcase },
    { label: 'Document Library', path: '/admin/crud/documents', icon: FileText },
    { label: 'Insights Blog', path: '/admin/crud/posts', icon: BookOpen },
    { label: 'Site Settings', path: '/admin/crud/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-industrial-light flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Bar */}
      <div className="bg-industrial-dark text-white px-4 py-3 flex items-center justify-between md:hidden border-b border-industrial-slate">
        <Link to="/" className="flex items-center space-x-2.5 group" title="Visit Public Website">
          <img
            src="/logo.jpg"
            alt="Infinite Hardware Logo"
            className="w-8 h-8 object-contain rounded bg-black p-0.5 border border-industrial-slate"
          />
          <span className="text-sm font-bold tracking-tight group-hover:text-industrial-orange transition-colors">Infinite Hardware</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-gray-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Persistent on desktop */}
      <aside className={`w-full md:w-64 bg-industrial-dark text-white p-6 shrink-0 flex flex-col justify-between z-30 transition-all duration-300 md:translate-x-0 ${mobileMenuOpen ? 'fixed inset-y-0 left-0 translate-x-0' : 'hidden md:flex'}`}>
        <div>
          <div className="flex items-center justify-between border-b border-industrial-slate pb-4 mb-6">
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              title="Visit Public Website"
            >
              <img
                src="/logo.jpg"
                alt="Infinite Hardware Logo"
                className="w-10 h-10 object-contain rounded bg-black p-0.5 border border-industrial-steel group-hover:border-industrial-orange transition-colors shrink-0 shadow-sm"
              />
              <div className="min-w-0">
                <div className="text-xs font-black tracking-tight text-white group-hover:text-industrial-orange transition-colors truncate">
                  Infinite Hardware
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 flex items-center gap-1 group-hover:text-gray-300">
                  <span>Visit Website</span>
                  <span className="text-[11px] leading-none">↗</span>
                </div>
              </div>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden p-1 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1 text-xs font-bold uppercase tracking-wider">
            {navItems.map((item) => {
              const active = isTabActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2.5 px-3 py-3 rounded transition-colors ${active ? 'bg-industrial-orange text-white' : 'text-gray-300 hover:bg-industrial-slate'}`}
                >
                  <item.icon className="w-4 h-4 text-industrial-orange-light shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Enquiries Button with badge */}
            <Link
              to="/admin?tab=enquiries"
              className={`flex items-center justify-between px-3 py-3 rounded transition-colors ${location.search.includes('tab=enquiries') ? 'bg-industrial-orange text-white' : 'text-gray-300 hover:bg-industrial-slate'}`}
            >
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-industrial-orange-light shrink-0" />
                <span>Customer Enquiries</span>
              </div>
              {newEnquiriesCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {newEnquiriesCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-industrial-slate mt-8">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2.5 rounded bg-red-950 text-red-300 hover:bg-red-900 text-xs font-bold flex items-center justify-center space-x-2 transition-colors uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};
