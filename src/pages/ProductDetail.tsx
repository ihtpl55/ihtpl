import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, FileText, Download, ShieldCheck, ArrowRight, Package, Mail } from 'lucide-react';
import { getProductBySlug, getProducts } from '../services/products.service';
import { Product } from '../types';
import { ProductDetailSkeleton } from '../components/common/Skeleton';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getProductBySlug(slug).then((prod) => {
        setProduct(prod);
        if (prod) {
          setActiveImage(prod.featuredImage);
          getProducts().then((all) => {
            const rel = all.filter(p => p.categoryId === prod.categoryId && p.id !== prod.id).slice(0, 3);
            setRelated(rel);
          });
        }
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-industrial-dark mb-2">Product Not Found</h2>
        <p className="text-sm text-industrial-muted mb-4">The requested product SKU may have been updated or unlisted.</p>
        <Link to="/products" className="px-4 py-2 bg-industrial-orange text-white text-xs font-bold rounded">
          Return to Product Catalog
        </Link>
      </div>
    );
  }

  const allImages = [product.featuredImage, ...(product.galleryImages || [])].filter(Boolean);

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-industrial-muted mb-8 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-industrial-orange">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-industrial-orange font-semibold truncate">{product.name}</span>
        </div>

        {/* Top Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-gray-50 border border-industrial-border rounded-lg p-6 h-96 flex items-center justify-center relative">
              <img src={activeImage} alt={product.name} className="max-h-full max-w-full object-contain" />
              {product.brandName && (
                <span className="absolute top-4 left-4 bg-industrial-dark text-white text-xs font-bold px-3 py-1 rounded uppercase">
                  {product.brandName}
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded border bg-gray-50 p-1 shrink-0 ${activeImage === img ? 'border-industrial-orange border-2' : 'border-industrial-border hover:border-industrial-dark'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Summary & Quote Action */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-industrial-orange mb-2">
                {product.categoryName}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-industrial-dark tracking-tight leading-tight mb-3">
                {product.name}
              </h1>
              <p className="text-sm text-industrial-muted leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Quick Specs Snippet */}
            {product.specifications.length > 0 && (
              <div className="bg-industrial-light p-4 rounded-lg border border-industrial-border space-y-2">
                <div className="text-xs font-bold uppercase text-industrial-dark tracking-wider mb-2">Key Specifications</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {product.specifications.slice(0, 4).map((s, idx) => (
                    <div key={idx} className="bg-white p-2 rounded border border-industrial-border">
                      <div className="text-[10px] text-industrial-muted font-medium">{s.key}</div>
                      <div className="font-bold text-industrial-dark truncate">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enquire CTA Box */}
            <div className="p-5 bg-industrial-slate text-white rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-industrial-orange font-bold uppercase">B2B Direct Supply</div>
                  <div className="text-sm font-bold">Request Official Quotation & MTC</div>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-xs text-gray-300">
                Need staggered dispatches, custom dimensions, or mill test certificate verification for project compliance?
              </p>
              <div className="pt-2">
                <Link
                  to={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="w-full inline-flex items-center justify-center py-3 px-6 rounded bg-industrial-orange hover:bg-industrial-orange-hover text-white font-bold text-sm transition-colors shadow"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enquire About This Product
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Tabs / Content Sections */}
        <div className="border-t border-industrial-border pt-12 space-y-12">
          
          {/* Full Description */}
          <div>
            <h2 className="text-xl font-bold text-industrial-dark mb-4">Product Overview</h2>
            <div className="prose max-w-none text-sm text-industrial-dark leading-relaxed">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Complete Specification Table */}
          {product.specifications.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-industrial-dark mb-4">Technical Specifications Table</h2>
              <div className="overflow-x-auto border border-industrial-border rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-industrial-dark text-white uppercase font-bold text-[11px]">
                    <tr>
                      <th className="py-3 px-4 w-1/3">Parameter</th>
                      <th className="py-3 px-4">Specification Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-industrial-border">
                    {product.specifications.map((spec, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-industrial-light'}>
                        <td className="py-3 px-4 font-bold text-industrial-dark">{spec.key}</td>
                        <td className="py-3 px-4 text-industrial-muted">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Downloadable PDF Documents */}
          {product.documents.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-industrial-dark mb-4">Technical Downloads & Manuals</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-industrial-light rounded-lg border border-industrial-border hover:border-industrial-orange flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center shrink-0">
                        PDF
                      </div>
                      <div>
                        <div className="text-xs font-bold text-industrial-dark group-hover:text-industrial-orange transition-colors">
                          {doc.title}
                        </div>
                        <div className="text-[11px] text-industrial-muted">{doc.type} {doc.size ? `• ${doc.size}` : ''}</div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-industrial-muted group-hover:text-industrial-orange transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {related.length > 0 && (
            <div className="pt-8 border-t border-industrial-border">
              <h2 className="text-xl font-bold text-industrial-dark mb-6">Related Products in Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/products/${rel.slug}`}
                    className="p-4 bg-white rounded-lg border border-industrial-border hover:border-industrial-orange transition-colors flex items-center space-x-4"
                  >
                    <img src={rel.featuredImage} alt={rel.name} className="w-16 h-16 object-contain bg-gray-50 p-1 rounded border border-industrial-border shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-industrial-dark truncate">{rel.name}</div>
                      <div className="text-[11px] text-industrial-muted truncate">{rel.categoryName}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
