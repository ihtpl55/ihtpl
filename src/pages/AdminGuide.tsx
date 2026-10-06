import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Package,
  FolderTree,
  Building2,
  Wrench,
  ImageIcon,
  Briefcase,
  FileText,
  BookOpen,
  Settings,
  Mail,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Eye,
  RefreshCw,
  Search,
  Sparkles,
  Info,
  ShieldAlert,
} from 'lucide-react';

interface GuideSection {
  id: string;
  category: 'catalog' | 'company' | 'content' | 'settings';
  title: string;
  adminPath: string;
  livePath: string;
  liveName: string;
  icon: React.ElementType;
  summary: string;
  whatItDoes: string;
  stepByStep: string[];
  liveEffects: string[];
  dosAndDonts: {
    do: string;
    dont: string;
  };
}

export const AdminGuide: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const guides: GuideSection[] = [
    {
      id: 'products',
      category: 'catalog',
      title: 'Products & Items',
      adminPath: '/admin/crud/products',
      livePath: '/products',
      liveName: 'Product Catalog (/products)',
      icon: Package,
      summary: 'Add, update, or remove engineering products like Bearings, Expansion Joints, and Couplings.',
      whatItDoes:
        'This is the heart of your business catalog. Every product you add here gives customers all the details, photos, and engineering specifications they need to request a quotation.',
      stepByStep: [
        'Click "+ Add Product" at the top right of the page.',
        'Enter the Product Name (e.g. "POT-PTFE Bridge Bearing").',
        'Select the Product Category from the dropdown (make sure you created the category first!).',
        'Paste an Image Link (e.g. an image URL hosted online or a placeholder).',
        'Add a brief Summary and Full Description.',
        'Add Technical Specifications key-by-key (e.g., "Load Capacity": "Up to 5000 kN", "Standard": "IRC:83 / EN 1337").',
        'Turn "Published" ON so it appears on the website, and tick "Featured" if you want it on the homepage spotlight.',
        'Click "Create Product" to save.',
      ],
      liveEffects: [
        'Immediately shows up on the main Products Catalog page (/products).',
        'Creates its own full detail page (/products/your-product-name) with a working "Request Quotation" button.',
        'If marked as "Featured", it displays on the Homepage featured products grid.',
        'Customers can search for it by name or specification in the search bar.',
      ],
      dosAndDonts: {
        do: 'Add clear specifications (Load, Material, Standards). Civil engineers rely on these to send quote requests.',
        dont: "Don't leave the image empty. A product with a missing picture looks incomplete to potential clients.",
      },
    },
    {
      id: 'categories',
      category: 'catalog',
      title: 'Product Categories',
      adminPath: '/admin/crud/categories',
      livePath: '/products',
      liveName: 'Catalog Filters & Navigation',
      icon: FolderTree,
      summary: 'Create and organize major product groups (e.g. Bridge Bearings, Expansion Joints).',
      whatItDoes:
        'Categories act as folders for your products. They allow visitors to quickly filter down to the exact equipment they need without scrolling through hundreds of items.',
      stepByStep: [
        'Click "+ Add Category".',
        'Type the Category Name (e.g. "Elastomeric Bearings").',
        'Write a short description explaining what this category covers.',
        'Choose a Sort Order number (e.g. 1 for top priority, 2 for second, etc.).',
        'Make sure "Published" is switched ON and click "Create Category".',
      ],
      liveEffects: [
        'Adds a clickable filter option in the left sidebar of the Products page.',
        'Shows up in the main navigation menu so visitors can jump straight to that line of products.',
        'Becomes available in the Category dropdown when adding or editing products.',
      ],
      dosAndDonts: {
        do: 'Group similar products together so clients can find bearings, joints, or couplings in one click.',
        dont: 'Do NOT delete a category if you still have active products inside it! Reassign those products to another category first.',
      },
    },
    {
      id: 'industries',
      category: 'company',
      title: 'Industries Served',
      adminPath: '/admin/crud/industries',
      livePath: '/industries',
      liveName: 'Industries Page (/industries)',
      icon: Building2,
      summary: 'Highlight the key infrastructure sectors you serve (Highways, Railways, Metros, Heavy Industry).',
      whatItDoes:
        'Clients and government contractors want to know where your hardware is typically installed. This section showcases your expertise across major civil engineering fields.',
      stepByStep: [
        'Click "+ Add Industry".',
        'Enter Industry Name (e.g. "High-Speed Rail & Metros").',
        'Paste a banner image link showing real construction or trains.',
        'List 3-4 Key Applications (e.g., "Viaduct Piers", "Track Expansion Joints", "Seismic Isolation").',
        'Click "Create Industry" to save.',
      ],
      liveEffects: [
        'Updates the cards on the dedicated /industries page.',
        'Updates the "Industries We Serve" showcase on the Homepage.',
        'Each industry has an "Inquire For This Sector" button directing visitors straight to the contact form.',
      ],
      dosAndDonts: {
        do: 'Use realistic photos of bridge, railway, or flyover work to build high credibility.',
        dont: "Don't create too many overlapping industries; 4 to 6 core sectors keep the website looking crisp and focused.",
      },
    },
    {
      id: 'capabilities',
      category: 'company',
      title: 'Capabilities & Services',
      adminPath: '/admin/crud/capabilities',
      livePath: '/capabilities',
      liveName: 'Capabilities Page (/capabilities)',
      icon: Wrench,
      summary: 'Show off your manufacturing machines, engineering capacity, testing facilities, and fabrication services.',
      whatItDoes:
        'Consultants and tender committees inspect this page to ensure your factory has the machinery and testing equipment to fulfill massive infrastructure contracts.',
      stepByStep: [
        'Click "+ Add Capability".',
        'Name your capability (e.g., "Heavy CNC Machining & Milling", "Load Testing Facility").',
        'Describe the machinery or laboratory process.',
        'List Key Highlights (e.g., "Tolerances up to 0.02mm", "In-house 10,000 kN Test Rig").',
        'Click Save.',
      ],
      liveEffects: [
        'Updates the /capabilities page.',
        'Gives procurement officers the technical confidence to shortlist Infinite Hardware in tender bids.',
      ],
      dosAndDonts: {
        do: 'Mention testing certifications, tonnage capacity, and machine brand/specifications.',
        dont: "Don't use generic text; mention real numbers like machine bed size or maximum bearing test load.",
      },
    },
    {
      id: 'gallery',
      category: 'content',
      title: 'Media Gallery',
      adminPath: '/admin/crud/gallery',
      livePath: '/gallery',
      liveName: 'Plant & Site Gallery (/gallery)',
      icon: ImageIcon,
      summary: 'Upload or link photos of your factory, manufacturing floor, testing equipment, and finished hardware.',
      whatItDoes:
        'A picture is worth a thousand words. High-resolution factory and product photos prove that Infinite Hardware is an authentic direct manufacturer with heavy machinery.',
      stepByStep: [
        'Click "+ Add Media Item".',
        'Enter an Image Title (e.g., "POT Bearing Final Inspection Rig").',
        'Select the Section (Factory, Products, or Testing).',
        'Paste the direct Image URL.',
        'Add a short caption explaining what is in the picture.',
        'Click Save.',
      ],
      liveEffects: [
        'Instantly appears on the /gallery page with interactive photo zoom modal.',
        'Visitors can filter by "Plant & Machinery", "Bearings & Joints", or "Quality Testing".',
      ],
      dosAndDonts: {
        do: 'Use clear, well-lit photos taken in the workshop or on the bridge installation site.',
        dont: "Don't upload blurry or watermarked stock photos from other websites.",
      },
    },
    {
      id: 'projects',
      category: 'company',
      title: 'Case Studies / Projects',
      adminPath: '/admin/crud/projects',
      livePath: '/projects',
      liveName: 'Projects Showcase (/projects)',
      icon: Briefcase,
      summary: 'Document completed infrastructure projects where your hardware was supplied (Flyovers, Expressways, Metros).',
      whatItDoes:
        'Nothing convinces a bridge contractor faster than seeing other famous bridges and flyovers where your bearings and expansion joints are successfully installed.',
      stepByStep: [
        'Click "+ Add Project".',
        'Enter Project Name (e.g., "Delhi-Mumbai Expressway Package 4").',
        'Fill in the Client Name (e.g. NHAI / L&T Construction), Location, and Year Completed.',
        'List Products Supplied (e.g. "240 Spherical Bearings, 1.2 km Modular Expansion Joints").',
        'Provide a photo of the completed flyover or bridge.',
        'Click Save.',
      ],
      liveEffects: [
        'Shows on the public /projects directory.',
        'Creates an individual Project Story page with photo showcase and challenge/solution breakdown.',
      ],
      dosAndDonts: {
        do: 'Always name the general contractor or government authority (NHAI, PWD, Railways) if permitted.',
        dont: "Don't worry if you only have a few projects to start; 3 to 5 strong projects are enough to establish authority.",
      },
    },
    {
      id: 'documents',
      category: 'content',
      title: 'Document Library',
      adminPath: '/admin/crud/documents',
      livePath: '/resources/documents',
      liveName: 'Technical Resources (/resources/documents)',
      icon: FileText,
      summary: 'Provide downloadable PDFs like Technical Catalogs, IRC Approvals, Datasheets, and Manuals.',
      whatItDoes:
        'Engineers, designers, and quantity surveyors need official PDFs for their project documentation and approval files. This tab serves as your online download center.',
      stepByStep: [
        'Click "+ Add Document".',
        'Enter Document Title (e.g., "Infinite Hardware Complete Product Catalog 2026").',
        'Select Document Type (Datasheet, Certificate, Manual, or Brochure).',
        'Paste the File URL (e.g., a link to your Google Drive PDF, Dropbox file, or hosted PDF).',
        'Mention file size or page count (e.g., "PDF - 4.2 MB").',
        'Click Save.',
      ],
      liveEffects: [
        'Adds a downloadable card on the /resources/documents page.',
        'Visitors can click "Download PDF" to immediately view or save the file.',
      ],
      dosAndDonts: {
        do: 'If using Google Drive for PDFs, make sure the link sharing setting is set to "Anyone with the link can view".',
        dont: "Don't paste private internal company links that require login.",
      },
    },
    {
      id: 'posts',
      category: 'content',
      title: 'Insights Blog',
      adminPath: '/admin/crud/posts',
      livePath: '/insights',
      liveName: 'Engineering Blog (/insights)',
      icon: BookOpen,
      summary: 'Publish engineering articles, technical guides, company news, and industry updates.',
      whatItDoes:
        'Articles educate clients on why quality bearings matter, boost your company’s search engine ranking on Google, and position your team as thought leaders.',
      stepByStep: [
        'Click "+ Add Post".',
        'Enter Article Title (e.g., "How to Select the Right Expansion Joint for Long-Span Bridges").',
        'Write an informative excerpt and the main body text.',
        'Add a Cover Image URL.',
        'Select Author and Category.',
        'Turn "Published" ON and click Save.',
      ],
      liveEffects: [
        'Publishes to the /insights article list.',
        'Creates an individual readable blog page (/insights/your-article-slug).',
        'Displays latest posts on the Homepage.',
      ],
      dosAndDonts: {
        do: 'Write practical articles that answer common contractor questions about maintenance and installation.',
        dont: "Don't post empty or 2-sentence posts; thorough 300+ word articles rank far better on Google.",
      },
    },
    {
      id: 'settings',
      category: 'settings',
      title: 'Site Settings',
      adminPath: '/admin/crud/settings',
      livePath: '/contact',
      liveName: 'Header, Footer & Contact Page',
      icon: Settings,
      summary: 'Manage your global company phone numbers, WhatsApp, official email, address, Google Map, AND Show / Hide entire website tabs.',
      whatItDoes:
        'This is the single source of truth for the entire website. Here you can update company contact details and also decide which entire tabs (Products, Industries, Projects, etc.) appear on the public website.',
      stepByStep: [
        'Open the Site Settings tab.',
        'Under "Website Tabs Visibility", click any tab\'s button (Visible / Hidden) to immediately show or hide that whole page from the website.',
        'Update Phone Number, Mobile / WhatsApp, and Sales Email.',
        'Update your Factory / Office Physical Address.',
        'In the "Google Maps Link" field, paste your Google Maps link.',
        'Click "Save All Settings".',
      ],
      liveEffects: [
        'Instantly adds or removes entire tabs from the top header navigation, mobile drawer, and footer.',
        'If a tab is hidden, visitors who type its URL directly are smoothly redirected home.',
        'Instantly updates phone & email in the header, footer, and contact page.',
        'Updates the interactive map and "Get Directions" button on the /contact page.',
      ],
      dosAndDonts: {
        do: 'Use the "Visible / Hidden" switches to easily hide tabs like Projects or Capabilities if you are still updating their content.',
        dont: "Don't leave the email or phone blank, as visitors won't be able to reach your sales team.",
      },
    },
    {
      id: 'enquiries',
      category: 'settings',
      title: 'Customer Enquiries',
      adminPath: '/admin?tab=enquiries',
      livePath: '/contact',
      liveName: 'Lead Capture & Quote Requests',
      icon: Mail,
      summary: 'Review and manage inbound quote requests and messages sent by potential clients.',
      whatItDoes:
        'Every time a visitor fills out the "Get Quotation" form on a product page or the "Contact Us" form, their message lands safely here with timestamp and contact information.',
      stepByStep: [
        'Click "Customer Enquiries" in the sidebar.',
        'Click on any customer name to view their full message, phone, email, and requested products.',
        'Update the Status dropdown as you work: New ➔ In Review ➔ Contacted ➔ Closed.',
        'Add internal notes so your sales teammates know the quote status.',
      ],
      liveEffects: [
        'Does not change the public website; this is your internal sales inbox.',
        'Updates the red unread notification badge in your admin sidebar.',
      ],
      dosAndDonts: {
        do: 'Check enquiries daily during business hours so contractors receive prompt quotation responses.',
        dont: "Don't delete enquiries right away; keep them for sales history and client follow-ups.",
      },
    },
  ];

  const filteredGuides = guides.filter((g) => {
    const matchesCat = activeCategory === 'all' || g.category === activeCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.whatItDoes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-industrial-dark via-gray-900 to-industrial-dark text-white p-8 rounded-xl border border-industrial-slate shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-industrial-orange/20 text-industrial-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-industrial-orange/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Staff Handbook & Live Impact Cheat Sheet</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
            How to Use the Admin Portal
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Welcome! This guide is designed for your day-to-day office and sales operations. Learn how each tab works, how to add products and documents, and see exactly where each update appears on the live public website.
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-semibold">
            <a
              href="#golden-rules"
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-industrial-orange" />
              <span>3 Golden Rules for Operators</span>
            </a>
            <a
              href="#module-breakdown"
              className="bg-industrial-orange text-white px-3.5 py-2 rounded-lg hover:bg-industrial-orange/90 transition-colors flex items-center gap-1.5"
            >
              <span>Explore All Tabs Below</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 3 Golden Rules Section */}
      <div id="golden-rules" className="space-y-4">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-industrial-orange" />
          <h2 className="text-xl font-bold text-industrial-dark">3 Golden Rules Every Staff Member Should Know</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rule 1 */}
          <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-black text-lg mb-3">
                1
              </div>
              <h3 className="font-bold text-sm text-industrial-dark mb-1.5 flex items-center gap-2">
                <span>The "Published" Toggle</span>
                <Eye className="w-4 h-4 text-green-600" />
              </h3>
              <p className="text-xs text-industrial-muted leading-relaxed">
                Every product, category, and document has a <strong>"Published"</strong> switch.
              </p>
              <ul className="mt-2.5 space-y-1.5 text-xs text-industrial-dark">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">●</span>
                  <span><strong>Green (ON):</strong> Live immediately for all website visitors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold">●</span>
                  <span><strong>Grey (OFF):</strong> Saved as a draft. Hidden from the website, safe for you to finish later.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-industrial-border text-[11px] text-industrial-muted italic">
              Tip: When preparing new catalog items, save them as drafts first, then publish when ready!
            </div>
          </div>

          {/* Rule 2 */}
          <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg mb-3">
                2
              </div>
              <h3 className="font-bold text-sm text-industrial-dark mb-1.5 flex items-center gap-2">
                <span>Hide Items & Entire Tabs</span>
                <ShieldAlert className="w-4 h-4 text-amber-600" />
              </h3>
              <p className="text-xs text-industrial-muted leading-relaxed">
                Need to hide a single product, or <strong>an entire tab (e.g. Projects)</strong>?
              </p>
              <p className="text-xs text-industrial-dark mt-2 leading-relaxed">
                • <strong>Single Item:</strong> Edit it and turn "Published" OFF.<br />
                • <strong>Full Tab:</strong> Toggle the "Public Tab: Visible / Hidden" button at the top of that tab's page, or use the master switches in <em>Site Settings</em>!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-industrial-border text-[11px] text-amber-800 font-medium">
              💡 Hiding preserves all your data safely while keeping it invisible to public visitors.
            </div>
          </div>

          {/* Rule 3 */}
          <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg mb-3">
                3
              </div>
              <h3 className="font-bold text-sm text-industrial-dark mb-1.5 flex items-center gap-2">
                <span>Seeing Your Changes</span>
                <RefreshCw className="w-4 h-4 text-blue-600" />
              </h3>
              <p className="text-xs text-industrial-muted leading-relaxed">
                Changes made in this admin panel save to the live database instantly.
              </p>
              <p className="text-xs text-industrial-dark mt-2 leading-relaxed">
                If you open the website and still see the old text or photo, your browser has temporarily stored the old page in memory. Press <strong>Ctrl + F5</strong> (or <strong>Shift + Refresh</strong>) to load the newest version.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-industrial-border text-[11px] text-blue-800 font-medium">
              💡 Works on Windows & Mac browsers to guarantee you view fresh data.
            </div>
          </div>
        </div>
      </div>

      {/* Module Impact Reference Directory */}
      <div id="module-breakdown" className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-industrial-border pb-4">
          <div>
            <h2 className="text-xl font-bold text-industrial-dark flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-industrial-orange" />
              <span>Step-by-Step Guide for Every Tab</span>
            </h2>
            <p className="text-xs text-industrial-muted mt-1">
              Select a category or search for what you want to update on the website.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-industrial-muted" />
            <input
              type="text"
              placeholder="Search e.g. products, map, pdf..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-industrial-border rounded-lg text-xs text-industrial-dark focus:outline-none focus:border-industrial-orange"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
          {[
            { id: 'all', label: 'All Tabs (10)' },
            { id: 'catalog', label: 'Products & Categories' },
            { id: 'company', label: 'Industries, Capabilities & Projects' },
            { id: 'content', label: 'Gallery, Documents & Blog' },
            { id: 'settings', label: 'Contact Settings & Enquiries' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg border transition-all ${
                activeCategory === cat.id
                  ? 'bg-industrial-dark text-white border-industrial-dark shadow-sm'
                  : 'bg-white text-industrial-muted border-industrial-border hover:border-industrial-dark hover:text-industrial-dark'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Guide Cards */}
        <div className="space-y-8">
          {filteredGuides.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <div
                key={guide.id}
                id={guide.id}
                className="bg-white rounded-xl border border-industrial-border shadow-sm overflow-hidden transition-all hover:border-gray-400"
              >
                {/* Card Top Banner */}
                <div className="p-6 border-b border-industrial-border bg-gray-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-industrial-dark text-white rounded-lg shrink-0">
                      <Icon className="w-6 h-6 text-industrial-orange" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-industrial-orange uppercase tracking-wider">
                          Tab #{idx + 1}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[11px] text-gray-500 font-mono font-medium">{guide.adminPath}</span>
                      </div>
                      <h3 className="text-lg font-black text-industrial-dark mt-0.5">{guide.title}</h3>
                      <p className="text-xs text-industrial-muted mt-1 max-w-2xl">{guide.summary}</p>
                    </div>
                  </div>

                  {/* Action Shortcuts */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={guide.adminPath}
                      className="px-3.5 py-2 bg-industrial-dark text-white hover:bg-industrial-orange rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Open This Tab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={guide.livePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-white text-industrial-dark border border-industrial-border hover:border-industrial-dark rounded text-xs font-bold transition-colors flex items-center gap-1.5"
                      title="See what visitors see on the live website"
                    >
                      <span>View Live Site</span>
                      <ExternalLink className="w-3.5 h-3.5 text-industrial-muted" />
                    </Link>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
                  {/* Left Column: How to do it (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h4 className="font-bold text-industrial-dark uppercase tracking-wider text-[11px] mb-2 text-industrial-orange">
                        1. What is this tab for?
                      </h4>
                      <p className="text-industrial-dark text-xs leading-relaxed bg-gray-50 p-3 rounded border border-industrial-border/60">
                        {guide.whatItDoes}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-industrial-dark uppercase tracking-wider text-[11px] mb-3 text-industrial-orange">
                        2. How to Add / Edit (Step-by-Step)
                      </h4>
                      <div className="space-y-2">
                        {guide.stepByStep.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-industrial-light border border-industrial-border text-industrial-dark flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="text-industrial-dark leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Do's and Don'ts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-green-50 border border-green-200 p-3 rounded">
                        <div className="font-bold text-green-900 flex items-center gap-1.5 mb-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          <span>Do This:</span>
                        </div>
                        <p className="text-[11px] text-green-800 leading-relaxed">{guide.dosAndDonts.do}</p>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 p-3 rounded">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Avoid This:</span>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-relaxed">{guide.dosAndDonts.dont}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Website Impact (5 cols) */}
                  <div className="lg:col-span-5 bg-industrial-light/60 p-5 rounded-lg border border-industrial-border space-y-4">
                    <div className="flex items-center justify-between border-b border-industrial-border pb-2.5">
                      <div className="font-black text-industrial-dark uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-industrial-orange" />
                        <span>Live Website Impact</span>
                      </div>
                      <span className="text-[10px] bg-white border border-industrial-border px-2 py-0.5 rounded font-mono text-industrial-muted">
                        Live Page
                      </span>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-industrial-dark mb-1">
                        Where visitors will see your changes:
                      </div>
                      <div className="text-xs font-semibold text-industrial-orange mb-3 flex items-center gap-1">
                        <span>{guide.liveName}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {guide.liveEffects.map((effect, eIdx) => (
                        <div key={eIdx} className="flex items-start gap-2 bg-white p-2.5 rounded border border-industrial-border/70">
                          <CheckCircle2 className="w-3.5 h-3.5 text-industrial-orange shrink-0 mt-0.5" />
                          <span className="text-[11px] text-industrial-dark leading-relaxed">{effect}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Link
                        to={guide.livePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center py-2 px-3 bg-white hover:bg-industrial-dark hover:text-white border border-industrial-border rounded font-bold text-xs text-industrial-dark transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Check {guide.title} on Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Helpful Links & Tips for Non-Tech Staff */}
      <div className="bg-white rounded-xl border border-industrial-border p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-industrial-dark flex items-center gap-2">
          <Info className="w-5 h-5 text-industrial-orange" />
          <span>Quick Answers & Best Practices for Office Staff</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-gray-50 border border-industrial-border space-y-2">
            <h4 className="font-bold text-industrial-dark text-sm">Where can I get image links?</h4>
            <p className="text-industrial-muted leading-relaxed">
              When adding products or gallery items, you can use photos already uploaded on the internet, from your cloud drive (Google Drive public link, Dropbox), or free hosting services like <em>Imgur.com</em> or <em>Cloudinary</em>. Simply right-click on the image and choose <strong>"Copy Image Address"</strong>.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-industrial-border space-y-2">
            <h4 className="font-bold text-industrial-dark text-sm">How do I get our Google Maps link?</h4>
            <p className="text-industrial-muted leading-relaxed">
              Open <strong>Google Maps</strong> on your computer, search for your factory address, click the <strong>Share</strong> button, and click <strong>"Copy link"</strong>. Paste that URL directly into the <em>Google Maps Link</em> box under <strong>Site Settings</strong>.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-industrial-border space-y-2">
            <h4 className="font-bold text-industrial-dark text-sm">Can customers order or pay directly on the site?</h4>
            <p className="text-industrial-muted leading-relaxed">
              No. Infinite Hardware is a B2B heavy engineering manufacturer. All product buttons say <strong>"Request Quotation"</strong>. Customers submit their required sizes, specifications, and drawings, which arrive in your <strong>Customer Enquiries</strong> tab for your sales engineers to quote.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-industrial-border space-y-2">
            <h4 className="font-bold text-industrial-dark text-sm">What should I do if a change doesn't show up?</h4>
            <p className="text-industrial-muted leading-relaxed">
              First, check if the <strong>"Published"</strong> switch was turned ON when saving. Second, on the public website, press <strong>Ctrl + Shift + R</strong> (or <strong>Ctrl + F5</strong>) on your keyboard. This forces your browser to download the very latest updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
