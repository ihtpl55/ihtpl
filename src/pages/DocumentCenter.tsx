import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText, Download, Search, Filter } from 'lucide-react';
import { getDocuments } from '../services/documents.service';
import { getCertifications } from '../services/certifications.service';
import { DocumentItem, Certification } from '../types';

export const DocumentCenter: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    Promise.all([getDocuments(), getCertifications()]).then(([docs, certs]) => {
      setDocuments(docs);
      setCertifications(certs);
    });
  }, []);

  const categories = ['All', 'Certifications', 'Catalogues', 'Technical Documents', 'Approvals', 'Company Documents'];

  const filteredDocs = documents.filter((doc) => {
    if (selectedCat !== 'All' && doc.category !== selectedCat) return false;
    if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-industrial-dark">Document Center</span>
        </div>

        <div className="border-b border-industrial-border pb-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-dark tracking-tight mb-3">
            Document & Technical Approval Center
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            Access ISO quality management certificates, master product catalogues, vendor approvals, and fastener specification sheets.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-industrial-light p-4 rounded-lg border border-industrial-border mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${selectedCat === cat ? 'bg-industrial-dark text-white' : 'bg-white text-industrial-dark border border-industrial-border hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-industrial-muted" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-industrial-border rounded text-xs text-industrial-dark focus:outline-none"
            />
          </div>
        </div>

        {/* Document List Rows */}
        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="p-4 bg-white rounded-lg border border-industrial-border hover:border-industrial-orange transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {doc.fileType || 'PDF'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-industrial-dark">{doc.title}</h3>
                  <div className="text-[11px] text-industrial-muted">Category: {doc.category} {doc.size ? `• Size: ${doc.size}` : ''} {doc.issueDate ? `• Date: ${doc.issueDate}` : ''}</div>
                </div>
              </div>

              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-industrial-dark hover:bg-industrial-slate text-white text-xs font-bold rounded inline-flex items-center transition-colors"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> Download Document
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
