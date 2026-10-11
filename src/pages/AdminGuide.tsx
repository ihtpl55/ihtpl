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
  Maximize2,
} from 'lucide-react';

interface GuideSection {
  id: string;
  category: 'overview' | 'catalog' | 'company' | 'media' | 'settings';
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
      id: 'enquiries',
      category: 'overview',
      title: 'Customer Enquiries & Lead Tracking',
      adminPath: '/admin?tab=enquiries',
      livePath: '/contact',
      liveName: 'Contact & Quotation Forms (/contact & /products/:slug)',
      icon: Mail,
      summary: 'Review, manage, and follow up on customer quote requests and engineering inquiries.',
      whatItDoes:
        'This is your internal sales inbox. Every time a contractor, design consultant, or procurement officer clicks "Request Technical Quote" on a product page or submits the Contact Us form, their request lands here with name, phone, email, company, and requested hardware specs.',
      stepByStep: [
        'Open "Customer Enquiries" in the sidebar (red badge indicates unread requests).',
        'Review the customer name, phone number, company, and specific product requested.',
        'Click the status button to advance the lead: "Mark Contacted" once your sales engineer reaches out, and "Close" once the inquiry is quoted or completed.',
        'Use the customer contact details to send engineering drawings or formal quotation sheets via email or WhatsApp.',
      ],
      liveEffects: [
        'Does not alter the public website; this is strictly an internal sales workflow dashboard.',
        'Updates the red unread count badge in your sidebar so team members know when new leads arrive.',
      ],
      dosAndDonts: {
        do: 'Check enquiries daily during business hours so contractors receive prompt quotation responses while tendering.',
        dont: "Don't leave new inquiries untouched. Fast quotation turnaround wins major infrastructure bids.",
      },
    },
    {
      id: 'products',
      category: 'catalog',
      title: 'Products & Catalog Items',
      adminPath: '/admin/crud/products',
      livePath: '/products',
      liveName: 'Product Catalog (/products)',
      icon: Package,
      summary: 'Add, update, or remove engineering products like POT-PTFE Bearings, Expansion Joints, and HSFG Bolts.',
      whatItDoes:
        'This is the heart of your engineering catalog. Every product you add gives clients all the details, technical specifications, load capacities, and photos they need to request a quotation.',
      stepByStep: [
        'Click "+ Add New Item" at the top right of the page.',
        'Enter the Product Name (e.g. "POT-PTFE Bridge Bearing", "Strip Seal Expansion Joint", "HSFG Grade 8.8 / 10.9 Structural Bolts").',
        'Select the Product Category from the dropdown (make sure you created the category first!).',
        'Upload a photo or paste an image URL. Inspect the "Live Image Preview (100% Uncropped Scale)" to make sure the item is shown completely without cutoffs.',
        'Add a brief Summary and Full Description.',
        'Add Technical Specifications key-by-key (e.g., "Vertical Load": "Up to 50,000 kN", "Standards": "IRC:83 (Part III) / EN 1337", "Material": "Cast Steel BS 3100 / EN 10083").',
        'Turn "Published" ON so it appears on the website, and tick "Featured" if you want it spotlighted on the homepage.',
        'Click "Save Changes" to publish.',
      ],
      liveEffects: [
        'Immediately shows up on the main Products Catalog page (/products) and sidebar category filters.',
        'Creates its own dedicated page (/products/your-product-slug) with an uncropped image viewer, specifications table, and "Request Quotation" modal.',
        'If marked as "Featured", it displays on the Homepage featured products grid.',
        'Searchable instantly by name or specification in the global search modal.',
      ],
      dosAndDonts: {
        do: 'Add clear specifications (Load, Material, Standards). Civil engineers rely on these exact numbers for bill of quantities (BOQ).',
        dont: "Don't upload low-resolution or heavily cropped photos. Our uncropped display shows full dimensions, so high-clarity photos look best.",
      },
    },
    {
      id: 'categories',
      category: 'catalog',
      title: 'Product Categories',
      adminPath: '/admin/crud/categories',
      livePath: '/products',
      liveName: 'Catalog Sidebar & Filter Navigation',
      icon: FolderTree,
      summary: 'Organize primary product categories (Bridge Bearings, Expansion Joints, Couplings, Fasteners).',
      whatItDoes:
        'Categories act as primary folders for your catalog. They allow website visitors and bridge designers to quickly filter down to the exact equipment they need without browsing unrelated items.',
      stepByStep: [
        'Click "+ Add New Item".',
        'Type the Category Name (e.g. "Bridge Bearings", "Expansion Joints", "Structural Fasteners").',
        'Write a short description explaining what types of hardware this category covers.',
        'Choose a Sort Order number (e.g. 1 for top priority, 2 for second, etc.).',
        'Upload a representative category photo or paste an image URL.',
        'Make sure "Published" is switched ON and click "Save Changes".',
      ],
      liveEffects: [
        'Adds a clickable filter option in the left sidebar of the Products page.',
        'Updates the Product Category cards on the Homepage (displays clean card with image, title, and "Explore Category" button).',
        'Becomes available in the Category dropdown when adding or editing products.',
      ],
      dosAndDonts: {
        do: 'Keep category titles concise and aligned with civil infrastructure terminology.',
        dont: 'Do NOT delete a category if you still have active products inside it! Reassign those products to another category first.',
      },
    },
    {
      id: 'about',
      category: 'company',
      title: 'About Us, Mission, Values & Leadership',
      adminPath: '/admin/crud/about',
      livePath: '/about',
      liveName: 'About Infinite Hardware (/about)',
      icon: Info,
      summary: 'Edit company background, manufacturing heritage, mission & vision, core values, and executive leadership profiles.',
      whatItDoes:
        'Presents your engineering credibility, manufacturing capabilities, corporate heritage ("Precision Made in India"), ethical governance, and leadership team to prospective clients and tender evaluation boards.',
      stepByStep: [
        'Open "About & Leadership" in the sidebar menu.',
        'Edit Section 1 (Company Story & Facilities): update your background summary, facility photo, and quality compliance highlights.',
        'Edit Section 2 (Mission & Vision): customize your long-term infrastructure mission and technological vision statements.',
        'Edit Section 3 (Core Values): click "+ Add New Value" to add pillars, choose custom icon styles, and define engineering commitments.',
        'Edit Section 4 (Executive Leadership Team): add founders, directors, and technical heads with name, role, photo, bio, and LinkedIn URL.',
        'Click "Save About & Leadership Content" at the bottom to publish changes instantly.',
      ],
      liveEffects: [
        'Immediately updates the public /about page with the new story, mission, vision, values grid, and leadership cards.',
        'Use the "Public Tab: Visible / Hidden" toggle at the top right to show or hide the About tab from the website anytime.',
      ],
      dosAndDonts: {
        do: 'Highlight certified technical credentials, ISO standards, and real leadership profiles to establish engineering trust.',
        dont: "Don't leave placeholder executive bios once real leadership photos and credentials are ready.",
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
      summary: 'Highlight the key infrastructure sectors you supply (Highways, Railways, Metros, Heavy Industry).',
      whatItDoes:
        'Clients and government contractors want to know where your hardware is typically installed. This section showcases your expertise across major civil engineering fields.',
      stepByStep: [
        'Click "+ Add New Item".',
        'Enter Industry Name (e.g. "High-Speed Rail & Metros", "Highway Bridges & Flyovers").',
        'Upload or paste a banner image link showing real construction or train viaducts.',
        'List 3-4 Key Applications (e.g., "Viaduct Piers", "Track Expansion Joints", "Seismic Isolation").',
        'Click "Save Changes".',
      ],
      liveEffects: [
        'Updates the cards on the dedicated /industries page.',
        'Updates the "Industries We Serve" showcase on the Homepage.',
        'Each industry has an "Inquire For This Sector" button directing visitors straight to the contact form.',
      ],
      dosAndDonts: {
        do: 'Use realistic photos of bridge, railway, or flyover work to build high credibility.',
        dont: "Don't create too many overlapping industries; 4 to 6 core sectors keep the website crisp and focused.",
      },
    },
    {
      id: 'capabilities',
      category: 'company',
      title: 'Capabilities & Plant Machinery',
      adminPath: '/admin/crud/capabilities',
      livePath: '/capabilities',
      liveName: 'Capabilities Page (/capabilities)',
      icon: Wrench,
      summary: 'Showcase your manufacturing machinery, CNC fabrication, heavy testing rigs, and quality testing labs.',
      whatItDoes:
        'Consultants and tender committees inspect this page to ensure your plant has the heavy machinery and testing equipment to fulfill massive infrastructure contracts.',
      stepByStep: [
        'Click "+ Add New Item".',
        'Name your capability (e.g., "Heavy CNC Machining & Milling", "Vertical & Shear Load Testing Rig").',
        'Describe the machinery or laboratory testing process.',
        'List Key Highlights (e.g., "Tolerances up to 0.02 mm", "In-house 10,000 kN Test Rig", "Ultrasonic & MPI NDT Testing").',
        'Click "Save Changes".',
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
      id: 'projects',
      category: 'company',
      title: 'Projects & Case Studies',
      adminPath: '/admin/crud/projects',
      livePath: '/projects',
      liveName: 'Projects Showcase (/projects)',
      icon: Briefcase,
      summary: 'Document completed infrastructure projects where your hardware was supplied (Flyovers, Expressways, Metros).',
      whatItDoes:
        'Nothing convinces a bridge contractor faster than seeing real bridges, viaducts, and flyovers where your bearings, joints, or bolts are successfully installed.',
      stepByStep: [
        'Click "+ Add New Item".',
        'Enter Project Name (e.g., "Delhi-Mumbai Expressway Package 4", "Regional Rapid Transit System (RRTS)").',
        'Fill in the Client / Authority Name (e.g. NHAI / L&T Construction / NCRTC), Location, and Year Completed.',
        'List Products Supplied (e.g. "240 POT-PTFE Bearings, 1.2 km Modular Expansion Joints").',
        'Provide a photo of the completed flyover or bridge.',
        'Click "Save Changes".',
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
      category: 'media',
      title: 'Document Center',
      adminPath: '/admin/crud/documents',
      livePath: '/resources/documents',
      liveName: 'Document Center (/resources/documents & /documents)',
      icon: FileText,
      summary: 'Provide downloadable PDFs like Technical Catalogs, ISO Certifications, Vendor Approvals, and Fastener Specs.',
      whatItDoes:
        'Engineers, structural consultants, and quantity surveyors need official PDFs for their approval files. This tab serves as your online download center with dynamic category grouping.',
      stepByStep: [
        'To manage document categories, click "Manage Categories" at the top: add new categories (e.g. "Vendor Approvals", "Fastener Specifications") or delete unneeded ones.',
        'Click "+ Add New Item" to add a document.',
        'Enter Document Title (e.g., "Infinite Hardware Complete Product Catalog 2026", "ISO 9001:2015 Quality Certificate").',
        'Select Document Category from the list, or click "+ Type New" to type a new category on the fly.',
        'Paste the File URL (or a link to your Google Drive / cloud PDF) or upload a file directly.',
        'Mention file size (e.g., "PDF - 4.2 MB").',
        'Click "Save Changes".',
      ],
      liveEffects: [
        'Adds a downloadable card on the /resources/documents and /documents pages.',
        'Visitors can click "Download PDF" to immediately view or save the file.',
      ],
      dosAndDonts: {
        do: 'If using Google Drive for PDFs, make sure the link sharing setting is set to "Anyone with the link can view".',
        dont: "Don't paste private internal company links that require login credentials.",
      },
    },
    {
      id: 'gallery',
      category: 'media',
      title: 'Media Gallery',
      adminPath: '/admin/crud/gallery',
      livePath: '/gallery',
      liveName: 'Plant & Site Gallery (/gallery)',
      icon: ImageIcon,
      summary: 'Upload photos of your factory, manufacturing floor, testing equipment, and finished hardware with category filters.',
      whatItDoes:
        'Proves that Infinite Hardware is an authentic direct manufacturer with heavy machinery. Features 100% uncropped display with soft ambient backgrounds and full-screen Lightbox zoom.',
      stepByStep: [
        'To organize photo tags, click "Manage Categories" at the top: add new categories (e.g. "Testing & Inspection", "Machining Plant") or remove unneeded ones.',
        'Click "+ Add New Item" to add a new photo.',
        'Enter an Image Title (e.g., "POT Bearing Final Inspection Rig", "CNC Lathe Turning").',
        'Choose a Gallery Category from the list, or click "+ Type New" to type a new category.',
        'Upload a photo directly or paste a high-resolution Image URL. Check the "Live Image Preview (100% Uncropped Scale)" frame.',
        'Add an optional caption explaining the engineering process shown.',
        'Click "Save Changes".',
      ],
      liveEffects: [
        'Instantly appears on the public /gallery page.',
        'Renders in 100% native uncropped aspect ratio with ambient background blur and click-to-zoom Lightbox modal.',
        'Visitors can filter photos by all active categories on the website.',
      ],
      dosAndDonts: {
        do: 'Use clear, well-lit photos taken in the workshop or on the bridge installation site.',
        dont: "Don't upload blurry or watermarked stock photos from other websites.",
      },
    },
    {
      id: 'posts',
      category: 'media',
      title: 'Industry Insights & Technical Blog',
      adminPath: '/admin/crud/posts',
      livePath: '/insights',
      liveName: 'Engineering Insights (/insights)',
      icon: BookOpen,
      summary: 'Publish engineering articles, technical installation guides, company news, and industry updates.',
      whatItDoes:
        'Educates clients on why precision bearings matter, boosts company ranking on Google (SEO), and positions Infinite Hardware as an engineering thought leader.',
      stepByStep: [
        'Click "+ Add New Item".',
        'Enter Article Title (e.g., "How to Select the Right Expansion Joint for Long-Span Bridges", "Best Practices for HSFG Bolt Pre-Tensioning").',
        'Write an informative excerpt and the main body text.',
        'Add a Cover Image URL.',
        'Select Author and Category.',
        'Turn "Published" ON and click "Save Changes".',
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
      title: 'Site Settings & Hero Carousel',
      adminPath: '/admin/crud/settings',
      livePath: '/contact',
      liveName: 'Homepage Carousel, Navigation & Contact (/contact)',
      icon: Settings,
      summary: 'Manage the 5-slide rotating hero carousel, show/hide website tabs, update phone, WhatsApp, email, office name, and Google Maps.',
      whatItDoes:
        'This is the master command center for the entire website. Here you configure the homepage background slideshow, toggle public visibility for any page, and update official company contact information.',
      stepByStep: [
        'Open "Site Settings" in the sidebar.',
        'Hero Carousel Section: Upload or paste 5 rotating industrial photos. Click "Upload Photo" to select a file from your computer, or "Reset to Curated Defaults" if needed.',
        'Website Tabs Visibility: Click any tab button (Visible / Hidden) to immediately show or hide that whole page from the public navigation and footer.',
        'Contact Details: Update Phone Number, Mobile / WhatsApp, and Sales Email.',
        'Office & Legal Name: Set official company name ("Infinite Hardware Tech. Pvt. Ltd.") and physical plant address.',
        'Google Maps: Paste your Google Maps share link to update the interactive map and directions button on the Contact page.',
        'Click "Save All Settings" at the bottom to publish live.',
      ],
      liveEffects: [
        'The homepage hero cycles through your 5 photos every 5 seconds with gentle crossfade and pause on hover.',
        'Instantly adds or removes entire tabs from the top header navigation, mobile drawer, and footer.',
        'If a tab is hidden, visitors who type its URL directly are smoothly redirected home.',
        'Instantly updates phone & email in the header, footer, and contact page.',
        'Updates the interactive map on the /contact page.',
      ],
      dosAndDonts: {
        do: 'For the hero carousel, use high-resolution landscape images (1920×1080 or 2560×1440, under 2 MB) for the best visual experience.',
        dont: "Don't leave the phone or email blank, as visitors won't be able to reach your sales team.",
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
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 font-sans">
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
            Welcome! This guide is designed for your day-to-day office, marketing, and sales operations. Learn how each tab works, how to manage products, photos, carousel slides, and documents, and see exactly where each update appears on the live public website.
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-semibold">
            <a
              href="#golden-rules"
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-industrial-orange" />
              <span>4 Golden Rules for Operators</span>
            </a>
            <a
              href="#module-breakdown"
              className="bg-industrial-orange text-white px-3.5 py-2 rounded-lg hover:bg-industrial-orange/90 transition-colors flex items-center gap-1.5"
            >
              <span>Explore All 11 Modules Below</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Golden Rules Section */}
      <div id="golden-rules" className="space-y-4">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-industrial-orange" />
          <h2 className="text-xl font-bold text-industrial-dark">4 Golden Rules Every Staff Member Should Know</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Rule 1 */}
          <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-black text-base mb-3">
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
                <li className="flex items-start gap-1.5">
                  <span className="text-green-600 font-bold">●</span>
                  <span><strong>Green (ON):</strong> Live immediately for all website visitors.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-gray-400 font-bold">●</span>
                  <span><strong>Grey (OFF):</strong> Saved safely as draft. Hidden from public view.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-industrial-border text-[11px] text-industrial-muted italic">
              Tip: Prepare new items as drafts, then publish when specifications are finalized.
            </div>
          </div>

          {/* Rule 2 */}
          <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-black text-base mb-3">
                2
              </div>
              <h3 className="font-bold text-sm text-industrial-dark mb-1.5 flex items-center gap-2">
                <span>Hide Entire Website Tabs</span>
                <ShieldAlert className="w-4 h-4 text-amber-600" />
              </h3>
              <p className="text-xs text-industrial-muted leading-relaxed">
                Need to hide a single item or <strong>an entire public tab</strong> (e.g. Projects or Insights)?
              </p>
              <p className="text-xs text-industrial-dark mt-2 leading-relaxed">
                • <strong>Single Item:</strong> Turn "Published" OFF.<br />
                • <strong>Entire Tab:</strong> Toggle the "Public Tab: Visible / Hidden" button at the top of that admin page, or use <em>Site Settings</em>!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-industrial-border text-[11px] text-amber-800 font-medium">
              💡 Hiding preserves all database items safely while keeping them invisible to the public.
            </div>
          </div>

          {/* Rule 3 */}
          <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-black text-base mb-3">
                3
              </div>
              <h3 className="font-bold text-sm text-industrial-dark mb-1.5 flex items-center gap-2">
                <span>100% Uncropped Photos</span>
                <Maximize2 className="w-4 h-4 text-purple-600" />
              </h3>
              <p className="text-xs text-industrial-muted leading-relaxed">
                All photos across the website now preserve their full native aspect ratio without aggressive zooming or edge cropping.
              </p>
              <p className="text-xs text-industrial-dark mt-2 leading-relaxed">
                • <strong>Admin Preview:</strong> Inspect the "Live Image Preview" box before saving.<br />
                • <strong>Lightbox Zoom:</strong> Visitors can click any photo to inspect it full-screen.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-industrial-border text-[11px] text-purple-800 font-medium">
              💡 Upload sharp, uncompressed photos for maximum clarity on desktop & mobile.
            </div>
          </div>

          {/* Rule 4 */}
          <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-base mb-3">
                4
              </div>
              <h3 className="font-bold text-sm text-industrial-dark mb-1.5 flex items-center gap-2">
                <span>Seeing Your Live Changes</span>
                <RefreshCw className="w-4 h-4 text-blue-600" />
              </h3>
              <p className="text-xs text-industrial-muted leading-relaxed">
                Changes saved in the admin portal synchronize to the live database immediately.
              </p>
              <p className="text-xs text-industrial-dark mt-2 leading-relaxed">
                If your browser still displays an old picture or text, press <strong>Ctrl + F5</strong> (or <strong>Ctrl + Shift + R</strong>) on your keyboard to force download fresh assets.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-industrial-border text-[11px] text-blue-800 font-medium">
              💡 Forces browsers to bypass old cached files immediately.
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
              placeholder="Search e.g. carousel, products, pdf, map..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-industrial-border rounded-lg text-xs text-industrial-dark focus:outline-none focus:border-industrial-orange"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
          {[
            { id: 'all', label: 'All Modules (11)' },
            { id: 'overview', label: 'Overview & Enquiries' },
            { id: 'catalog', label: 'Product Catalog' },
            { id: 'company', label: 'Company & Projects' },
            { id: 'media', label: 'Media & Documents' },
            { id: 'settings', label: 'Settings & Carousel' },
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
                          Module #{idx + 1}
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
            <h4 className="font-bold text-industrial-dark text-sm">What image resolution should I use for the Hero Carousel?</h4>
            <p className="text-industrial-muted leading-relaxed">
              For the 5 rotating hero photos, upload landscape images with a resolution of <strong>1920×1080 (16:9)</strong> or <strong>2560×1440</strong> in JPG or WebP format. Keep file sizes under <strong>2 MB</strong> so the homepage loads at top speed on mobile devices and 4G/5G connections.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-industrial-border space-y-2">
            <h4 className="font-bold text-industrial-dark text-sm">How does image scaling work on Products & Gallery?</h4>
            <p className="text-industrial-muted leading-relaxed">
              No images are cropped! Photos now render in <strong>100% full scale (`object-contain`)</strong> with ambient background styling. In the admin edit form, use the <em>Live Image Preview (100% Uncropped Scale)</em> box to inspect your picture. Website visitors can also click any photo to open the full-scale <strong>Lightbox Zoom modal</strong>.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-industrial-border space-y-2">
            <h4 className="font-bold text-industrial-dark text-sm">How is the Homepage Hero Heading formatted?</h4>
            <p className="text-industrial-muted leading-relaxed">
              The headline is intentionally formatted into 3 balanced lines:
              <br />
              <span className="font-mono text-[11px] text-industrial-dark font-semibold">
                1. Leading manufacturers<br />
                2. of Bridge bearings<br />
                3. and HSFG Bolts
              </span>
              <br />
              This ensures structural readability across smartphones, tablets, and high-resolution monitors without awkward orphan words.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-industrial-border space-y-2">
            <h4 className="font-bold text-industrial-dark text-sm">How do I get our Google Maps share link?</h4>
            <p className="text-industrial-muted leading-relaxed">
              Open <strong>Google Maps</strong> on your computer, search for your factory address (Infinite Hardware Tech. Pvt. Ltd.), click the <strong>Share</strong> button, and click <strong>"Copy link"</strong>. Paste that URL directly into the <em>Google Maps Link</em> field under <strong>Site Settings</strong>.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-industrial-border space-y-2">
            <h4 className="font-bold text-industrial-dark text-sm">How do I manage Document Center categories?</h4>
            <p className="text-industrial-muted leading-relaxed">
              Under <strong>Document Center</strong>, click <strong>"Manage Categories"</strong> at the top. You can add new categories (e.g. <em>"Vendor Approvals"</em>, <em>"IRC Certifications"</em>) or delete obsolete ones. If you delete a category, existing PDFs are safely reassigned without being lost.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-industrial-border space-y-2">
            <h4 className="font-bold text-industrial-dark text-sm">Can customers order or pay directly on the site?</h4>
            <p className="text-industrial-muted leading-relaxed">
              No. Infinite Hardware is a specialized B2B heavy engineering manufacturer. All product buttons say <strong>"Request Technical Quote"</strong>. Contractors and bridge consultants submit their sizes, drawings, and required quantities, which land safely in your <strong>Customer Enquiries</strong> tab for sales engineers to price.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGuide;
