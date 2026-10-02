import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Truck, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';
import { getCapabilities } from '../services/capabilities.service';
import { Capability } from '../types';

export const Capabilities: React.FC = () => {
  const [capabilities, setCapabilities] = useState<Capability[]>([]);

  useEffect(() => {
    getCapabilities().then(setCapabilities);
  }, []);

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-industrial-dark">Supply Capabilities</span>
        </div>

        <div className="border-b border-industrial-border pb-8 mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-dark tracking-tight mb-3">
            B2B Procurement & Supply Capabilities
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            From bill-of-materials fulfillment and custom forging to qualified on-site pull-out anchor testing, explore how Apex Industrial supports major project execution.
          </p>
        </div>

        <div className="space-y-8">
          {capabilities.map((cap) => (
            <div key={cap.id} className="bg-industrial-light rounded-lg border border-industrial-border p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-industrial-orange bg-white px-3 py-1 rounded border border-industrial-border">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Apex Service Capability</span>
                </div>
                <h2 className="text-2xl font-bold text-industrial-dark">{cap.title}</h2>
                <p className="text-sm text-industrial-muted leading-relaxed">{cap.fullContent || cap.shortDescription}</p>
                <div className="pt-2">
                  <Link to="/contact" className="inline-flex items-center px-4 py-2 bg-industrial-orange text-white font-bold text-xs rounded hover:bg-industrial-orange-hover">
                    Enquire About Service <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-4">
                <img src={cap.image} alt={cap.title} className="w-full h-48 object-cover rounded-lg border border-industrial-border" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
