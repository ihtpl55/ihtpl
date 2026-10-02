import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export const Quality: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-industrial-dark">Quality Commitment</span>
        </div>

        <div className="border-b border-industrial-border pb-8 mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-dark tracking-tight mb-3">
            Quality Control & Compliance Standards
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            Apex Industrial Hardware operates under an ISO 9001:2015 certified quality management system. Every order includes material mill test certificates (MTC) conforming to EN 10204 3.1 standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-industrial-slate text-white p-8 rounded-lg space-y-4">
            <ShieldCheck className="w-10 h-10 text-industrial-orange" />
            <h2 className="text-xl font-bold">Traceability & Batch Testing</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Fastener batches undergo chemical spectro-analysis, tensile proof load testing, and zinc coating thickness verification to prevent premature fatigue failure in critical infrastructure.
            </p>
          </div>

          <div className="bg-industrial-light p-8 rounded-lg border border-industrial-border space-y-4">
            <FileText className="w-10 h-10 text-industrial-dark" />
            <h2 className="text-xl font-bold text-industrial-dark">Mill Test Certificates (MTC)</h2>
            <p className="text-xs text-industrial-muted leading-relaxed">
              We supply EN 10204 3.1 mill certificates detailing heat numbers, mechanical property test results, and surface treatment plating standards for structural engineer verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
