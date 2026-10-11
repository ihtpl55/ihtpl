import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Image as ImageIcon, X } from 'lucide-react';
import { getGalleryItems, getGalleryCategories } from '../services/gallery.service';
import { GalleryItem, GalleryCategory } from '../types';
import { optimizeImageUrl } from '../lib/imageOptimizer';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [galleryCategories, setGalleryCategories] = useState<string[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    Promise.all([getGalleryItems(), getGalleryCategories()]).then(([itemList, catList]) => {
      setItems(itemList);
      setGalleryCategories(catList);
    });
  }, []);

  const categories = ['All', ...galleryCategories];
  const filtered = selectedCat === 'All' ? items : items.filter(i => i.category === selectedCat);

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-industrial-dark">Media Gallery</span>
        </div>

        <div className="border-b border-industrial-border pb-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-dark tracking-tight mb-3">
            Manufacturing, Products & Field Operations Gallery
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            Visual inspection of our manufacturing plants, precision bridge bearings, expansion joints, proof load testing, and site installations across India.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded text-xs font-bold transition-colors ${selectedCat === cat ? 'bg-industrial-dark text-white' : 'bg-industrial-light text-industrial-dark border border-industrial-border hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group bg-white rounded-lg border border-industrial-border overflow-hidden hover:border-industrial-orange transition-all hover:shadow-industrial flex flex-col justify-between cursor-pointer"
            >
              {/* Uncropped Image Display with subtle ambient backdrop */}
              <div className="relative h-60 sm:h-64 bg-neutral-900 flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={optimizeImageUrl(item.image, 80, 20)}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
                />
                <img
                  src={optimizeImageUrl(item.image, 600, 75)}
                  alt={item.title}
                  className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute top-3 left-3 z-20 text-[10px] font-bold uppercase tracking-wider text-industrial-orange bg-black/75 px-2 py-0.5 rounded shadow">
                  {item.category}
                </span>
              </div>

              <div className="p-4 bg-white border-t border-industrial-border flex-1 flex flex-col justify-between">
                <h3 className="text-sm font-bold text-industrial-dark group-hover:text-industrial-orange transition-colors line-clamp-1">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-industrial-muted line-clamp-2 mt-1 leading-relaxed">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal: 100% Uncropped View */}
        {activeItem && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
            onClick={() => setActiveItem(null)}
          >
            <div
              className="bg-neutral-900 max-w-5xl w-full max-h-[92vh] rounded-lg overflow-hidden border border-gray-800 relative flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-gray-800 text-white bg-neutral-900/95 z-10">
                <div className="min-w-0 pr-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-industrial-orange bg-black/60 px-2 py-0.5 rounded">
                    {activeItem.category}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white mt-1 truncate">{activeItem.title}</h2>
                </div>
                <button
                  onClick={() => setActiveItem(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 min-h-[280px] max-h-[70vh] flex items-center justify-center p-2 sm:p-4 bg-black/95">
                <img
                  src={optimizeImageUrl(activeItem.image, 1400, 80)}
                  alt={activeItem.title}
                  decoding="async"
                  className="max-h-[66vh] max-w-full w-auto h-auto object-contain rounded"
                />
              </div>

              {activeItem.caption && (
                <div className="p-4 bg-neutral-900 border-t border-gray-800 text-xs text-gray-300 leading-relaxed">
                  {activeItem.caption}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
