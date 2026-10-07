import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Truck,
  Award,
  Target,
  Eye,
  Users,
  Linkedin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { getSiteSettings } from '../services/settings.service';
import { getAboutConfig, defaultAboutConfig } from '../services/about.service';
import { SiteSettings, AboutConfig, CoreValue, LeadershipMember } from '../types';

export const About: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [aboutConfig, setAboutConfig] = useState<AboutConfig>(defaultAboutConfig);

  useEffect(() => {
    Promise.all([getSiteSettings(), getAboutConfig()]).then(([st, abt]) => {
      setSettings(st);
      setAboutConfig(abt);
    });
  }, []);

  const companyName = settings?.companyName || 'Infinite Hardware Technology (P) Ltd.';
  const summary =
    settings?.footerDescription ||
    'Manufacturers and suppliers of structural bridge bearings, expansion joints, industrial couplings, and heavy engineering hardware adhering to strict international engineering tolerances.';

  // Map icon names to components for Core Values
  const getValueIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-5 h-5 text-industrial-orange" />;
      case 'Users':
        return <Users className="w-5 h-5 text-industrial-orange" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-industrial-orange" />;
      case 'Target':
        return <Target className="w-5 h-5 text-industrial-orange" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-industrial-orange" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-industrial-orange" />;
    }
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-industrial-dark">About Us</span>
        </div>

        {/* Header */}
        <div className="border-b border-industrial-border pb-8 mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-dark tracking-tight mb-3">
            About {companyName}
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Company Story & Facility Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-industrial-orange">
              Manufacturing Heritage & Integrity
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-industrial-dark tracking-tight">
              {aboutConfig.storyHeading}
            </h2>
            <p className="text-sm text-industrial-muted leading-relaxed whitespace-pre-line">
              {aboutConfig.storyBody}
            </p>
            {aboutConfig.highlights && aboutConfig.highlights.length > 0 && (
              <div className="space-y-2.5 text-xs font-semibold text-industrial-dark pt-3">
                {aboutConfig.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-industrial-orange mr-2.5 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-6">
            <div className="relative rounded-lg overflow-hidden border border-industrial-border shadow-elevated group">
              <img
                src={aboutConfig.storyImage || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'}
                alt={`${companyName} Engineering Facility`}
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-industrial-dark/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-industrial-orange px-2 py-0.5 rounded">
                  Certified Facility
                </span>
                <p className="text-xs font-semibold mt-1">High-Precision Manufacturing & Load-Testing Plant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-[11px] font-bold uppercase tracking-wider text-industrial-orange mb-1">
              Purpose & Strategic Direction
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-industrial-dark tracking-tight">
              Mission & Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-industrial-slate text-white rounded-lg p-8 relative overflow-hidden border border-industrial-steel shadow-elevated flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-industrial-orange/10 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="w-12 h-12 rounded-lg bg-industrial-orange/20 border border-industrial-orange/30 flex items-center justify-center mb-6 text-industrial-orange">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white mb-3">
                  {aboutConfig.missionTitle || 'Our Mission'}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {aboutConfig.missionStatement}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-industrial-steel/50 flex items-center text-xs font-bold text-industrial-orange uppercase tracking-wider">
                <span>Infrastructure Reliability</span>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-industrial-dark text-white rounded-lg p-8 relative overflow-hidden border border-industrial-steel shadow-elevated flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center mb-6 text-white">
                  <Eye className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white mb-3">
                  {aboutConfig.visionTitle || 'Our Vision'}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {aboutConfig.visionStatement}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-industrial-steel/50 flex items-center text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <span>Nation Building & Innovation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        {aboutConfig.values && aboutConfig.values.length > 0 && (
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="text-[11px] font-bold uppercase tracking-wider text-industrial-orange mb-1">
                Guiding Principles
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-industrial-dark tracking-tight">
                {aboutConfig.valuesHeading || 'Our Core Values'}
              </h2>
              {aboutConfig.valuesDescription && (
                <p className="text-xs text-industrial-muted mt-2">
                  {aboutConfig.valuesDescription}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {aboutConfig.values.map((val) => (
                <div
                  key={val.id}
                  className="bg-white p-6 rounded-lg border border-industrial-border shadow-subtle hover:border-industrial-orange transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center mb-4 group-hover:bg-industrial-orange/10 transition-colors">
                      {getValueIcon(val.icon)}
                    </div>
                    <h3 className="text-sm font-bold text-industrial-dark mb-2">
                      {val.title}
                    </h3>
                    <p className="text-xs text-industrial-muted leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leadership Section */}
        {aboutConfig.leadershipMembers && aboutConfig.leadershipMembers.length > 0 && (
          <div className="mb-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="text-[11px] font-bold uppercase tracking-wider text-industrial-orange mb-1">
                Engineering Governance
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-industrial-dark tracking-tight">
                {aboutConfig.leadershipHeading || 'Executive Leadership'}
              </h2>
              {aboutConfig.leadershipDescription && (
                <p className="text-xs text-industrial-muted mt-2">
                  {aboutConfig.leadershipDescription}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {aboutConfig.leadershipMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg border border-industrial-border shadow-subtle overflow-hidden flex flex-col hover:border-industrial-orange transition-all"
                >
                  {/* Photo or Avatar */}
                  <div className="h-56 bg-industrial-slate/10 relative overflow-hidden flex items-center justify-center">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-industrial-muted">
                        <Users className="w-14 h-14 text-industrial-steel mb-1" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Executive Profile</span>
                      </div>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-industrial-dark rounded-full shadow-sm hover:text-industrial-orange transition-colors"
                        title={`${member.name} on LinkedIn`}
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-industrial-dark">
                        {member.name}
                      </h3>
                      <div className="text-xs font-semibold text-industrial-orange mt-0.5 mb-3">
                        {member.role}
                      </div>
                      {member.bio && (
                        <p className="text-xs text-industrial-muted leading-relaxed">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-industrial-light rounded-lg border border-industrial-border p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-industrial-dark">
              Partner with Our Engineering Desk
            </h3>
            <p className="text-xs text-industrial-muted mt-1 max-w-xl">
              From tender drawings and custom load tolerances to mill test certification and dispatch, our engineering team is ready to support your infrastructure projects.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-5 py-2.5 bg-industrial-orange hover:bg-industrial-orange-hover text-white text-xs font-bold rounded flex items-center space-x-1.5 transition-colors uppercase tracking-wider shrink-0 shadow-sm"
          >
            <span>Request Project Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

