import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Image as ImageIcon, X } from 'lucide-react';
import { getGalleryItems } from '../services/gallery.service';
import { GalleryItem, GalleryCategory } from '../types';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    getGalleryItems().then(setItems);
  }, []);

  const categories = ['All', 'Warehouse', 'Products', 'Projects', 'Facilities', 'Deliveries'];
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
            Warehouse, Products & Field Operations Gallery
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            Visual inspection of our central distribution warehouse, inventory stocking, site pull-out testing, and freight dispatches.
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

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative h-64 rounded-lg overflow-hidden border border-industrial-border cursor-pointer shadow-subtle hover:border-industrial-orange transition-all"
            >
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-industrial-dark via-industrial-dark/40 to-transparent"></div>
              <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                <span className="text-[10px] font-bold uppercase text-industrial-orange bg-black/60 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-3xl w-full rounded-lg overflow-hidden border border-industrial-border relative">
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/60 text-white rounded-full hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={activeItem.image} alt={activeItem.title} className="w-full h-96 object-cover" />
              <div className="p-6">
                <span className="text-xs font-bold text-industrial-orange uppercase">{activeItem.category}</span>
                <h2 className="text-xl font-bold text-industrial-dark mt-1">{activeItem.title}</h2>
                {activeItem.caption && <p className="text-xs text-industrial-muted mt-2">{activeItem.caption}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
