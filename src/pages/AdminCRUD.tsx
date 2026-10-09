import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Edit3,
  Upload,
  CheckCircle,
  Save,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  X,
  Eye,
  EyeOff,
  Compass,
  Package,
  Building2,
  Wrench,
  Briefcase,
  FileText,
  Image as ImageIcon,
  BookOpen,
  Info,
  Phone,
  Target,
  Award,
  Users,
  Truck,
  Sparkles,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';
import { getProducts, saveProduct, deleteProduct } from '../services/products.service';
import { getCategories, saveCategory, deleteCategory } from '../services/categories.service';
import { getBrands, saveBrand, deleteBrand } from '../services/brands.service';
import { getProjects, saveProject, deleteProject } from '../services/projects.service';
import { getDocuments, saveDocument, deleteDocument, getDocumentCategories, saveDocumentCategory, deleteDocumentCategory } from '../services/documents.service';
import { getIndustries, saveIndustry, deleteIndustry } from '../services/industries.service';
import { getCapabilities, saveCapability, deleteCapability } from '../services/capabilities.service';
import { getGalleryItems, saveGalleryItem, deleteGalleryItem, getGalleryCategories, saveGalleryCategory, deleteGalleryCategory } from '../services/gallery.service';
import { getCertifications, saveCertification, deleteCertification } from '../services/certifications.service';
import { getPosts, savePost, deletePost } from '../services/posts.service';
import { getSiteSettings, updateSiteSettings } from '../services/settings.service';
import { getAboutConfig, updateAboutConfig, defaultAboutConfig } from '../services/about.service';
import { uploadFile } from '../services/storage.service';
import { Product, Category, Brand, Project, SiteSettings, NavigationVisibility, Industry, Capability, GalleryItem, Certification, BlogPost, AboutConfig, CoreValue, LeadershipMember } from '../types';

export const AdminCRUD: React.FC = () => {
  const { entity } = useParams<{ entity: string }>();

  const [items, setItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [settingsItem, setSettingsItem] = useState<SiteSettings | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCustomDocCat, setIsCustomDocCat] = useState(false);
  const [customDocCatInput, setCustomDocCatInput] = useState('');
  const [docCategories, setDocCategories] = useState<string[]>([]);
  const [isCustomGalleryCat, setIsCustomGalleryCat] = useState(false);
  const [customGalleryCatInput, setCustomGalleryCatInput] = useState('');
  const [galleryCategories, setGalleryCategories] = useState<string[]>([]);
  const [aboutConfig, setAboutConfig] = useState<AboutConfig | null>(null);
  const [aboutSaving, setAboutSaving] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryActionLoading, setCategoryActionLoading] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const allNavTabs: Array<{ key: keyof NavigationVisibility; label: string; path: string; icon: React.ElementType }> = [
    { key: 'products', label: 'Products', path: '/products', icon: Package },
    { key: 'industries', label: 'Industries', path: '/industries', icon: Building2 },
    { key: 'capabilities', label: 'Capabilities', path: '/capabilities', icon: Wrench },
    { key: 'projects', label: 'Projects', path: '/projects', icon: Briefcase },
    { key: 'documents', label: 'Document Center', path: '/resources/documents', icon: FileText },
    { key: 'gallery', label: 'Media Gallery', path: '/gallery', icon: ImageIcon },
    { key: 'insights', label: 'Industry Insights', path: '/insights', icon: BookOpen },
    { key: 'about', label: 'About Us', path: '/about', icon: Info },
    { key: 'contact', label: 'Contact Us', path: '/contact', icon: Phone },
  ];

  const entityNavKeyMap: Record<string, keyof NavigationVisibility> = {
    products: 'products',
    industries: 'industries',
    capabilities: 'capabilities',
    projects: 'projects',
    documents: 'documents',
    gallery: 'gallery',
    posts: 'insights',
    about: 'about',
  };

  const currentNavKey = entity ? entityNavKeyMap[entity] : undefined;
  const isCurrentTabVisible =
    siteSettings?.navVisibility && currentNavKey
      ? siteSettings.navVisibility[currentNavKey] !== false
      : true;

  const handleToggleCurrentTabHeader = async () => {
    if (!siteSettings || !currentNavKey) return;
    const nextVal = !isCurrentTabVisible;
    const updatedNav = {
      ...(siteSettings.navVisibility || {}),
      [currentNavKey]: nextVal,
    };
    const updatedSettings = {
      ...siteSettings,
      navVisibility: updatedNav,
    };
    setSiteSettings(updatedSettings);
    await updateSiteSettings(updatedSettings);
    setMessage(`The "${entity}" tab is now ${nextVal ? 'VISIBLE on' : 'HIDDEN from'} the main website.`);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleToggleNavTabInSettings = async (key: keyof NavigationVisibility) => {
    if (!settingsItem) return;
    const currentVal = settingsItem.navVisibility?.[key] !== false;
    const nextVal = !currentVal;
    const updatedNav = {
      ...(settingsItem.navVisibility || {}),
      [key]: nextVal,
    };
    const updatedSettings = {
      ...settingsItem,
      navVisibility: updatedNav,
    };
    setSettingsItem(updatedSettings);
    setSiteSettings(updatedSettings);
    await updateSiteSettings(updatedSettings);
    setMessage(`Website Tab "${String(key)}" is now ${nextVal ? 'VISIBLE on' : 'HIDDEN from'} the main site.`);
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    setCurrentPage(1);
    loadEntityData();
  }, [entity]);

  const loadEntityData = async () => {
    setEditingItem(null);
    setSettingsItem(null);
    setMessage('');
    setIsCustomDocCat(false);
    setCustomDocCatInput('');

    const liveSettings = await getSiteSettings(false);
    setSiteSettings(liveSettings);

    if (entity === 'settings') {
      const settings = await getSiteSettings(true);
      setSiteSettings(settings);
      setSettingsItem(settings);
    } else if (entity === 'about') {
      const abt = await getAboutConfig();
      setAboutConfig(abt);
    } else {
      const catList = await getCategories(false);
      const brandList = await getBrands(false);
      setCategories(catList);
      setBrands(brandList);

      if (entity === 'products') {
        setItems(await getProducts(false));
      } else if (entity === 'categories') {
        setItems(catList);
      } else if (entity === 'brands') {
        setItems(brandList);
      } else if (entity === 'projects') {
        setItems(await getProjects(false));
      } else if (entity === 'documents') {
        const docs = await getDocuments(false);
        const cats = await getDocumentCategories();
        setItems(docs);
        setDocCategories(cats);
      } else if (entity === 'industries') {
        setItems(await getIndustries(false));
      } else if (entity === 'capabilities') {
        setItems(await getCapabilities(false));
      } else if (entity === 'gallery') {
        const galItems = await getGalleryItems(false);
        const galCats = await getGalleryCategories();
        setItems(galItems);
        setGalleryCategories(galCats);
      } else if (entity === 'certifications') {
        setItems(await getCertifications(false));
      } else if (entity === 'posts') {
        setItems(await getPosts(false));
      }
    }
  };

  const isDocEntity = entity === 'documents';
  const isGalleryEntity = entity === 'gallery';

  const existingDocCategories = Array.from(
    new Set([
      ...docCategories,
      ...(isDocEntity ? items.map((i: any) => i.category).filter(Boolean) : []),
    ])
  );

  const existingGalleryCategories = Array.from(
    new Set([
      ...galleryCategories,
      ...(isGalleryEntity ? items.map((i: any) => i.category).filter(Boolean) : []),
    ])
  );

  const currentCategoryList = isGalleryEntity ? existingGalleryCategories : existingDocCategories;

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      setCategoryActionLoading(true);
      if (isGalleryEntity) {
        const updated = await saveGalleryCategory(newCategoryName.trim());
        setGalleryCategories(updated);
        setMessage(`Gallery category "${newCategoryName.trim()}" created successfully.`);
      } else {
        const updated = await saveDocumentCategory(newCategoryName.trim());
        setDocCategories(updated);
        setMessage(`Document category "${newCategoryName.trim()}" created successfully.`);
      }
      setNewCategoryName('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(`Could not create category: ${err.message || err}`);
    } finally {
      setCategoryActionLoading(false);
    }
  };

  const handleDeleteCategory = async (catToDelete: string, itemCount: number) => {
    const remainingCats = currentCategoryList.filter((c) => c !== catToDelete);
    const fallbackCat = remainingCats[0] || (isGalleryEntity ? 'Products' : 'Catalogues');
    const itemLabel = isGalleryEntity ? 'photo(s)' : 'document(s)';

    const confirmMsg =
      itemCount > 0
        ? `Are you sure you want to delete category "${catToDelete}"? ${itemCount} ${itemLabel} in this category will be reassigned to "${fallbackCat}".`
        : `Are you sure you want to delete category "${catToDelete}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setCategoryActionLoading(true);
      if (isGalleryEntity) {
        const updated = await deleteGalleryCategory(catToDelete);
        setGalleryCategories(updated);
        const freshItems = await getGalleryItems(false);
        setItems(freshItems);
        if (editingItem && editingItem.category === catToDelete) {
          setEditingItem({ ...editingItem, category: updated[0] || fallbackCat });
        }
      } else {
        const updated = await deleteDocumentCategory(catToDelete);
        setDocCategories(updated);
        const freshDocs = await getDocuments(false);
        setItems(freshDocs);
        if (editingItem && editingItem.category === catToDelete) {
          setEditingItem({ ...editingItem, category: updated[0] || fallbackCat });
        }
      }
      setMessage(`Category "${catToDelete}" deleted successfully.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(`Could not delete category: ${err.message || err}`);
    } finally {
      setCategoryActionLoading(false);
    }
  };

  const handleSlugGen = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleCreateNew = () => {
    setIsNew(true);
    if (entity === 'products') {
      setEditingItem({
        name: '',
        slug: '',
        categoryId: categories[0]?.id || '',
        categoryName: categories[0]?.name || '',
        brandId: '',
        brandName: 'Infinite Hardware',
        shortDescription: '',
        description: '',
        featuredImage: '',
        galleryImages: [],
        specifications: [{ key: 'Material', value: 'High Tensile Steel' }],
        published: true,
        featured: false,
        sortOrder: 1,
      });
    } else if (entity === 'categories') {
      setEditingItem({ name: '', slug: '', description: '', image: '', published: true, sortOrder: 1 });
    } else if (entity === 'brands') {
      setEditingItem({ name: '', logo: '', description: '', published: true, sortOrder: 1 });
    } else if (entity === 'projects') {
      setEditingItem({ title: '', slug: '', industry: 'Bridges & Roads', location: '', year: new Date().getFullYear().toString(), shortResult: '', challenge: '', solution: '', outcome: '', heroImage: '', published: true, sortOrder: 1 });
    } else if (entity === 'documents') {
      setIsCustomDocCat(false);
      setCustomDocCatInput('');
      setEditingItem({ title: '', category: 'Catalogues', fileUrl: '', fileType: 'PDF', size: '1.0 MB', published: true, sortOrder: 1 });
    } else if (entity === 'industries') {
      setEditingItem({ title: '', slug: '', shortDescription: '', image: '', published: true, sortOrder: 1 });
    } else if (entity === 'capabilities') {
      setEditingItem({ title: '', slug: '', shortDescription: '', fullContent: '', image: '', published: true, sortOrder: 1 });
    } else if (entity === 'gallery') {
      setIsCustomGalleryCat(false);
      setCustomGalleryCatInput('');
      setEditingItem({ title: '', category: existingGalleryCategories[0] || 'Products', image: '', caption: '', published: true, sortOrder: 1 });
    } else if (entity === 'certifications') {
      setEditingItem({ title: '', issuingAuthority: 'ISO', certificateNumber: '', validUntil: '', thumbnail: '', pdfUrl: '', published: true, sortOrder: 1 });
    } else if (entity === 'posts') {
      setEditingItem({ title: '', slug: '', summary: '', content: '', heroImage: '', category: 'Technical', author: 'Technical Editorial', publishDate: new Date().toISOString().split('T')[0], published: true });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (entity === 'products') {
      const selectedCat = categories.find(c => c.id === editingItem.categoryId);
      const cleanSpecs = (editingItem.specifications || []).filter(
        (s: { key?: string; value?: string }) => s && (s.key?.trim() || s.value?.trim())
      );
      const updatedItem = {
        ...editingItem,
        categoryName: selectedCat ? selectedCat.name : editingItem.categoryName,
        brandId: '',
        brandName: 'Infinite Hardware',
        specifications: cleanSpecs,
      };
      await saveProduct(updatedItem);
    } else if (entity === 'categories') {
      await saveCategory(editingItem);
    } else if (entity === 'brands') {
      await saveBrand(editingItem);
    } else if (entity === 'projects') {
      await saveProject(editingItem);
    } else if (entity === 'documents') {
      await saveDocument(editingItem);
    } else if (entity === 'industries') {
      await saveIndustry(editingItem);
    } else if (entity === 'capabilities') {
      await saveCapability(editingItem);
    } else if (entity === 'gallery') {
      await saveGalleryItem(editingItem);
    } else if (entity === 'certifications') {
      await saveCertification(editingItem);
    } else if (entity === 'posts') {
      await savePost(editingItem);
    }

    setEditingItem(null);
    loadEntityData();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsItem) return;
    await updateSiteSettings(settingsItem);
    setMessage('Site Settings updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutConfig) return;
    setAboutSaving(true);
    try {
      await updateAboutConfig(aboutConfig);
      setMessage('About Us, Mission, Vision, Values, and Leadership updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(`Could not save About content: ${err.message || err}`);
    } finally {
      setAboutSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    if (entity === 'products') await deleteProduct(id);
    else if (entity === 'categories') await deleteCategory(id);
    else if (entity === 'brands') await deleteBrand(id);
    else if (entity === 'projects') await deleteProject(id);
    else if (entity === 'documents') await deleteDocument(id);
    else if (entity === 'industries') await deleteIndustry(id);
    else if (entity === 'capabilities') await deleteCapability(id);
    else if (entity === 'gallery') await deleteGalleryItem(id);
    else if (entity === 'certifications') await deleteCertification(id);
    else if (entity === 'posts') await deletePost(id);
    loadEntityData();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, folder: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadFile(file, folder, (progress) => setUploadProgress(progress));
      
      if (entity === 'settings') {
        setSettingsItem((prev: any) => ({ ...prev, [field]: url }));
      } else {
        const extraDocFields = entity === 'documents' ? {
          size: file.size > 1048576 
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
            : `${(file.size / 1024).toFixed(0)} KB`,
          fileType: file.name.split('.').pop()?.toUpperCase() || 'PDF'
        } : {};
        setEditingItem((prev: any) => ({ ...prev, [field]: url, ...extraDocFields }));
      }
      setUploading(false);
    } catch (err: any) {
      alert(err.message || 'File upload failed');
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-lg border border-industrial-border shadow-subtle">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-industrial-dark">
            {entity === 'settings'
              ? 'Configure Website Settings'
              : entity === 'about'
              ? 'About Us, Mission, Values & Leadership'
              : entity === 'documents'
              ? 'Document Center Management'
              : entity === 'gallery'
              ? 'Media Gallery Management'
              : entity === 'posts'
              ? 'Industry Insights & Articles'
              : `Manage ${entity}`}
          </h1>
          <p className="text-xs text-industrial-muted mt-0.5">
            {entity === 'settings'
              ? 'Update contact details, office address, branding logo, and page footer options'
              : entity === 'about'
              ? 'Customize company story, mission statement, vision, core values, and executive leadership profiles'
              : entity === 'documents'
              ? 'Upload, organize categories, and manage technical catalogues, approvals, and certifications'
              : entity === 'gallery'
              ? 'Upload, categorize, and organize factory, testing rig, and project photos'
              : entity === 'posts'
              ? 'Publish and manage engineering articles and technical insights'
              : `Create, edit, or delete listings in the ${entity} directory`}
          </p>
        </div>

        {entity !== 'settings' && !editingItem && (
          <div className="flex items-center space-x-2 self-start sm:self-auto flex-wrap gap-y-2">
            {currentNavKey && (
              <button
                type="button"
                onClick={handleToggleCurrentTabHeader}
                className={`px-3 py-2 rounded text-xs font-bold flex items-center space-x-1.5 transition-all border shadow-xs ${
                  isCurrentTabVisible
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
                title={
                  isCurrentTabVisible
                    ? 'This entire tab is currently VISIBLE on the website. Click to HIDE it.'
                    : 'This entire tab is currently HIDDEN from the website. Click to SHOW it.'
                }
              >
                {isCurrentTabVisible ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Public Tab: Visible</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                    <span>Public Tab: Hidden</span>
                  </>
                )}
              </button>
            )}
            {(entity === 'documents' || entity === 'gallery') && (
              <button
                type="button"
                onClick={() => setShowCategoryManager(true)}
                className="px-3.5 py-2.5 bg-industrial-slate hover:bg-industrial-dark text-white text-xs font-bold rounded flex items-center space-x-1.5 transition-colors shadow-sm"
                title={`Create or delete ${entity === 'gallery' ? 'gallery' : 'document'} categories`}
              >
                <FolderTree className="w-4 h-4 text-industrial-orange" />
                <span>Manage Categories</span>
              </button>
            )}
            {entity !== 'about' && (
              <button
                onClick={handleCreateNew}
                className="px-4 py-2.5 bg-industrial-orange hover:bg-industrial-orange-hover text-white text-xs font-bold rounded flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            )}
          </div>
        )}
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded text-xs font-semibold flex items-center">
          <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" /> {message}
        </div>
      )}

      {/* Site Settings Form */}
      {entity === 'settings' && settingsItem && (
        <div className="bg-white p-6 rounded-lg border border-industrial-border shadow-subtle">
          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs max-w-3xl">
            {/* Website Navigation Tabs Visibility Control */}
            <div className="bg-gray-50 border border-industrial-border rounded-lg p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-industrial-border pb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-industrial-dark flex items-center gap-2">
                    <Compass className="w-4 h-4 text-industrial-orange" />
                    <span>Website Tabs Visibility (Show / Hide)</span>
                  </h3>
                  <p className="text-[11px] text-industrial-muted mt-0.5">
                    Toggle which pages and tabs appear in the main navigation, mobile menu, and footer on the live website.
                  </p>
                </div>
                <span className="text-[10px] bg-industrial-orange/10 text-industrial-orange font-bold px-2.5 py-1 rounded border border-industrial-orange/20 self-start sm:self-auto uppercase tracking-wider">
                  Live Control
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {allNavTabs.map((tab) => {
                  const isVisible = settingsItem.navVisibility?.[tab.key] !== false;
                  const TabIcon = tab.icon;
                  return (
                    <div
                      key={tab.key}
                      className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                        isVisible
                          ? 'bg-white border-industrial-border shadow-xs hover:border-gray-400'
                          : 'bg-gray-100/80 border-dashed border-gray-300 opacity-75'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`p-2 rounded shrink-0 ${isVisible ? 'bg-industrial-dark text-white' : 'bg-gray-300 text-gray-600'}`}>
                          <TabIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-industrial-dark truncate">{tab.label}</div>
                          <div className="text-[10px] text-gray-500 font-mono truncate">{tab.path}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleNavTabInSettings(tab.key)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 flex items-center gap-1 ${
                          isVisible
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                        title={isVisible ? `Click to HIDE ${tab.label} from the website` : `Click to SHOW ${tab.label} on the website`}
                      >
                        {isVisible ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-gray-500" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">Phone Number (Primary)</label>
                <input
                  type="text"
                  required
                  value={settingsItem.phone || ''}
                  onChange={(e) => setSettingsItem({ ...settingsItem, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                />
              </div>
              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">Phone Number (Secondary)</label>
                <input
                  type="text"
                  value={settingsItem.altPhone || ''}
                  onChange={(e) => setSettingsItem({ ...settingsItem, altPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                />
              </div>
              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">Sales Inquiry Email</label>
                <input
                  type="email"
                  required
                  value={settingsItem.email || ''}
                  onChange={(e) => setSettingsItem({ ...settingsItem, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                />
              </div>
              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">WhatsApp Number (with country code)</label>
                <input
                  type="text"
                  value={settingsItem.whatsapp || ''}
                  onChange={(e) => setSettingsItem({ ...settingsItem, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">Office / Warehouse Address</label>
              <textarea
                rows={2}
                required
                value={settingsItem.address || ''}
                onChange={(e) => setSettingsItem({ ...settingsItem, address: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">Business Operating Hours</label>
                <input
                  type="text"
                  value={settingsItem.businessHours || ''}
                  onChange={(e) => setSettingsItem({ ...settingsItem, businessHours: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">Google Maps link</label>
                <input
                  type="text"
                  value={settingsItem.googleMapsUrl || ''}
                  onChange={(e) => setSettingsItem({ ...settingsItem, googleMapsUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">Footer Brief Summary</label>
              <textarea
                rows={3}
                value={settingsItem.footerDescription || ''}
                onChange={(e) => setSettingsItem({ ...settingsItem, footerDescription: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">Copyright Line</label>
              <input
                type="text"
                value={settingsItem.copyrightText || ''}
                onChange={(e) => setSettingsItem({ ...settingsItem, copyrightText: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-industrial-orange hover:bg-industrial-orange-hover text-white font-bold rounded flex items-center space-x-2 transition-colors uppercase tracking-wider"
            >
              <Save className="w-4 h-4" /> <span>Save Site Settings</span>
            </button>
          </form>
        </div>
      )}

      {/* About & Leadership CMS Form */}
      {entity === 'about' && aboutConfig && (
        <div className="bg-white p-6 rounded-lg border border-industrial-border shadow-subtle">
          <form onSubmit={handleSaveAbout} className="space-y-8 text-xs max-w-4xl">
            
            {/* Section 1: Company Story & Facility Overview */}
            <div className="bg-gray-50 border border-industrial-border rounded-lg p-5 space-y-4">
              <div className="border-b border-industrial-border pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-industrial-dark flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-industrial-orange" />
                  <span>1. Company Story & Facility Overview</span>
                </h3>
                <p className="text-[11px] text-industrial-muted mt-0.5">
                  Introduces your engineering background, production capabilities, and facility trust markers.
                </p>
              </div>

              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                  Story Section Heading *
                </label>
                <input
                  type="text"
                  required
                  value={aboutConfig.storyHeading || ''}
                  onChange={(e) => setAboutConfig({ ...aboutConfig, storyHeading: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                />
              </div>

              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                  Story Description / Overview Body *
                </label>
                <textarea
                  rows={4}
                  required
                  value={aboutConfig.storyBody || ''}
                  onChange={(e) => setAboutConfig({ ...aboutConfig, storyBody: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange leading-relaxed"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Facility Photo URL
                  </label>
                  <input
                    type="text"
                    value={aboutConfig.storyImage || ''}
                    onChange={(e) => setAboutConfig({ ...aboutConfig, storyImage: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                    placeholder="https://..."
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <label className="px-3 py-1.5 bg-industrial-slate hover:bg-industrial-dark text-white rounded text-[11px] font-semibold cursor-pointer flex items-center gap-1 transition-colors">
                      <Upload className="w-3 h-3" />
                      <span>{uploading ? 'Uploading...' : 'Upload Facility Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploading(true);
                          try {
                            const url = await uploadFile(file, 'about', setUploadProgress);
                            setAboutConfig({ ...aboutConfig, storyImage: url });
                          } catch (err: any) {
                            alert(err.message || 'Upload failed');
                          } finally {
                            setUploading(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {aboutConfig.storyImage && (
                  <div>
                    <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                      Preview
                    </label>
                    <img
                      src={aboutConfig.storyImage}
                      alt="Facility preview"
                      className="h-28 w-full object-cover rounded border border-industrial-border"
                    />
                  </div>
                )}
              </div>

              {/* Bullet Highlights */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider">
                    Quality & Compliance Highlights
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setAboutConfig({
                        ...aboutConfig,
                        highlights: [...(aboutConfig.highlights || []), ''],
                      })
                    }
                    className="text-[11px] font-bold text-industrial-orange hover:underline flex items-center"
                  >
                    <Plus className="w-3 h-3 mr-0.5" />
                    <span>Add Highlight Bullet</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(aboutConfig.highlights || []).map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => {
                          const updated = [...aboutConfig.highlights];
                          updated[idx] = e.target.value;
                          setAboutConfig({ ...aboutConfig, highlights: updated });
                        }}
                        placeholder="e.g. ISO 9001:2015 Quality Management Certified"
                        className="flex-1 px-3 py-1.5 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = aboutConfig.highlights.filter((_, i) => i !== idx);
                          setAboutConfig({ ...aboutConfig, highlights: updated });
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
                        title="Remove highlight"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Mission & Vision */}
            <div className="bg-gray-50 border border-industrial-border rounded-lg p-5 space-y-4">
              <div className="border-b border-industrial-border pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-industrial-dark flex items-center gap-2">
                  <Target className="w-4 h-4 text-industrial-orange" />
                  <span>2. Mission & Vision Statements</span>
                </h3>
                <p className="text-[11px] text-industrial-muted mt-0.5">
                  Core statements defining your company's long-term purpose and strategic aspirations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mission */}
                <div className="space-y-3 bg-white p-4 rounded-lg border border-industrial-border">
                  <div className="flex items-center gap-1.5 font-bold text-industrial-dark uppercase tracking-wider text-xs">
                    <Target className="w-3.5 h-3.5 text-industrial-orange" />
                    <span>Mission Box</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-industrial-muted mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={aboutConfig.missionTitle || 'Our Mission'}
                      onChange={(e) => setAboutConfig({ ...aboutConfig, missionTitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-industrial-muted mb-1">
                      Statement *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={aboutConfig.missionStatement || ''}
                      onChange={(e) => setAboutConfig({ ...aboutConfig, missionStatement: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange leading-relaxed"
                    ></textarea>
                  </div>
                </div>

                {/* Vision */}
                <div className="space-y-3 bg-white p-4 rounded-lg border border-industrial-border">
                  <div className="flex items-center gap-1.5 font-bold text-industrial-dark uppercase tracking-wider text-xs">
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Vision Box</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-industrial-muted mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={aboutConfig.visionTitle || 'Our Vision'}
                      onChange={(e) => setAboutConfig({ ...aboutConfig, visionTitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-industrial-muted mb-1">
                      Statement *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={aboutConfig.visionStatement || ''}
                      onChange={(e) => setAboutConfig({ ...aboutConfig, visionStatement: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange leading-relaxed"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Core Values */}
            <div className="bg-gray-50 border border-industrial-border rounded-lg p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-industrial-border pb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-industrial-dark flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-industrial-orange" />
                    <span>3. Core Values</span>
                  </h3>
                  <p className="text-[11px] text-industrial-muted mt-0.5">
                    Foundational pillars of your engineering workmanship and customer commitment.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newVal: CoreValue = {
                      id: `val-${Date.now()}`,
                      title: 'New Value',
                      description: 'Describe this value and how it guides your manufacturing or delivery.',
                      icon: 'ShieldCheck',
                    };
                    setAboutConfig({
                      ...aboutConfig,
                      values: [...(aboutConfig.values || []), newVal],
                    });
                  }}
                  className="px-3 py-1.5 bg-industrial-slate hover:bg-industrial-dark text-white rounded text-xs font-bold flex items-center gap-1 self-start sm:self-auto transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Value</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={aboutConfig.valuesHeading || 'Our Core Values'}
                    onChange={(e) => setAboutConfig({ ...aboutConfig, valuesHeading: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                  />
                </div>
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Subtitle / Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={aboutConfig.valuesDescription || ''}
                    onChange={(e) => setAboutConfig({ ...aboutConfig, valuesDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                  />
                </div>
              </div>

              {/* Values List */}
              <div className="space-y-3 pt-2">
                {(aboutConfig.values || []).map((val, idx) => (
                  <div
                    key={val.id}
                    className="p-4 bg-white rounded-lg border border-industrial-border shadow-xs space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-industrial-orange uppercase">
                        Value #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = aboutConfig.values.filter((v) => v.id !== val.id);
                          setAboutConfig({ ...aboutConfig, values: updated });
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                        title="Delete value"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-industrial-dark mb-1">
                          Value Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={val.title}
                          onChange={(e) => {
                            const updated = aboutConfig.values.map((v) =>
                              v.id === val.id ? { ...v, title: e.target.value } : v
                            );
                            setAboutConfig({ ...aboutConfig, values: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-industrial-dark mb-1">
                          Icon Style
                        </label>
                        <select
                          value={val.icon || 'ShieldCheck'}
                          onChange={(e) => {
                            const updated = aboutConfig.values.map((v) =>
                              v.id === val.id ? { ...v, icon: e.target.value } : v
                            );
                            setAboutConfig({ ...aboutConfig, values: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-industrial-border rounded focus:outline-none text-xs"
                        >
                          <option value="ShieldCheck">Shield (Engineering Integrity)</option>
                          <option value="Award">Award (Certified Quality)</option>
                          <option value="Users">Users (Customer-Centric)</option>
                          <option value="Truck">Truck (On-Time Logistics)</option>
                          <option value="Target">Target (Precision Focus)</option>
                          <option value="Building2">Building (Infrastructure)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-industrial-dark mb-1">
                        Description *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={val.description}
                        onChange={(e) => {
                          const updated = aboutConfig.values.map((v) =>
                            v.id === val.id ? { ...v, description: e.target.value } : v
                          );
                          setAboutConfig({ ...aboutConfig, values: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange text-xs"
                      ></textarea>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Executive Leadership Team */}
            <div className="bg-gray-50 border border-industrial-border rounded-lg p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-industrial-border pb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-industrial-dark flex items-center gap-2">
                    <Users className="w-4 h-4 text-industrial-orange" />
                    <span>4. Executive Leadership Team</span>
                  </h3>
                  <p className="text-[11px] text-industrial-muted mt-0.5">
                    Profiles of founders, directors, and department heads driving engineering excellence.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newLead: LeadershipMember = {
                      id: `lead-${Date.now()}`,
                      name: '',
                      role: '',
                      bio: '',
                      image: '',
                      linkedin: '',
                      sortOrder: (aboutConfig.leadershipMembers?.length || 0) + 1,
                    };
                    setAboutConfig({
                      ...aboutConfig,
                      leadershipMembers: [...(aboutConfig.leadershipMembers || []), newLead],
                    });
                  }}
                  className="px-3 py-1.5 bg-industrial-slate hover:bg-industrial-dark text-white rounded text-xs font-bold flex items-center gap-1 self-start sm:self-auto transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Leader</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={aboutConfig.leadershipHeading || 'Executive Leadership'}
                    onChange={(e) => setAboutConfig({ ...aboutConfig, leadershipHeading: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                  />
                </div>
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Subtitle / Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={aboutConfig.leadershipDescription || ''}
                    onChange={(e) => setAboutConfig({ ...aboutConfig, leadershipDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                  />
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-4 pt-2">
                {(aboutConfig.leadershipMembers || []).map((member, idx) => (
                  <div
                    key={member.id}
                    className="p-4 bg-white rounded-lg border border-industrial-border shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-[11px] font-bold text-industrial-orange uppercase">
                        Leader #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = aboutConfig.leadershipMembers.filter((m) => m.id !== member.id);
                          setAboutConfig({ ...aboutConfig, leadershipMembers: updated });
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                        title="Delete member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-industrial-dark mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rajesh Sharma"
                          value={member.name}
                          onChange={(e) => {
                            const updated = aboutConfig.leadershipMembers.map((m) =>
                              m.id === member.id ? { ...m, name: e.target.value } : m
                            );
                            setAboutConfig({ ...aboutConfig, leadershipMembers: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-industrial-dark mb-1">
                          Role / Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Managing Director & Founder"
                          value={member.role}
                          onChange={(e) => {
                            const updated = aboutConfig.leadershipMembers.map((m) =>
                              m.id === member.id ? { ...m, role: e.target.value } : m
                            );
                            setAboutConfig({ ...aboutConfig, leadershipMembers: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-industrial-dark mb-1">
                          Photo URL (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="https://... or upload photo"
                          value={member.image || ''}
                          onChange={(e) => {
                            const updated = aboutConfig.leadershipMembers.map((m) =>
                              m.id === member.id ? { ...m, image: e.target.value } : m
                            );
                            setAboutConfig({ ...aboutConfig, leadershipMembers: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange text-xs"
                        />
                        <div className="mt-1.5">
                          <label className="inline-flex items-center px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px] font-semibold cursor-pointer gap-1 transition-colors">
                            <Upload className="w-3 h-3 text-industrial-orange" />
                            <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploading(true);
                                try {
                                  const url = await uploadFile(file, 'leadership', setUploadProgress);
                                  const updated = aboutConfig.leadershipMembers.map((m) =>
                                    m.id === member.id ? { ...m, image: url } : m
                                  );
                                  setAboutConfig({ ...aboutConfig, leadershipMembers: updated });
                                } catch (err: any) {
                                  alert(err.message || 'Upload failed');
                                } finally {
                                  setUploading(false);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-industrial-dark mb-1">
                          LinkedIn Profile Link (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="https://linkedin.com/in/..."
                          value={member.linkedin || ''}
                          onChange={(e) => {
                            const updated = aboutConfig.leadershipMembers.map((m) =>
                              m.id === member.id ? { ...m, linkedin: e.target.value } : m
                            );
                            setAboutConfig({ ...aboutConfig, leadershipMembers: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-industrial-dark mb-1">
                        Professional Bio / Summary (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Brief summary of engineering background and leadership responsibilities..."
                        value={member.bio || ''}
                        onChange={(e) => {
                          const updated = aboutConfig.leadershipMembers.map((m) =>
                            m.id === member.id ? { ...m, bio: e.target.value } : m
                          );
                          setAboutConfig({ ...aboutConfig, leadershipMembers: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange text-xs leading-relaxed"
                      ></textarea>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={aboutSaving}
                className="px-6 py-2.5 bg-industrial-orange hover:bg-industrial-orange-hover disabled:opacity-50 text-white font-bold rounded flex items-center space-x-2 transition-colors uppercase tracking-wider shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{aboutSaving ? 'Saving Changes...' : 'Save About & Leadership Content'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit / Create Form Modal */}
      {entity !== 'settings' && entity !== 'about' && editingItem && (
        <div className="bg-white p-6 rounded-lg border border-industrial-orange shadow-elevated">
          <h2 className="text-base font-bold text-industrial-dark mb-4 border-b border-industrial-border pb-2">
            {isNew ? 'Create New Entry' : 'Edit Selected Entry'}
          </h2>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            
            {/* Category dropdown */}
            {entity === 'products' && (
              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">Product Category *</label>
                <select
                  value={editingItem.categoryId}
                  onChange={(e) => setEditingItem({ ...editingItem, categoryId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {entity === 'documents' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-industrial-dark uppercase tracking-wider">
                      Document Category *
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowCategoryManager(true)}
                        className="text-[11px] text-gray-500 hover:text-industrial-dark hover:underline font-semibold flex items-center"
                        title="Add or delete categories"
                      >
                        <FolderTree className="w-3 h-3 mr-0.5 text-industrial-orange" />
                        Manage List
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !isCustomDocCat;
                          setIsCustomDocCat(next);
                          if (next) {
                            setCustomDocCatInput('');
                            setEditingItem({ ...editingItem, category: '' });
                          } else {
                            setEditingItem({ ...editingItem, category: existingDocCategories[0] || 'Catalogues' });
                          }
                        }}
                        className="text-[11px] text-industrial-orange hover:underline font-bold"
                      >
                        {isCustomDocCat ? '← Pick from list' : '+ Type New'}
                      </button>
                    </div>
                  </div>

                  {isCustomDocCat ? (
                    <input
                      type="text"
                      required
                      placeholder="e.g. Test Reports, Guidelines..."
                      value={customDocCatInput}
                      onChange={(e) => {
                        setCustomDocCatInput(e.target.value);
                        setEditingItem({ ...editingItem, category: e.target.value });
                      }}
                      className="w-full px-3 py-2 bg-white border border-industrial-orange rounded focus:outline-none"
                    />
                  ) : (
                    <select
                      value={editingItem.category || 'Catalogues'}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsCustomDocCat(true);
                          setCustomDocCatInput('');
                          setEditingItem({ ...editingItem, category: '' });
                        } else {
                          setEditingItem({ ...editingItem, category: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                    >
                      {existingDocCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__NEW__">+ Type a new category...</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Issue / Document Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={editingItem.issueDate || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, issueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                  />
                </div>
              </div>
            )}

            {/* Gallery Category & Caption */}
            {entity === 'gallery' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-industrial-dark uppercase tracking-wider">
                      Gallery Category *
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowCategoryManager(true)}
                        className="text-[11px] text-gray-500 hover:text-industrial-dark hover:underline font-semibold flex items-center"
                        title="Add or delete categories"
                      >
                        <FolderTree className="w-3 h-3 mr-0.5 text-industrial-orange" />
                        Manage List
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !isCustomGalleryCat;
                          setIsCustomGalleryCat(next);
                          if (next) {
                            setCustomGalleryCatInput('');
                            setEditingItem({ ...editingItem, category: '' });
                          } else {
                            setEditingItem({ ...editingItem, category: existingGalleryCategories[0] || 'Products' });
                          }
                        }}
                        className="text-[11px] text-industrial-orange hover:underline font-bold"
                      >
                        {isCustomGalleryCat ? '← Pick from list' : '+ Type New'}
                      </button>
                    </div>
                  </div>

                  {isCustomGalleryCat ? (
                    <input
                      type="text"
                      required
                      placeholder="e.g. Field Inspection, CNC Plant..."
                      value={customGalleryCatInput}
                      onChange={(e) => {
                        setCustomGalleryCatInput(e.target.value);
                        setEditingItem({ ...editingItem, category: e.target.value });
                      }}
                      className="w-full px-3 py-2 bg-white border border-industrial-orange rounded focus:outline-none"
                    />
                  ) : (
                    <select
                      value={editingItem.category || 'Products'}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsCustomGalleryCat(true);
                          setCustomGalleryCatInput('');
                          setEditingItem({ ...editingItem, category: '' });
                        } else {
                          setEditingItem({ ...editingItem, category: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                    >
                      {existingGalleryCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__NEW__">+ Type a new category...</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Photo Caption / Tagline (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Precision CNC machining for spherical bearings"
                    value={editingItem.caption || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Certifications fields */}
            {entity === 'certifications' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Issuing Authority *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ISO / TUV / RDSO"
                    value={editingItem.issuingAuthority || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, issuingAuthority: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Certificate Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ISO 9001:2015"
                    value={editingItem.certificateNumber || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, certificateNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Valid Until / Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2028-12-31"
                    value={editingItem.validUntil || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, validUntil: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Blog Post Meta */}
            {entity === 'posts' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Article Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Technical, Engineering, Standards"
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Technical Editorial"
                    value={editingItem.author || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={editingItem.publishDate || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, publishDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Project Meta */}
            {entity === 'projects' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Industry / Sector *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bridges & Highways, Metro Rail"
                    value={editingItem.industry || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, industry: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Project Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={editingItem.location || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Completion Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={editingItem.year || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Title / Name */}
            <div>
              <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                {entity === 'products'
                  ? 'Product Name *'
                  : entity === 'projects'
                  ? 'Project Title *'
                  : entity === 'posts'
                  ? 'Article Title *'
                  : entity === 'certifications'
                  ? 'Certificate Name *'
                  : 'Name / Title *'}
              </label>
              <input
                type="text"
                required
                value={editingItem.name || editingItem.title || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const slug = handleSlugGen(val);
                  setEditingItem({
                    ...editingItem,
                    name: val,
                    title: val,
                    ...(entity !== 'documents' && entity !== 'gallery' && entity !== 'certifications' ? { slug } : {})
                  });
                }}
                className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
              />
            </div>

            {/* Web Link */}
            {editingItem.slug !== undefined && entity !== 'documents' && entity !== 'gallery' && entity !== 'certifications' && (
              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                  Web Link URL Address <span className="text-[10px] text-gray-500 font-normal lowercase">(Automatically generated from title)</span>
                </label>
                <input
                  type="text"
                  value={editingItem.slug}
                  onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none font-mono"
                />
              </div>
            )}

            {/* Upload file */}
            <div>
              <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                {entity === 'documents'
                  ? 'Upload PDF Document *'
                  : entity === 'certifications'
                  ? 'Certificate Thumbnail Image'
                  : 'Image URL'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingItem.featuredImage || editingItem.image || editingItem.heroImage || editingItem.fileUrl || editingItem.thumbnail || editingItem.logo || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    featuredImage: e.target.value,
                    image: e.target.value,
                    heroImage: e.target.value,
                    fileUrl: e.target.value,
                    thumbnail: e.target.value,
                    logo: e.target.value,
                  })}
                  className="flex-1 px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                />
                <label className="px-4 py-2 bg-industrial-dark text-white rounded font-bold cursor-pointer hover:bg-industrial-slate flex items-center transition-colors">
                  <Upload className="w-3.5 h-3.5 mr-1" />
                  <span>Upload file</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(
                      e,
                      entity === 'documents'
                        ? 'fileUrl'
                        : entity === 'projects' || entity === 'posts'
                        ? 'heroImage'
                        : entity === 'certifications'
                        ? 'thumbnail'
                        : entity === 'brands'
                        ? 'logo'
                        : entity === 'products'
                        ? 'featuredImage'
                        : 'image',
                      entity as any
                    )}
                  />
                </label>
              </div>
              {uploading && <div className="text-[10px] text-industrial-orange mt-1">Uploading... {uploadProgress.toFixed(0)}%</div>}
            </div>

            {/* Extra file upload for Certifications (PDF link) */}
            {entity === 'certifications' && (
              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                  Certificate Document (PDF)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="URL to certificate PDF"
                    value={editingItem.pdfUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, pdfUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                  />
                  <label className="px-4 py-2 bg-industrial-dark text-white rounded font-bold cursor-pointer hover:bg-industrial-slate flex items-center transition-colors">
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    <span>Upload PDF</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'pdfUrl', 'certifications')}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Project Case Study Detailed Fields */}
            {entity === 'projects' && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Key Result / Metric Summary
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Supplied 120 pot bearings and 4 modular expansion joints with zero field defects."
                    value={editingItem.shortResult || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, shortResult: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Project Challenge
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe engineering or logistical challenges faced..."
                    value={editingItem.challenge || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, challenge: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Technical Solution & Supplied Hardware
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the solution engineered and supplied..."
                    value={editingItem.solution || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, solution: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Outcome & Client Feedback
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe testing results, on-time installation, and client satisfaction..."
                    value={editingItem.outcome || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, outcome: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Short description / summary */}
            {(editingItem.shortDescription !== undefined || editingItem.summary !== undefined) && entity !== 'projects' && (
              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                  Brief Summary <span className="text-[10px] text-gray-500 font-normal lowercase">(supports Markdown bullet lists - , bold **, line breaks)</span>
                </label>
                <textarea
                  rows={3}
                  value={editingItem.shortDescription !== undefined ? editingItem.shortDescription : editingItem.summary}
                  onChange={(e) => setEditingItem(
                    editingItem.shortDescription !== undefined
                      ? { ...editingItem, shortDescription: e.target.value }
                      : { ...editingItem, summary: e.target.value }
                  )}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                ></textarea>
              </div>
            )}

            {/* Long description / full content */}
            {(editingItem.description !== undefined || editingItem.fullContent !== undefined || editingItem.content !== undefined) && entity !== 'projects' && (
              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                  Detailed Description / Article Body <span className="text-[10px] text-gray-500 font-normal lowercase">(supports Markdown: ## headings, - bullets, **bold**, tables)</span>
                </label>
                <textarea
                  rows={8}
                  value={editingItem.description !== undefined ? editingItem.description : (editingItem.fullContent !== undefined ? editingItem.fullContent : editingItem.content)}
                  onChange={(e) => setEditingItem(
                    editingItem.description !== undefined
                      ? { ...editingItem, description: e.target.value }
                      : (editingItem.fullContent !== undefined ? { ...editingItem, fullContent: e.target.value } : { ...editingItem, content: e.target.value })
                  )}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none font-mono text-xs"
                ></textarea>
              </div>
            )}

            {/* Product Specifications Manager */}
            {entity === 'products' && (
              <div className="bg-gray-50 border border-industrial-border rounded-lg p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-industrial-border pb-2 gap-2">
                  <div>
                    <label className="block font-bold text-industrial-dark uppercase tracking-wider text-xs">
                      Product Specifications
                    </label>
                    <p className="text-[11px] text-gray-500">
                      These parameters populate the <strong>"Key Specifications"</strong> box and the <strong>"Technical Specifications Table"</strong>. Delete all rows to hide specification tables for this product.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentSpecs = Array.isArray(editingItem.specifications) ? editingItem.specifications : [];
                      setEditingItem({
                        ...editingItem,
                        specifications: [...currentSpecs, { key: '', value: '' }],
                      });
                    }}
                    className="px-3 py-1.5 bg-industrial-orange hover:bg-industrial-orange-hover text-white rounded text-xs font-bold flex items-center shrink-0 self-start sm:self-auto transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Add Parameter</span>
                  </button>
                </div>

                {(!editingItem.specifications || editingItem.specifications.length === 0) ? (
                  <div className="text-center py-4 text-gray-400 text-xs italic bg-white rounded border border-dashed border-gray-200">
                    No specifications configured. Click "+ Add Parameter" to add specifications, or leave blank to hide the specifications table on the product page.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="hidden sm:grid grid-cols-12 gap-2 text-[10px] font-bold uppercase text-gray-500 px-1">
                      <div className="col-span-5">Parameter Name</div>
                      <div className="col-span-6">Specification Value</div>
                      <div className="col-span-1 text-right">Action</div>
                    </div>
                    {editingItem.specifications.map((spec: { key: string; value: string }, idx: number) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2 sm:p-0 rounded sm:bg-transparent border sm:border-0 border-gray-200">
                        <input
                          type="text"
                          placeholder="e.g. Material, Load Capacity, Standard"
                          value={spec.key || ''}
                          onChange={(e) => {
                            const updated = [...editingItem.specifications];
                            updated[idx] = { ...updated[idx], key: e.target.value };
                            setEditingItem({ ...editingItem, specifications: updated });
                          }}
                          className="w-full sm:w-5/12 px-3 py-1.5 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange text-xs font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="e.g. High Tensile Steel, 5000 kN, IRC:83"
                          value={spec.value || ''}
                          onChange={(e) => {
                            const updated = [...editingItem.specifications];
                            updated[idx] = { ...updated[idx], value: e.target.value };
                            setEditingItem({ ...editingItem, specifications: updated });
                          }}
                          className="w-full sm:flex-1 px-3 py-1.5 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingItem.specifications.filter((_: any, i: number) => i !== idx);
                            setEditingItem({ ...editingItem, specifications: updated });
                          }}
                          className="self-end sm:self-auto p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
                          title="Delete specification parameter"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Display priority */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100">
              <label className="flex items-center space-x-2 cursor-pointer font-bold text-industrial-dark">
                <input
                  type="checkbox"
                  checked={editingItem.published}
                  onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                  className="rounded text-industrial-orange"
                />
                <span>Show / Visible on Public Website</span>
              </label>

              {editingItem.featured !== undefined && (
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-industrial-dark">
                  <input
                    type="checkbox"
                    checked={editingItem.featured}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    className="rounded text-industrial-orange"
                  />
                  <span>Highlight in "Featured Section" on Home Page</span>
                </label>
              )}

              {editingItem.sortOrder !== undefined && (
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-industrial-dark">Display Priority:</span>
                  <input
                    type="number"
                    value={editingItem.sortOrder}
                    onChange={(e) => setEditingItem({ ...editingItem, sortOrder: parseInt(e.target.value) || 1 })}
                    className="w-16 px-2 py-1 bg-white border border-industrial-border rounded text-center"
                  />
                  <span className="text-[10px] text-gray-500 font-normal">(higher numbers appear first)</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-4 border-t border-industrial-border">
              <button type="submit" className="px-5 py-2.5 bg-industrial-orange hover:bg-industrial-orange-hover text-white font-bold rounded flex items-center space-x-1 transition-colors uppercase tracking-wider">
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2.5 bg-gray-200 text-industrial-dark font-bold rounded transition-colors uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Items Table */}
      {!editingItem && entity !== 'settings' && entity !== 'about' && (
        <div className="bg-white rounded-lg border border-industrial-border shadow-subtle p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-industrial-light text-industrial-dark uppercase font-bold text-[10px] tracking-wider border-b border-industrial-border">
                <tr>
                  <th className="p-3">Title / Name</th>
                  {(entity === 'documents' || entity === 'gallery') && <th className="p-3">Category</th>}
                  {entity === 'certifications' && <th className="p-3">Issuing Authority</th>}
                  {entity !== 'documents' && entity !== 'gallery' && entity !== 'certifications' && <th className="p-3">Web Link URL</th>}
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-border">
                {items
                  .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-semibold text-industrial-dark">{item.name || item.title}</td>
                      {(entity === 'documents' || entity === 'gallery') && (
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-industrial-light text-industrial-dark border border-industrial-border">
                            {item.category || 'General'}
                          </span>
                        </td>
                      )}
                      {entity === 'certifications' && (
                        <td className="p-3 text-industrial-dark font-medium">
                          {item.issuingAuthority} {item.certificateNumber ? `(${item.certificateNumber})` : ''}
                        </td>
                      )}
                      {entity !== 'documents' && entity !== 'gallery' && entity !== 'certifications' && (
                        <td className="p-3 font-mono text-gray-500 text-[10px]">/{item.slug || item.id}</td>
                      )}
                      <td className="p-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            item.published
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.published ? 'Visible' : 'Hidden / Draft'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => { setIsNew(false); setIsCustomDocCat(false); setCustomDocCatInput(''); setEditingItem(item); }}
                          className="p-1.5 bg-industrial-light text-industrial-dark hover:bg-industrial-orange hover:text-white rounded transition-colors inline-flex items-center"
                          title="Edit Entry"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name || item.title)}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded transition-colors inline-flex items-center"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-industrial-muted">
                      No entries found. Click "Add New Item" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {items.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-center space-x-2 pt-4 border-t border-industrial-border mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 rounded border border-industrial-border bg-white text-industrial-dark disabled:opacity-40 hover:bg-industrial-light transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: Math.ceil(items.length / ITEMS_PER_PAGE) }).map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
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
                disabled={currentPage === Math.ceil(items.length / ITEMS_PER_PAGE)}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 rounded border border-industrial-border bg-white text-industrial-dark disabled:opacity-40 hover:bg-industrial-light transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-elevated border border-industrial-border max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-industrial-border pb-3">
              <div className="flex items-center space-x-2">
                <FolderTree className="w-5 h-5 text-industrial-orange" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-industrial-dark">
                  Manage {isGalleryEntity ? 'Gallery' : 'Document'} Categories
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCategoryManager(false)}
                className="p-1 text-gray-400 hover:text-industrial-dark transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add New Category form */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-industrial-dark mb-1">
                Add New Category
              </label>
              <form onSubmit={handleCreateCategory} className="flex gap-2">
                <input
                  type="text"
                  placeholder={
                    isGalleryEntity
                      ? 'e.g. Factory Tours, Proof Load Testing...'
                      : 'e.g. Safety Standards, Test Reports...'
                  }
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-industrial-border rounded text-xs focus:outline-none focus:border-industrial-orange"
                  required
                />
                <button
                  type="submit"
                  disabled={categoryActionLoading || !newCategoryName.trim()}
                  className="px-4 py-2 bg-industrial-orange hover:bg-industrial-orange-hover disabled:opacity-50 text-white text-xs font-bold rounded flex items-center transition-colors uppercase tracking-wider shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Add</span>
                </button>
              </form>
            </div>

            {/* List of existing categories with delete action */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-industrial-dark mb-2">
                Existing Categories ({currentCategoryList.length})
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 divide-y divide-gray-100">
                {currentCategoryList.map((cat) => {
                  const itemCount = items.filter((d) => d.category === cat).length;
                  const countLabel = isGalleryEntity
                    ? itemCount === 1 ? 'photo' : 'photos'
                    : itemCount === 1 ? 'doc' : 'docs';

                  return (
                    <div
                      key={cat}
                      className="flex items-center justify-between py-2 px-3 bg-industrial-light/60 hover:bg-industrial-light rounded border border-industrial-border transition-colors text-xs"
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="font-bold text-industrial-dark truncate">{cat}</span>
                        <span className="text-[10px] text-gray-500 font-medium px-2 py-0.5 rounded-full bg-white border border-gray-200 shrink-0">
                          {itemCount} {countLabel}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={categoryActionLoading || currentCategoryList.length <= 1}
                        onClick={() => handleDeleteCategory(cat, itemCount)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                        title={
                          currentCategoryList.length <= 1
                            ? 'Cannot delete the only remaining category'
                            : `Delete "${cat}"`
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-industrial-border">
              <button
                type="button"
                onClick={() => setShowCategoryManager(false)}
                className="px-5 py-2 bg-industrial-dark hover:bg-industrial-slate text-white text-xs font-bold rounded uppercase tracking-wider transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
