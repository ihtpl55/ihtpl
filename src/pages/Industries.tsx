import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Building2 } from 'lucide-react';
import { getIndustries } from '../services/industries.service';
import { Industry } from '../types';

export const Industries: React.FC = () => {
  const [industries, setIndustries] = useState<Industry[]>([]);

  useEffect(() => {
    getIndustries().then(setIndustries);
  }, []);

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-industrial-dark">Industries Served</span>
        </div>

        <div className="border-b border-industrial-border pb-8 mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-dark tracking-tight mb-3">
            Industries & Sectors We Supply
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            Apex Industrial Hardware provides tailored supply chain solutions, batch test certification, and bulk procurement support for critical infrastructure, manufacturing, and transit projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind) => (
            <div key={ind.id} className="bg-white rounded-lg border border-industrial-border overflow-hidden hover:shadow-industrial transition-all flex flex-col justify-between">
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img src={ind.image} alt={ind.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-industrial-dark mb-2">{ind.title}</h2>
                  <p className="text-xs text-industrial-muted leading-relaxed">{ind.shortDescription}</p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-industrial-border">
                <Link
                  to={`/products?q=${encodeURIComponent(ind.title)}`}
                  className="inline-flex items-center text-xs font-bold text-industrial-orange hover:underline pt-4"
                >
                  Browse Relevant SKUs <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
