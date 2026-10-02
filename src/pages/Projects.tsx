import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Briefcase } from 'lucide-react';
import { getProjects } from '../services/projects.service';
import { Project } from '../types';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const industriesList = ['All', ...Array.from(new Set(projects.map(p => p.industry)))];
  const filtered = selectedIndustry === 'All' ? projects : projects.filter(p => p.industry === selectedIndustry);

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-industrial-dark">Project Case Studies</span>
        </div>

        <div className="border-b border-industrial-border pb-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-dark tracking-tight mb-3">
            Completed Projects & Field Proof
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            Discover how Apex Industrial Hardware fulfilled bill-of-materials and technical fastener requirements across transit rail, power plants, solar developments, and automotive assembly lines.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {industriesList.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-4 py-2 rounded text-xs font-bold transition-colors ${selectedIndustry === ind ? 'bg-industrial-dark text-white' : 'bg-industrial-light text-industrial-dark border border-industrial-border hover:bg-gray-200'}`}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((proj) => (
            <div key={proj.id} className="bg-white rounded-lg border border-industrial-border overflow-hidden hover:shadow-industrial transition-all flex flex-col justify-between">
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img src={proj.heroImage} alt={proj.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-industrial-dark text-white text-[11px] font-bold px-2.5 py-1 rounded">
                    {proj.year}
                  </span>
                </div>
                <div className="p-6">
                  <div className="text-xs font-bold text-industrial-orange uppercase tracking-wider mb-1">
                    {proj.industry} • {proj.location}
                  </div>
                  <h2 className="text-lg font-bold text-industrial-dark mb-3 line-clamp-2">
                    {proj.title}
                  </h2>
                  <p className="text-xs text-industrial-muted leading-relaxed line-clamp-3 mb-4">
                    {proj.shortResult}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to={`/projects/${proj.slug}`}
                  className="w-full inline-flex items-center justify-center py-2.5 border border-industrial-border rounded bg-industrial-light text-xs font-bold text-industrial-dark hover:bg-industrial-dark hover:text-white transition-colors"
                >
                  Read Full Case Study <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
