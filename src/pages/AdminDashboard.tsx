import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Package,
  Briefcase,
  FileText,
  Mail,
} from 'lucide-react';
import { getProducts } from '../services/products.service';
import { getProjects } from '../services/projects.service';
import { getDocuments } from '../services/documents.service';
import { getEnquiries, updateEnquiryStatus } from '../services/enquiries.service';
import { Product, Project, DocumentItem, Enquiry, EnquiryStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.get('tab') === 'enquiries' ? 'enquiries' : 'dashboard';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      getProducts(false),
      getProjects(false),
      getDocuments(false),
      getEnquiries(),
    ])
      .then(([prods, projs, docs, enqs]) => {
        setProducts(prods);
        setProjects(projs);
        setDocuments(docs);
        setEnquiries(enqs);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard data', err);
        setLoading(false);
      });
  };

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    await updateEnquiryStatus(id, status);
    loadData();
  };

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-industrial-dark tracking-tight">
          {activeTab === 'enquiries' ? 'Customer Enquiries' : 'Dashboard Overview'}
        </h1>
        <p className="text-xs text-industrial-muted mt-1">
          {activeTab === 'enquiries'
            ? 'Manage and follow up on customer quote requests'
            : 'Real-time overview of your website content and customer interest'}
        </p>
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-subtle">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-industrial-muted">Products & Items</div>
                <Package className="w-5 h-5 text-industrial-orange" />
              </div>
              <div className="text-3xl font-black text-industrial-dark mt-2">{products.length}</div>
              <div className="text-[10px] text-industrial-muted mt-1">
                {products.filter((p) => p.published).length} visible on site
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-subtle">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-industrial-muted">Case Studies / Projects</div>
                <Briefcase className="w-5 h-5 text-industrial-orange" />
              </div>
              <div className="text-3xl font-black text-industrial-dark mt-2">{projects.length}</div>
              <div className="text-[10px] text-industrial-muted mt-1">
                {projects.filter((p) => p.published).length} visible on site
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-subtle">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-industrial-muted">Documents Library</div>
                <FileText className="w-5 h-5 text-industrial-orange" />
              </div>
              <div className="text-3xl font-black text-industrial-dark mt-2">{documents.length}</div>
              <div className="text-[10px] text-industrial-muted mt-1">
                {documents.filter((d) => d.published).length} technical PDFs
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-subtle">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-industrial-muted">Enquiries Received</div>
                <Mail className="w-5 h-5 text-industrial-orange" />
              </div>
              <div className="text-3xl font-black text-industrial-dark mt-2">{enquiries.length}</div>
              {newEnquiriesCount > 0 ? (
                <div className="text-[10px] text-red-600 font-bold mt-1">
                  {newEnquiriesCount} new requests need response
                </div>
              ) : (
                <div className="text-[10px] text-emerald-600 font-bold mt-1">
                  All enquiries addressed
                </div>
              )}
            </div>
          </div>

          {/* Quick Enquiries Panel */}
          <div className="bg-white rounded-lg border border-industrial-border shadow-subtle p-6 mt-6">
            <div className="flex items-center justify-between border-b border-industrial-border pb-4 mb-4">
              <h2 className="text-base font-bold text-industrial-dark flex items-center">
                <Mail className="w-4 h-4 mr-2 text-industrial-orange" /> Latest Customer Requests
              </h2>
            </div>
            <EnquiriesTable enquiries={enquiries.slice(0, 5)} onStatusChange={handleStatusChange} />
          </div>
        </>
      )}

      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-lg border border-industrial-border shadow-subtle p-6">
          <EnquiriesTable enquiries={enquiries} onStatusChange={handleStatusChange} />
        </div>
      )}
    </div>
  );
};

interface EnquiriesTableProps {
  enquiries: Enquiry[];
  onStatusChange: (id: string, status: EnquiryStatus) => void;
}

const EnquiriesTable: React.FC<EnquiriesTableProps> = ({ enquiries, onStatusChange }) => {
  if (enquiries.length === 0) {
    return <div className="text-center py-10 text-xs text-industrial-muted font-medium">No sales enquiries received yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-industrial-light text-industrial-dark uppercase font-bold text-[10px] tracking-wider border-b border-industrial-border">
          <tr>
            <th className="p-3">Customer Contact</th>
            <th className="p-3">Company Details</th>
            <th className="p-3">Requested Item</th>
            <th className="p-3">Message</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Update Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-industrial-border">
          {enquiries.map((enq) => (
            <tr key={enq.id} className="hover:bg-gray-50/50">
              <td className="p-3 font-semibold text-industrial-dark">
                <div>{enq.name}</div>
                <div className="text-[10px] text-industrial-muted mt-0.5">{enq.phone}</div>
                <div className="text-[10px] text-industrial-muted">{enq.email}</div>
              </td>
              <td className="p-3 font-medium text-industrial-dark">
                {enq.company || <span className="text-gray-400">Not Specified</span>}
              </td>
              <td className="p-3">
                {enq.productName ? (
                  <span className="font-bold text-industrial-orange">{enq.productName}</span>
                ) : (
                  <span className="text-industrial-dark font-medium">{enq.subject}</span>
                )}
              </td>
              <td className="p-3 text-industrial-muted max-w-xs truncate" title={enq.message}>
                {enq.message}
              </td>
              <td className="p-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    enq.status === 'New'
                      ? 'bg-red-100 text-red-800'
                      : enq.status === 'Contacted'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {enq.status}
                </span>
              </td>
              <td className="p-3 text-right space-x-1 whitespace-nowrap">
                {enq.status !== 'Contacted' && (
                  <button
                    onClick={() => onStatusChange(enq.id!, 'Contacted')}
                    className="px-2 py-1 bg-amber-600 text-white rounded text-[10px] font-bold hover:bg-amber-700 transition-colors"
                  >
                    Mark Contacted
                  </button>
                )}
                {enq.status !== 'Closed' && (
                  <button
                    onClick={() => onStatusChange(enq.id!, 'Closed')}
                    className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Close
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
