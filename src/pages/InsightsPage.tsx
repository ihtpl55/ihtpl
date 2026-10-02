import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, Calendar, User } from 'lucide-react';
import { getPosts } from '../services/posts.service';
import { BlogPost } from '../types';

export const InsightsPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-industrial-dark">Technical Insights</span>
        </div>

        <div className="border-b border-industrial-border pb-8 mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-dark tracking-tight mb-3">
            Technical Insights & Fastener Engineering Articles
          </h1>
          <p className="text-sm text-industrial-muted max-w-3xl leading-relaxed">
            Technical guides covering ISO bolt property classes, chemical anchor resin selection, hydrogen embrittlement prevention, and torque wrench calibration standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} to={`/insights/${post.slug}`} className="group bg-white rounded-lg border border-industrial-border overflow-hidden hover:border-industrial-orange transition-all flex flex-col justify-between">
              <div>
                <div className="h-48 overflow-hidden">
                  <img src={post.heroImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <div className="text-xs font-bold text-industrial-orange uppercase tracking-wider mb-2">
                    {post.category} • {post.publishDate}
                  </div>
                  <h2 className="text-lg font-bold text-industrial-dark group-hover:text-industrial-orange transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-xs text-industrial-muted line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 text-xs font-bold text-industrial-orange inline-flex items-center">
                Read Article <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
