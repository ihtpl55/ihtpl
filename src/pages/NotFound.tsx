import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="w-16 h-16 bg-industrial-orange-light text-industrial-orange rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-industrial-dark">404 - Page Not Found</h1>
        <p className="text-xs text-industrial-muted leading-relaxed">
          The requested page or industrial product specification could not be located. It may have been unlisted or relocated.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2.5 bg-industrial-dark text-white font-bold text-xs rounded hover:bg-industrial-slate transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
