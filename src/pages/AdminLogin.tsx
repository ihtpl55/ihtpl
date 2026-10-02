import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Key } from 'lucide-react';
import { loginAdmin, loginWithGoogle } from '../services/auth.service';
import { USE_DEMO_DATA } from '../lib/firebase';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await loginAdmin(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Authentication failed');
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    const res = await loginWithGoogle();
    setGoogleLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Google authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-industrial-dark flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-elevated border border-industrial-border overflow-hidden">
        {/* Header */}
        <div className="bg-industrial-slate p-6 text-white text-center border-b border-industrial-steel">
          <Link to="/" title="Return to Website Home" className="inline-block">
            <img
              src="/logo.jpg"
              alt="Infinite Hardware Logo"
              className="w-14 h-14 object-contain rounded-md bg-black p-1 mx-auto mb-3 border border-industrial-steel hover:border-industrial-orange transition-colors"
            />
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight">Infinite Hardware CMS</h1>
          <p className="text-xs text-gray-300 mt-1">Authorized Administrator Authentication</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {USE_DEMO_DATA && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded text-xs leading-relaxed">
              <span className="font-bold">Demo Mode Active:</span>
              <div className="mt-1">You can click "Sign in with Google" or use demo credentials:</div>
              <div className="mt-1 font-mono text-[11px]">Email: admin@apexindustrial.in</div>
              <div className="font-mono text-[11px]">Password: admin123</div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded transition-all shadow-sm flex items-center justify-center space-x-3 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? 'Signing in with Google...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] uppercase font-bold text-gray-400 absolute">or sign in with email</span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-industrial-dark uppercase tracking-wider mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@infinitehardware.in"
                className="w-full px-3 py-2 bg-white border border-industrial-border rounded text-xs text-industrial-dark focus:outline-none focus:border-industrial-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-industrial-dark uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-white border border-industrial-border rounded text-xs text-industrial-dark focus:outline-none focus:border-industrial-orange"
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 bg-industrial-orange hover:bg-industrial-orange-hover text-white font-bold text-xs rounded transition-colors shadow flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In with Email'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
