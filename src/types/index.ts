export interface Specification {
  key: string;
  value: string;
}

export interface AttachedDocument {
  title: string;
  url: string;
  type: string; // e.g. "PDF Datasheet", "Brochure", "Installation Manual"
  size?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  brandId?: string;
  brandName?: string;
  shortDescription: string;
  description: string;
  featuredImage: string;
  galleryImages: string[];
  specifications: Specification[];
  documents: AttachedDocument[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
  sortOrder: number;
  published: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description?: string;
  sortOrder: number;
  published: boolean;
}

export interface Industry {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  image: string;
  sortOrder: number;
  published: boolean;
}

export interface Capability {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullContent: string;
  image: string;
  sortOrder: number;
  published: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  industry: string;
  location: string;
  year: string;
  client?: string;
  shortResult: string;
  challenge: string;
  solution: string;
  outcome: string;
  heroImage: string;
  gallery: string[];
  published: boolean;
  sortOrder: number;
}

export type GalleryCategory = 'Warehouse' | 'Products' | 'Projects' | 'Facilities' | 'Deliveries' | 'Events';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  caption?: string;
  published: boolean;
  sortOrder: number;
}

export type DocumentCategory = 'Certifications' | 'Approvals' | 'Company Documents' | 'Catalogues' | 'Technical Documents' | 'Policies';

export interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  fileUrl: string;
  storagePath?: string;
  fileType: string; // e.g. "PDF"
  size: string;
  issueDate?: string;
  published: boolean;
  sortOrder: number;
}

export interface Certification {
  id: string;
  title: string;
  issuingAuthority: string;
  certificateNumber?: string;
  validUntil?: string;
  thumbnail: string;
  pdfUrl: string;
  published: boolean;
  sortOrder: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  heroImage: string;
  content: string;
  publishDate: string;
  category: string;
  author?: string;
  published: boolean;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Closed';

export interface Enquiry {
  id?: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  productName?: string;
  requirementType?: string;
  status: EnquiryStatus;
  createdAt: string;
  honeypot?: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  altPhone?: string;
  email: string;
  whatsapp?: string;
  address: string;
  googleMapsUrl?: string;
  linkedin?: string;
  businessHours: string;
  footerDescription: string;
  copyrightText: string;
}

export interface TrustMetric {
  label: string;
  value: string;
  sortOrder?: number;
}

export interface HomepageConfig {
  heroEyebrow: string;
  heroHeading: string;
  heroDescription: string;
  heroImage: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  trustMetrics: TrustMetric[];
  companyHeading: string;
  companyBody: string;
  companyImage: string;
  finalCtaHeading: string;
  finalCtaDescription: string;
  finalCtaButtonText: string;
  finalCtaButtonLink: string;
}
