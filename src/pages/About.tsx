import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, CheckCircle2, Building2, Truck, Award } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-industrial-dark">About Us</span>
        </div>

        <div className="border-b border-industrial-border pb-8 mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-dark tracking-tight mb-3">
            About Apex Industrial Hardware & Supplies
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            Established in 2004, Apex Industrial Hardware is a leading B2B distributor of high-tensile fasteners, structural anchors, power tools, cutting systems, and safety equipment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl font-bold text-industrial-dark">Engineering Integrity & Supply Chain Reliability</h2>
            <p className="text-sm text-industrial-muted leading-relaxed">
              We operate as a trusted procurement partner for tier-1 contractors, metro rail developers, power plant operators, and manufacturing facilities across India. Every batch of fasteners and structural fixing resin is backed by full lot traceability and mill test certification.
            </p>
            <div className="space-y-2 text-xs font-semibold text-industrial-dark pt-2">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-industrial-orange mr-2" /> ISO 9001:2015 Quality Management System Certified</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-industrial-orange mr-2" /> 45,000 Sq.Ft Covered Barcode Central Distribution Facility</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-industrial-orange mr-2" /> 5,000+ Active Industrial SKUs Maintained in Ready Stock</div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" alt="Apex Warehouse" className="rounded-lg border border-industrial-border shadow-elevated" />
          </div>
        </div>

      </div>
    </div>
  );
};
