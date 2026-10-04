import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, CheckCircle2, Building2, Truck, Award } from 'lucide-react';
import { getSiteSettings } from '../services/settings.service';
import { SiteSettings } from '../types';

export const About: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const companyName = settings?.companyName || 'Infinite Hardware Technology (P) Ltd.';
  const summary = settings?.footerDescription || 'Manufacturers and suppliers of structural bridge bearings, expansion joints, industrial couplings, and heavy engineering hardware adhering to strict international engineering tolerances.';

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
            About {companyName}
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            {summary}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl font-bold text-industrial-dark">Engineering Integrity & Supply Chain Reliability</h2>
            <p className="text-sm text-industrial-muted leading-relaxed">
              We operate as a trusted engineering and manufacturing partner for tier-1 infrastructure contractors, metro rail developers, highway projects, power plants, and industrial facilities across India. Every product is backed by rigorous quality control, material traceability, and mill test certification.
            </p>
            <div className="space-y-2 text-xs font-semibold text-industrial-dark pt-2">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-industrial-orange mr-2" /> ISO 9001:2015 Quality Management System Certified</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-industrial-orange mr-2" /> Fully Equipped State-of-the-Art Manufacturing & Testing Facility</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-industrial-orange mr-2" /> Full Mill Test Certificates (MTC) & Third-Party Inspection Reports</div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" alt="Infinite Hardware Engineering Facility" className="rounded-lg border border-industrial-border shadow-elevated" />
          </div>
        </div>

      </div>
    </div>
  );
};
