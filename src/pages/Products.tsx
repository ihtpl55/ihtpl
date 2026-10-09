import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Package, ChevronRight, X, ArrowRight, Grid, List, ChevronLeft } from 'lucide-react';
import { getProducts } from '../services/products.service';
import { getCategories } from '../services/categories.service';
import { Product, Category } from '../types';
import { ProductCardSkeleton } from '../components/common/Skeleton';

const ITEMS_PER_PAGE = 9;

const stripMarkdown = (text?: string): string => {
  if (!text) return '';
  return text
    .replace(/^[ \t]*[-*•●]\s*/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'featured';

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(
      ([prodList, catList]) => {
        setProducts(prodList);
        setCategories(catList);
        setLoading(false);
      }
    );
  }, []);

  // Reset page to 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Filtering Logic
  let filtered = products.filter((p) => {
    if (selectedCategory && p.categoryId !== selectedCategory && p.slug !== selectedCategory) {
      const catObj = categories.find(c => c.slug === selectedCategory || c.id === selectedCategory);
      if (catObj && p.categoryId !== catObj.id) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.shortDescription.toLowerCase().includes(q);
      const matchCategory = p.categoryName.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCategory) return false;
    }
    return true;
  });

  // Sorting
  if (sortBy === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } else {
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  // Pagination slicing
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-industrial-dark">Product Catalog</span>
          {selectedCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-industrial-orange font-semibold">{categories.find(c => c.slug === selectedCategory || c.id === selectedCategory)?.name || selectedCategory}</span>
            </>
          )}
        </div>

        {/* Page Header */}
        <div className="border-b border-industrial-border pb-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-dark tracking-tight mb-2">
            Industrial Hardware & Product Catalog
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl">
            Browse our comprehensive inventory of bridge bearings, expansion joints, couplings, fasteners, structural anchors, and safety equipment.
          </p>
        </div>

        {/* Top Filter & Search Bar */}
        <div className="bg-industrial-light p-4 rounded-lg border border-industrial-border mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-industrial-muted" />
            <input
              type="text"
              placeholder="Search products by name, category, or specification..."
              value={searchQuery}
              onChange={(e) => updateParam('q', e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-industrial-border rounded text-sm text-industrial-dark focus:outline-none focus:border-industrial-orange"
            />
            {searchQuery && (
              <button onClick={() => updateParam('q', '')} className="absolute right-3 top-2.5 text-industrial-muted hover:text-industrial-dark">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & View Toggle */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-industrial-muted font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="bg-white border border-industrial-border rounded px-3 py-2 text-xs font-semibold text-industrial-dark focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="name">Product Name (A-Z)</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>

            <div className="flex items-center border border-industrial-border rounded bg-white p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-industrial-dark text-white' : 'text-industrial-muted hover:text-industrial-dark'}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-industrial-dark text-white' : 'text-industrial-muted hover:text-industrial-dark'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filter Panel */}
          <aside className="space-y-6">
            <div className="bg-white p-5 rounded-lg border border-industrial-border space-y-6">
              <div className="flex items-center justify-between border-b border-industrial-border pb-3">
                <div className="font-bold text-sm text-industrial-dark flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-industrial-orange" /> Filter Catalog
                </div>
                {(selectedCategory || searchQuery) && (
                  <button onClick={clearFilters} className="text-xs text-industrial-orange font-semibold hover:underline">
                    Reset All
                  </button>
                )}
              </div>

              {/* Categories Filter */}
              <div>
                <h3 className="text-xs font-bold uppercase text-industrial-muted tracking-wider mb-3">Categories</h3>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => updateParam('category', '')}
                    className={`w-full text-left py-1.5 px-2 rounded font-medium transition-colors ${!selectedCategory ? 'bg-industrial-dark text-white font-bold' : 'text-industrial-dark hover:bg-industrial-light'}`}
                  >
                    All Product Categories ({products.length})
                  </button>
                  {categories.map((cat) => {
                    const isSel = selectedCategory === cat.slug || selectedCategory === cat.id;
                    const count = products.filter(p => p.categoryId === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => updateParam('category', cat.slug)}
                        className={`w-full text-left py-1.5 px-2 rounded flex items-center justify-between transition-colors ${isSel ? 'bg-industrial-orange text-white font-bold' : 'text-industrial-dark hover:bg-industrial-light'}`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSel ? 'bg-white/20 text-white' : 'bg-industrial-light text-industrial-muted'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between text-xs text-industrial-muted">
              <div>
                Showing <span className="font-bold text-industrial-dark">{paginatedProducts.length}</span> of <span className="font-bold text-industrial-dark">{filtered.length}</span> products
              </div>
            </div>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="bg-industrial-light rounded-lg border border-industrial-border p-12 text-center">
                <Package className="w-12 h-12 text-industrial-muted mx-auto mb-4" />
                <h3 className="text-lg font-bold text-industrial-dark mb-1">No products match your criteria</h3>
                <p className="text-xs text-industrial-muted mb-4">Try clearing filters or searching for alternative technical terms.</p>
                <button onClick={clearFilters} className="px-4 py-2 bg-industrial-orange text-white text-xs font-bold rounded hover:bg-industrial-orange-hover">
                  Reset Catalog Filters
                </button>
              </div>
            )}

            {!loading && viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-lg border border-industrial-border overflow-hidden hover:border-industrial-orange transition-all hover:shadow-industrial flex flex-col justify-between"
                  >
                    <div className="p-4 bg-gray-50 border-b border-industrial-border relative h-48 flex items-center justify-center">
                      <img
                        src={prod.featuredImage}
                        alt={prod.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/600x400/111315/ffffff?text=Product';
                        }}
                      />
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-industrial-orange uppercase tracking-wider mb-1">
                          {prod.categoryName}
                        </div>
                        <h3 className="text-sm font-bold text-industrial-dark line-clamp-2 mb-2">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-industrial-muted line-clamp-2 leading-relaxed mb-3">
                          {stripMarkdown(prod.shortDescription)}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-industrial-border flex items-center justify-between gap-2">
                        <Link
                          to={`/products/${prod.slug}`}
                          className="flex-1 text-center py-2 px-2 rounded border border-industrial-dark text-industrial-dark font-bold text-xs hover:bg-industrial-dark hover:text-white transition-colors"
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/contact?product=${encodeURIComponent(prod.name)}`}
                          className="flex-1 text-center py-2 px-2 rounded bg-industrial-orange text-white font-bold text-xs hover:bg-industrial-orange-hover transition-colors"
                        >
                          Enquire Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && viewMode === 'list' && (
              <div className="space-y-4">
                {paginatedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-lg border border-industrial-border p-4 hover:border-industrial-orange transition-all flex flex-col sm:flex-row items-center gap-6"
                  >
                    <div className="w-full sm:w-36 h-36 bg-gray-50 rounded border border-industrial-border p-2 shrink-0 flex items-center justify-center">
                      <img
                        src={prod.featuredImage}
                        alt={prod.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/600x400/111315/ffffff?text=Product';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-industrial-orange uppercase tracking-wider mb-1">
                        {prod.categoryName}
                      </div>
                      <h3 className="text-base font-bold text-industrial-dark mb-1">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-industrial-muted line-clamp-2 mb-3 leading-relaxed">
                        {stripMarkdown(prod.shortDescription)}
                      </p>

                      {((prod.specifications || []).filter(s => s && (s.key?.trim() || s.value?.trim()))).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {prod.specifications.filter(s => s && (s.key?.trim() || s.value?.trim())).slice(0, 3).map((s, i) => (
                            <span key={i} className="text-[11px] bg-industrial-light px-2 py-0.5 rounded text-industrial-dark font-medium border border-industrial-border">
                              {s.key}: <strong className="font-semibold">{s.value}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-2 w-full sm:w-36 shrink-0">
                      <Link
                        to={`/products/${prod.slug}`}
                        className="flex-1 text-center py-2 px-3 rounded border border-industrial-dark text-industrial-dark font-bold text-xs hover:bg-industrial-dark hover:text-white transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/contact?product=${encodeURIComponent(prod.name)}`}
                        className="flex-1 text-center py-2 px-3 rounded bg-industrial-orange text-white font-bold text-xs hover:bg-industrial-orange-hover transition-colors"
                      >
                        Enquire Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-6 border-t border-industrial-border">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 rounded border border-industrial-border bg-white text-industrial-dark disabled:opacity-40 hover:bg-industrial-light transition-colors"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all ${
                        currentPage === pageNumber
                          ? 'bg-industrial-orange text-white'
                          : 'bg-white text-industrial-dark border border-industrial-border hover:bg-industrial-light'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-2 rounded border border-industrial-border bg-white text-industrial-dark disabled:opacity-40 hover:bg-industrial-light transition-colors"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
};
