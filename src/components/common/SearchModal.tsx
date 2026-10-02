import React, { useState, useEffect } from 'react';
import { Search, X, Package, FileText, Briefcase, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../services/products.service';
import { getDocuments } from '../../services/documents.service';
import { getProjects } from '../../services/projects.service';
import { Product, DocumentItem, Project } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([getProducts(), getDocuments(), getProjects()]).then(([prods, docs, projs]) => {
        setProducts(prods);
        setDocuments(docs);
        setProjects(projs);
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const filteredProducts = q ? products.filter(p => p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)).slice(0, 4) : [];
  const filteredDocuments = q ? documents.filter(d => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)).slice(0, 3) : [];
  const filteredProjects = q ? projects.filter(p => p.title.toLowerCase().includes(q) || p.industry.toLowerCase().includes(q)).slice(0, 3) : [];

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-elevated border border-industrial-border overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-industrial-border bg-industrial-light">
          <Search className="w-5 h-5 text-industrial-muted mr-3" />
          <input
            type="text"
            placeholder="Search products, documents, or projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-industrial-dark font-medium placeholder-industrial-muted focus:outline-none text-base"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-industrial-muted hover:text-industrial-dark transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!q && (
            <div className="text-center py-8 text-industrial-muted text-sm">
              Type to search across industrial products, technical datasheets, and case studies...
            </div>
          )}

          {loading && (
            <div className="text-center py-8 text-industrial-muted text-sm animate-pulse">
              Loading catalog indices...
            </div>
          )}

          {q && filteredProducts.length === 0 && filteredDocuments.length === 0 && filteredProjects.length === 0 && !loading && (
            <div className="text-center py-8 text-industrial-muted text-sm">
              No matching records found for "<span className="text-industrial-dark font-semibold">{query}</span>".
            </div>
          )}

          {/* Products Section */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-bold text-industrial-muted tracking-wider uppercase mb-2">
                <Package className="w-4 h-4 mr-1.5 text-industrial-orange" />
                Products ({filteredProducts.length})
              </div>
              <div className="space-y-2">
                {filteredProducts.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => handleSelect(`/products/${prod.slug}`)}
                    className="w-full text-left p-2.5 rounded-md hover:bg-industrial-light flex items-center transition-colors group"
                  >
                    <img src={prod.featuredImage} alt={prod.name} className="w-10 h-10 object-cover rounded border border-industrial-border mr-3" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/111315/ffffff?text=Product'; }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-industrial-dark truncate group-hover:text-industrial-orange transition-colors">
                        {prod.name}
                      </div>
                      <div className="text-xs text-industrial-muted">{prod.categoryName}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-industrial-muted opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Technical Documents */}
          {filteredDocuments.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-bold text-industrial-muted tracking-wider uppercase mb-2">
                <FileText className="w-4 h-4 mr-1.5 text-industrial-navy" />
                Technical Documents ({filteredDocuments.length})
              </div>
              <div className="space-y-2">
                {filteredDocuments.map((docItem) => (
                  <button
                    key={docItem.id}
                    onClick={() => handleSelect('/resources/documents')}
                    className="w-full text-left p-2.5 rounded-md hover:bg-industrial-light flex items-center transition-colors group"
                  >
                    <div className="w-9 h-9 rounded bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs mr-3">
                      PDF
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-industrial-dark truncate group-hover:text-industrial-orange transition-colors">
                        {docItem.title}
                      </div>
                      <div className="text-xs text-industrial-muted">{docItem.category} • {docItem.size}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-bold text-industrial-muted tracking-wider uppercase mb-2">
                <Briefcase className="w-4 h-4 mr-1.5 text-industrial-orange" />
                Projects ({filteredProjects.length})
              </div>
              <div className="space-y-2">
                {filteredProjects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => handleSelect(`/projects/${proj.slug}`)}
                    className="w-full text-left p-2.5 rounded-md hover:bg-industrial-light flex items-center transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-industrial-dark truncate group-hover:text-industrial-orange transition-colors">
                        {proj.title}
                      </div>
                      <div className="text-xs text-industrial-muted">{proj.industry} • {proj.location}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-industrial-muted opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Footer */}
        {q && (
          <div className="px-4 py-2.5 bg-industrial-light border-t border-industrial-border text-right">
            <button
              onClick={() => handleSelect(`/products?q=${encodeURIComponent(query)}`)}
              className="text-xs font-semibold text-industrial-orange hover:underline inline-flex items-center"
            >
              View all results for "{query}" <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
