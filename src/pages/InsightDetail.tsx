import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { getPostBySlug } from '../services/posts.service';
import { BlogPost } from '../types';

export const InsightDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (slug) {
      getPostBySlug(slug).then(setPost);
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-industrial-dark mb-2">Article Not Found</h2>
        <Link to="/insights" className="text-xs font-bold text-industrial-orange underline">Return to Insights</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-xs text-industrial-muted mb-6 space-x-2">
          <Link to="/" className="hover:text-industrial-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/insights" className="hover:text-industrial-orange">Insights</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-industrial-orange font-semibold truncate">{post.title}</span>
        </div>

        <div className="mb-8">
          <span className="text-xs font-bold uppercase text-industrial-orange bg-industrial-orange-light px-2.5 py-1 rounded">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-dark tracking-tight leading-tight mt-3 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-xs text-industrial-muted">
            <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-industrial-orange" /> {post.publishDate}</span>
            {post.author && <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1 text-industrial-orange" /> Author: {post.author}</span>}
          </div>
        </div>

        <div className="h-96 rounded-lg overflow-hidden border border-industrial-border mb-10">
          <img src={post.heroImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose max-w-none text-industrial-dark text-sm leading-relaxed space-y-4 mb-12">
          {post.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={idx} className="text-xl font-bold text-industrial-dark pt-4 pb-1 border-b border-industrial-border">{paragraph.replace('## ', '')}</h2>;
            }
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>

        <div className="p-6 bg-industrial-slate text-white rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Have a Technical Fastener Question?</h3>
            <p className="text-xs text-gray-300">Consult our sales engineering team for load calculations and certified MTC supplies.</p>
          </div>
          <Link to="/contact" className="px-5 py-2.5 bg-industrial-orange text-white text-xs font-bold rounded hover:bg-industrial-orange-hover shrink-0">
            Contact Engineering Team
          </Link>
        </div>
      </div>
    </div>
  );
};
