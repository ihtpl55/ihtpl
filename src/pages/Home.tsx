import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ChevronRight,
  FileText,
  Award,
} from 'lucide-react';
import { getHomepageConfig } from '../services/homepage.service';
import { getCategories } from '../services/categories.service';
import { getProducts } from '../services/products.service';
import { getIndustries } from '../services/industries.service';
import { getCapabilities } from '../services/capabilities.service';
import { getProjects } from '../services/projects.service';
import { getPosts } from '../services/posts.service';
import { getSiteSettings } from '../services/settings.service';
import {
  HomepageConfig,
  Category,
  Product,
  Industry,
  Capability,
  Project,
  BlogPost,
  SiteSettings,
} from '../types';
const defaultHomepageConfig: HomepageConfig = {
  heroEyebrow: 'ENGINEERED HEAVY INFRASTRUCTURE',
  heroHeading: 'Precision Bridge Bearings & Expansion Joints',
  heroDescription: 'Infinite Hardware Technology (P) Ltd. manufactures and delivers heavy-duty bridge bearings, expansion joints, structural couplings, and infrastructure solutions built for mission-critical reliability.',
  heroImage: '/logo.jpg',
  primaryCtaText: 'Explore Product Catalog',
  primaryCtaLink: '/products',
  secondaryCtaText: 'Request Technical Quote',
  secondaryCtaLink: '/contact',
  trustMetrics: [
    { value: '25+', label: 'Years Experience' },
    { value: '500+', label: 'Infrastructure Projects' },
    { value: '100%', label: 'Field Quality Tested' },
    { value: '24/7', label: 'Technical Field Support' },
  ],
  companyHeading: 'Engineering Strength for Nation Building',
  companyBody: 'Specialized manufacturers of structural bridge bearings, expansion joints, and industrial coupling mechanisms adhering to strict international engineering tolerances.',
  companyImage: '/logo.jpg',
  finalCtaHeading: 'Ready to Engineer Your Next Infrastructure Project?',
  finalCtaDescription: 'Connect with our structural engineering team for technical specifications and project quotes.',
  finalCtaButtonText: 'Request Project Quote',
  finalCtaButtonLink: '/contact',
};

export const Home: React.FC = () => {
  const [config, setConfig] = useState<HomepageConfig>(defaultHomepageConfig);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getHomepageConfig(),
      getCategories(),
      getProducts(),
      getIndustries(),
      getCapabilities(),
      getProjects(),
      getPosts(),
      getSiteSettings(),
    ])
      .then(([cfg, cats, prods, inds, caps, projs, pstList, siteSet]) => {
        setConfig(cfg);
        setCategories(cats.slice(0, 8));
        setFeaturedProducts(prods.filter((p) => p.featured).slice(0, 6));
        setIndustries(inds.slice(0, 6));
        setCapabilities(caps.slice(0, 4));
        setProjects(projs.slice(0, 3));
        setPosts(pstList.slice(0, 3));
        setSettings(siteSet);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Using default data:', err);
        setLoading(false);
      });
  }, []);

  const nav = settings?.navVisibility || {};
  const showProducts = nav.products !== false;
  const showIndustries = nav.industries !== false;
  const showCapabilities = nav.capabilities !== false;
  const showProjects = nav.projects !== false;
  const showAbout = nav.about !== false;
  const showContact = nav.contact !== false;

  return (
    <div className="bg-white text-industrial-dark font-sans">
      {/* Hero */}
      <section className="relative bg-industrial-dark text-white overflow-hidden border-b border-industrial-slate">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={config.heroImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-industrial-dark via-industrial-dark/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-industrial-slate border border-industrial-steel text-industrial-orange text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6">
              <ShieldCheck className="w-4 h-4 text-industrial-orange" />
              <span>{config.heroEyebrow}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-4 sm:mb-6">
              {config.heroHeading}
            </h1>

            <p className="text-base sm:text-xl text-gray-300 font-normal leading-relaxed mb-6 sm:mb-8 max-w-2xl">
              {config.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to={showProducts ? config.primaryCtaLink : showContact ? '/contact' : showAbout ? '/about' : '/'}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded text-base font-bold text-white bg-industrial-orange hover:bg-industrial-orange-hover transition-all shadow-md min-h-[44px]"
              >
                <span>{showProducts ? config.primaryCtaText : showContact ? 'Contact Sales Desk' : 'Explore About Us'}</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              {showContact && config.secondaryCtaLink === '/contact' && (
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded text-base font-bold text-white bg-industrial-slate hover:bg-industrial-steel border border-industrial-steel transition-all min-h-[44px]"
                >
                  <span>{config.secondaryCtaText}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      {showProducts && categories.length > 0 && (
        <section className="py-12 sm:py-20 bg-industrial-light border-b border-industrial-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-industrial-orange mb-1">
                  OUR PRODUCTS
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-industrial-dark tracking-tight">
                  Product Categories
                </h2>
              </div>
              <Link
                to="/products"
                className="mt-3 sm:mt-0 text-sm font-bold text-industrial-orange hover:text-industrial-orange-hover inline-flex items-center"
              >
                <span>View All Categories</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="group bg-white rounded-lg border border-industrial-border overflow-hidden hover:border-industrial-orange transition-all hover:shadow-industrial flex flex-col justify-between"
                >
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-gray-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {cat.productCount && (
                      <span className="absolute top-3 right-3 bg-industrial-dark/90 text-white text-[11px] font-bold px-2.5 py-1 rounded">
                        {cat.productCount}+ Items
                      </span>
                    )}
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-industrial-dark group-hover:text-industrial-orange transition-colors mb-1.5">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-industrial-muted leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-industrial-border flex items-center text-xs font-bold text-industrial-dark group-hover:text-industrial-orange transition-colors">
                      <span>Explore Category</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Company Section */}
      {showAbout && (
        <section className="py-12 sm:py-20 bg-white border-b border-industrial-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-4 sm:space-y-6">
                <div className="text-xs font-bold uppercase tracking-wider text-industrial-orange">
                  COMPANY OVERVIEW
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-industrial-dark tracking-tight leading-tight">
                  {config.companyHeading}
                </h2>
                <p className="text-sm sm:text-base text-industrial-muted leading-relaxed">
                  {config.companyBody}
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-industrial-orange mr-3 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-industrial-dark">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-industrial-orange mr-3 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-industrial-dark">
                      Sed do eiusmod tempor incididunt ut labore et dolore.
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-industrial-orange mr-3 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-industrial-dark">
                      Ut enim ad minim veniam, quis nostrud exercitation.
                    </span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-4">
                  <Link
                    to="/about"
                    className="inline-flex items-center px-5 py-3 rounded text-sm font-bold text-white bg-industrial-dark hover:bg-industrial-slate transition-colors min-h-[44px]"
                  >
                    <span>About Us</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative rounded-lg overflow-hidden border border-industrial-border shadow-subtle">
                  <img
                    src={config.companyImage}
                    alt="Company Facility"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Capabilities */}
      {showCapabilities && capabilities.length > 0 && (
        <section className="py-12 sm:py-20 bg-industrial-light border-b border-industrial-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left sm:text-center max-w-2xl sm:mx-auto mb-8 sm:mb-12">
              <div className="text-xs font-bold uppercase tracking-wider text-industrial-orange mb-1">
                SERVICES
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-industrial-dark tracking-tight">
                Our Capabilities
              </h2>
              <p className="text-xs sm:text-sm text-industrial-muted mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {capabilities.map((cap) => (
                <div
                  key={cap.id}
                  className="bg-white p-5 sm:p-6 rounded-lg border border-industrial-border flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded bg-industrial-orange-light text-industrial-orange flex items-center justify-center font-bold mb-3">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-industrial-dark mb-1">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-industrial-muted leading-relaxed">
                      {cap.shortDescription}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-industrial-border">
                    <Link
                      to="/capabilities"
                      className="text-xs font-bold text-industrial-orange hover:underline inline-flex items-center"
                    >
                      View Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Industries */}
      {showIndustries && industries.length > 0 && (
        <section className="py-12 sm:py-20 bg-white border-b border-industrial-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-industrial-orange mb-1">
                  SECTORS
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-industrial-dark tracking-tight">
                  Industries Served
                </h2>
              </div>
              <Link
                to="/industries"
                className="mt-3 sm:mt-0 text-sm font-bold text-industrial-orange hover:underline inline-flex items-center"
              >
                All Industries <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {industries.map((ind) => (
                <div
                  key={ind.id}
                  className="group relative rounded-lg overflow-hidden border border-industrial-border h-56 sm:h-64 flex items-end"
                >
                  <img
                    src={ind.image}
                    alt={ind.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-industrial-dark via-industrial-dark/60 to-transparent" />
                  <div className="relative z-10 p-5 text-white">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-industrial-orange transition-colors">
                      {ind.title}
                    </h3>
                    <p className="text-xs text-gray-300 line-clamp-2">
                      {ind.shortDescription}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {showProducts && featuredProducts.length > 0 && (
        <section className="py-12 sm:py-20 bg-industrial-light border-b border-industrial-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-industrial-orange mb-1">
                  FEATURED ITEMS
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-industrial-dark tracking-tight">
                  Featured Products
                </h2>
              </div>
              <Link
                to="/products"
                className="mt-3 sm:mt-0 text-sm font-bold text-industrial-orange hover:underline inline-flex items-center"
              >
                Browse Catalog <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-lg border border-industrial-border overflow-hidden hover:border-industrial-orange transition-all flex flex-col justify-between"
                >
                  <div className="p-4 bg-gray-50 border-b border-industrial-border relative h-48 sm:h-52 flex items-center justify-center">
                    <img
                      src={prod.featuredImage}
                      alt={prod.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400/111315/ffffff?text=Product';
                      }}
                    />
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-industrial-orange uppercase tracking-wider mb-1">
                        {prod.categoryName}
                      </div>
                      <h3 className="text-sm font-bold text-industrial-dark line-clamp-2 mb-1.5">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-industrial-muted line-clamp-2 leading-relaxed mb-4">
                        {prod.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-industrial-border flex items-center justify-between gap-2">
                      <Link
                        to={`/products/${prod.slug}`}
                        className="flex-1 text-center py-2.5 px-3 rounded border border-industrial-dark text-industrial-dark font-bold text-xs hover:bg-industrial-dark hover:text-white transition-colors min-h-[44px] flex items-center justify-center"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/contact?product=${encodeURIComponent(prod.name)}`}
                        className="flex-1 text-center py-2.5 px-3 rounded bg-industrial-orange text-white font-bold text-xs hover:bg-industrial-orange-hover transition-colors min-h-[44px] flex items-center justify-center"
                      >
                        Enquire Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {showProjects && projects.length > 0 && (
        <section className="py-12 sm:py-20 bg-white border-b border-industrial-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-industrial-orange mb-1">
                  PROJECTS
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-industrial-dark tracking-tight">
                  Recent Case Studies
                </h2>
              </div>
              <Link
                to="/projects"
                className="mt-3 sm:mt-0 text-sm font-bold text-industrial-orange hover:underline inline-flex items-center"
              >
                All Projects <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-industrial-light rounded-lg border border-industrial-border overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 sm:h-48 overflow-hidden relative">
                      <img
                        src={proj.heroImage}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 bg-industrial-dark text-white text-[11px] font-bold px-2.5 py-1 rounded">
                        {proj.year}
                      </span>
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="text-xs font-bold text-industrial-orange uppercase tracking-wider mb-1">
                        {proj.industry} • {proj.location}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-industrial-dark mb-2 line-clamp-2">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-industrial-muted leading-relaxed line-clamp-3 mb-3">
                        {proj.shortResult}
                      </p>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 pt-0">
                    <Link
                      to={`/projects/${proj.slug}`}
                      className="w-full inline-flex items-center justify-center py-2.5 border border-industrial-border rounded bg-white text-xs font-bold text-industrial-dark hover:bg-industrial-dark hover:text-white transition-colors min-h-[44px]"
                    >
                      View Details <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      {showContact && (
        <section className="py-16 sm:py-20 bg-industrial-dark text-white text-center relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">
              {config.finalCtaHeading}
            </h2>
            <p className="text-sm sm:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              {config.finalCtaDescription}
            </p>
            <Link
              to={config.finalCtaButtonLink}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded text-base font-bold text-white bg-industrial-orange hover:bg-industrial-orange-hover transition-colors shadow-lg min-h-[44px]"
            >
              <span>{config.finalCtaButtonText}</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};
