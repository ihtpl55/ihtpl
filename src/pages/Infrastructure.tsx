import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Building2, Truck, ShieldCheck } from 'lucide-react';

export const Infrastructure: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-industrial-dark">Infrastructure & Facilities</span>
        </div>

        <div className="border-b border-industrial-border pb-8 mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-dark tracking-tight mb-3">
            Distribution Infrastructure & Warehousing
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            Our 45,000 sq.ft barcode-controlled central distribution hub handles palletized storage, digital batch tracking, and express freight dispatches directly to project jobsites across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-industrial-light p-6 rounded-lg border border-industrial-border">
            <Building2 className="w-8 h-8 text-industrial-orange mb-4" />
            <h2 className="text-lg font-bold text-industrial-dark mb-2">Central Barcode Warehouse</h2>
            <p className="text-xs text-industrial-muted">High-bay pallet racking storing over 5,000 active hardware SKUs for immediate site dispatch.</p>
          </div>

          <div className="bg-industrial-light p-6 rounded-lg border border-industrial-border">
            <ShieldCheck className="w-8 h-8 text-industrial-orange mb-4" />
            <h2 className="text-lg font-bold text-industrial-dark mb-2">Metrology & Testing Lab</h2>
            <p className="text-xs text-industrial-muted">On-site digital vernier calipers, thread pitch gauges, coating thickness meters, and hydraulic load cells.</p>
          </div>

          <div className="bg-industrial-light p-6 rounded-lg border border-industrial-border">
            <Truck className="w-8 h-8 text-industrial-orange mb-4" />
            <h2 className="text-lg font-bold text-industrial-dark mb-2">Freight & Express Logistics</h2>
            <p className="text-xs text-industrial-muted">Weatherproof crate packaging and dedicated freight fleet dispatch for time-sensitive site orders.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
