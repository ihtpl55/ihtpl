import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, Phone, Mail, MapPin, Clock, Send, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitEnquiry } from '../services/enquiries.service';
import { getSiteSettings } from '../services/settings.service';
import { SiteSettings } from '../types';
import { initialSiteSettings } from '../data/seedData';

export const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    subject: 'B2B Sales Enquiry',
    message: '',
    productName: searchParams.get('product') || '',
    requirementType: 'Project Supply Quote',
    honeypot: '', // anti-bot field
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSiteSettings().then(setSettings);
    const prodParam = searchParams.get('product');
    if (prodParam) {
      setFormData((prev) => ({
        ...prev,
        productName: prodParam,
        subject: `Enquiry for: ${prodParam}`,
        message: `Hello Sales Team,\n\nWe would like to request an official quotation, technical datasheet, and delivery schedule for "${prodParam}".\n\nProject Quantity:\nRequired Delivery Date:\nLocation:`,
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const res = await submitEnquiry(formData);
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      setFormData({
        name: '',
        company: '',
        phone: '',
        email: '',
        subject: 'B2B Sales Enquiry',
        message: '',
        productName: '',
        requirementType: 'Project Supply Quote',
        honeypot: '',
      });
    } else {
      setError(res.error || 'Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-industrial-dark">Contact Sales & Technical Support</span>
        </div>

        <div className="border-b border-industrial-border pb-8 mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-dark tracking-tight mb-3">
            Contact Apex Industrial Hardware
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            Have a bill-of-materials requirement, technical product query, or request for mill test certificates? Reach out to our technical sales team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Info & Office Locations */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-industrial-slate text-white p-6 rounded-lg space-y-6">
              <h2 className="text-xl font-bold border-b border-industrial-steel pb-3">Corporate Headquarters & Sales</h2>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-industrial-orange mr-3 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white mb-0.5">Central Address</div>
                    <div className="text-gray-300 leading-relaxed">{settings.address}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-4 h-4 text-industrial-orange mr-3 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white mb-0.5">Sales Hotlines</div>
                    <div className="text-gray-300">{settings.phone} {settings.altPhone ? ` / ${settings.altPhone}` : ''}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-4 h-4 text-industrial-orange mr-3 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white mb-0.5">Email Support</div>
                    <div className="text-gray-300">{settings.email}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-4 h-4 text-industrial-orange mr-3 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white mb-0.5">Business Hours</div>
                    <div className="text-gray-300">{settings.businessHours}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder Card */}
            <div className="bg-industrial-light p-4 rounded-lg border border-industrial-border h-48 flex items-center justify-center text-center">
              <div>
                <MapPin className="w-8 h-8 text-industrial-orange mx-auto mb-2" />
                <div className="text-xs font-bold text-industrial-dark">MIDC Industrial Area Hub</div>
                <div className="text-[11px] text-industrial-muted mt-1">Andheri East Logistics Corridor, Mumbai</div>
              </div>
            </div>
          </div>

          {/* Right: Functional Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-lg border border-industrial-border shadow-subtle space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-industrial-dark mb-1">Send a Product / Project Enquiry</h2>
                <p className="text-xs text-industrial-muted">Fill out the form below. Your request will be routed directly to our sales engineering desk.</p>
              </div>

              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 shrink-0" />
                  <span>Thank you! Your enquiry has been submitted. Our sales desk will respond within 2 business hours.</span>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-lg text-xs font-semibold flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot hidden field */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-industrial-dark uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full px-3 py-2 bg-white border border-industrial-border rounded text-xs text-industrial-dark focus:outline-none focus:border-industrial-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-industrial-dark uppercase tracking-wider mb-1">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Apex Infrastructure Pvt Ltd"
                      className="w-full px-3 py-2 bg-white border border-industrial-border rounded text-xs text-industrial-dark focus:outline-none focus:border-industrial-orange"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-industrial-dark uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98200 12345"
                      className="w-full px-3 py-2 bg-white border border-industrial-border rounded text-xs text-industrial-dark focus:outline-none focus:border-industrial-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-industrial-dark uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rajesh@company.in"
                      className="w-full px-3 py-2 bg-white border border-industrial-border rounded text-xs text-industrial-dark focus:outline-none focus:border-industrial-orange"
                    />
                  </div>
                </div>

                {formData.productName && (
                  <div>
                    <label className="block text-xs font-bold text-industrial-orange uppercase tracking-wider mb-1">
                      Target Product
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.productName}
                      className="w-full px-3 py-2 bg-industrial-light border border-industrial-border rounded text-xs font-semibold text-industrial-dark"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Message & Technical Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specify project quantities, grade requirements, delivery timeline, or site location..."
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded text-xs text-industrial-dark focus:outline-none focus:border-industrial-orange"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-6 rounded bg-industrial-orange hover:bg-industrial-orange-hover text-white font-bold text-sm transition-colors shadow flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Enquiry...' : 'Submit Sales Enquiry'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
