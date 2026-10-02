import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Briefcase, MapPin, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { getProjectBySlug } from '../services/projects.service';
import { Project } from '../types';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (slug) {
      getProjectBySlug(slug).then(setProject);
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-industrial-dark mb-2">Project Case Study Not Found</h2>
        <Link to="/projects" className="text-xs font-bold text-industrial-orange underline">Return to Projects</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/projects" className="hover:text-industrial-orange">Projects</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-industrial-orange font-semibold truncate">{project.title}</span>
        </div>

        {/* Hero Header */}
        <div className="bg-industrial-dark text-white rounded-lg p-8 mb-10 overflow-hidden relative">
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-industrial-orange bg-industrial-slate px-3 py-1 rounded">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{project.industry} Case Study</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{project.title}</h1>
            <div className="flex flex-wrap gap-4 text-xs text-gray-300 pt-2">
              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 text-industrial-orange mr-1" /> {project.location}</span>
              <span className="flex items-center"><Calendar className="w-3.5 h-3.5 text-industrial-orange mr-1" /> Year: {project.year}</span>
              {project.client && <span>Client Sector: {project.client}</span>}
            </div>
          </div>
        </div>

        {/* Case Study Grid (Challenge, Solution, Outcome) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-industrial-light p-6 rounded-lg border border-industrial-border">
              <h2 className="text-lg font-bold text-industrial-dark mb-2">Project Challenge</h2>
              <p className="text-sm text-industrial-muted leading-relaxed">{project.challenge}</p>
            </div>

            <div className="bg-industrial-light p-6 rounded-lg border border-industrial-border">
              <h2 className="text-lg font-bold text-industrial-dark mb-2">Technical Solution & Hardware Supplied</h2>
              <p className="text-sm text-industrial-muted leading-relaxed">{project.solution}</p>
            </div>

            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200 text-emerald-950">
              <h2 className="text-lg font-bold mb-2 flex items-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2" /> Project Outcome & Result
              </h2>
              <p className="text-sm leading-relaxed">{project.outcome}</p>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-industrial-slate text-white p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-bold">Require Similar Project Supplies?</h3>
              <p className="text-xs text-gray-300">Our engineering team assists with bill-of-materials quotes and mill certificate submissions.</p>
              <Link to="/contact" className="w-full inline-flex items-center justify-center py-3 bg-industrial-orange text-white font-bold text-xs rounded hover:bg-industrial-orange-hover">
                Request Similar Quote <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
