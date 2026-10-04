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
            Manufacturing Infrastructure & Facilities
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            Our state-of-the-art manufacturing plants and warehousing facilities handle precision fabrication, elastomer vulcanization, mechanical proof load testing, and express freight dispatches directly to project jobsites across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-industrial-light p-6 rounded-lg border border-industrial-border">
            <Building2 className="w-8 h-8 text-industrial-orange mb-4" />
            <h2 className="text-lg font-bold text-industrial-dark mb-2">Heavy Fabrication & Machining</h2>
            <p className="text-xs text-industrial-muted">Equipped with heavy CNC machining centers, automated cutting, and precision welding equipment for structural components.</p>
          </div>

          <div className="bg-industrial-light p-6 rounded-lg border border-industrial-border">
            <ShieldCheck className="w-8 h-8 text-industrial-orange mb-4" />
            <h2 className="text-lg font-bold text-industrial-dark mb-2">Proof Load & Testing Lab</h2>
            <p className="text-xs text-industrial-muted">Equipped with calibrated hydraulic compression test rigs, shear load testing machines, elastomer rheometers, and metrology instruments.</p>
          </div>

          <div className="bg-industrial-light p-6 rounded-lg border border-industrial-border">
            <Truck className="w-8 h-8 text-industrial-orange mb-4" />
            <h2 className="text-lg font-bold text-industrial-dark mb-2">Freight & Jobsite Logistics</h2>
            <p className="text-xs text-industrial-muted">Industrial weatherproof crating, barcode batch tracking, and nationwide freight dispatch directly to major infrastructure project sites.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
