import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trash2, Edit3, Upload, CheckCircle, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts, saveProduct, deleteProduct } from '../services/products.service';
import { getCategories, saveCategory, deleteCategory } from '../services/categories.service';
import { getBrands, saveBrand, deleteBrand } from '../services/brands.service';
import { getProjects, saveProject, deleteProject } from '../services/projects.service';
import { getDocuments, saveDocument, deleteDocument } from '../services/documents.service';
import { getSiteSettings, updateSiteSettings } from '../services/settings.service';
import { uploadFile } from '../services/storage.service';
import { Product, Category, Brand, Project, SiteSettings } from '../types';

export const AdminCRUD: React.FC = () => {
  const { entity } = useParams<{ entity: string }>();

  const [items, setItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [settingsItem, setSettingsItem] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
    loadEntityData();
  }, [entity]);

  const loadEntityData = async () => {
    setEditingItem(null);
    setSettingsItem(null);
    setMessage('');

    if (entity === 'settings') {
      const settings = await getSiteSettings(true);
      setSettingsItem(settings);
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
        setItems(await getDocuments(false));
      }
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
        brandId: brands[0]?.id || '',
        brandName: brands[0]?.name || '',
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
      setEditingItem({ title: '', slug: '', industry: 'Bridges & Roads', location: '', year: new Date().getFullYear().toString(), shortResult: '', challenge: '', solution: '', outcome: '', heroImage: '', published: true });
    } else if (entity === 'documents') {
      setEditingItem({ title: '', category: 'Catalogues', fileUrl: '', fileType: 'PDF', size: '1.0 MB', published: true });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (entity === 'products') {
      const selectedCat = categories.find(c => c.id === editingItem.categoryId);
      const selectedBnd = brands.find(b => b.id === editingItem.brandId);
      const updatedItem = {
        ...editingItem,
        categoryName: selectedCat ? selectedCat.name : editingItem.categoryName,
        brandName: selectedBnd ? selectedBnd.name : editingItem.brandName,
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

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    if (entity === 'products') await deleteProduct(id);
    else if (entity === 'categories') await deleteCategory(id);
    else if (entity === 'brands') await deleteBrand(id);
    else if (entity === 'projects') await deleteProject(id);
    else if (entity === 'documents') await deleteDocument(id);
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
            {entity === 'settings' ? 'Configure Website Settings' : `Manage ${entity}`}
          </h1>
          <p className="text-xs text-industrial-muted mt-0.5">
            {entity === 'settings'
              ? 'Update contact details, office address, branding logo, and page footer options'
              : `Create, edit, or delete listings in the ${entity} directory`}
          </p>
        </div>

        {entity !== 'settings' && !editingItem && (
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-industrial-orange hover:bg-industrial-orange-hover text-white text-xs font-bold rounded flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </button>
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

      {/* Edit / Create Form Modal */}
      {entity !== 'settings' && editingItem && (
        <div className="bg-white p-6 rounded-lg border border-industrial-orange shadow-elevated">
          <h2 className="text-base font-bold text-industrial-dark mb-4 border-b border-industrial-border pb-2">
            {isNew ? 'Create New Entry' : 'Edit Selected Entry'}
          </h2>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            
            {/* Category dropdowns */}
            {entity === 'products' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">Product Category</label>
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
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">Manufacturer / Brand</label>
                  <select
                    value={editingItem.brandId}
                    onChange={(e) => setEditingItem({ ...editingItem, brandId: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                  >
                    <option value="">No Brand (Generic / Infinite Hardware)</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {entity === 'documents' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                    Document Category *
                  </label>
                  <select
                    value={editingItem.category || 'Catalogues'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
                  >
                    <option value="Certifications">Certifications</option>
                    <option value="Catalogues">Catalogues</option>
                    <option value="Technical Documents">Technical Documents</option>
                    <option value="Approvals">Approvals</option>
                    <option value="Company Documents">Company Documents</option>
                  </select>
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

            {/* Title / Name */}
            <div>
              <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                {entity === 'products' ? 'Product Name *' : entity === 'projects' ? 'Project Title *' : 'Name / Title *'}
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
                    ...(entity !== 'documents' ? { slug } : {})
                  });
                }}
                className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none focus:border-industrial-orange"
              />
            </div>

            {/* Web Link */}
            {editingItem.slug !== undefined && entity !== 'documents' && (
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
                {entity === 'documents' ? 'Upload PDF Document *' : 'Image URL'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingItem.featuredImage || editingItem.image || editingItem.heroImage || editingItem.fileUrl || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    featuredImage: e.target.value,
                    image: e.target.value,
                    heroImage: e.target.value,
                    fileUrl: e.target.value
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
                      entity === 'documents' ? 'fileUrl' : entity === 'projects' ? 'heroImage' : entity === 'categories' ? 'image' : 'featuredImage',
                      entity as any
                    )}
                  />
                </label>
              </div>
              {uploading && <div className="text-[10px] text-industrial-orange mt-1">Uploading... {uploadProgress.toFixed(0)}%</div>}
            </div>

            {/* Short description */}
            {editingItem.shortDescription !== undefined && (
              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                  Brief Summary <span className="text-[10px] text-gray-500 font-normal lowercase">(1-2 sentences for list view)</span>
                </label>
                <textarea
                  rows={2}
                  value={editingItem.shortDescription}
                  onChange={(e) => setEditingItem({ ...editingItem, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                ></textarea>
              </div>
            )}

            {/* Long description */}
            {(editingItem.description !== undefined || editingItem.fullContent !== undefined) && (
              <div>
                <label className="block font-bold text-industrial-dark uppercase tracking-wider mb-1">
                  Detailed Description / Main Text
                </label>
                <textarea
                  rows={6}
                  value={editingItem.description !== undefined ? editingItem.description : editingItem.fullContent}
                  onChange={(e) => setEditingItem(
                    editingItem.description !== undefined
                      ? { ...editingItem, description: e.target.value }
                      : { ...editingItem, fullContent: e.target.value }
                  )}
                  className="w-full px-3 py-2 bg-white border border-industrial-border rounded focus:outline-none"
                ></textarea>
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
      {!editingItem && entity !== 'settings' && (
        <div className="bg-white rounded-lg border border-industrial-border shadow-subtle p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-industrial-light text-industrial-dark uppercase font-bold text-[10px] tracking-wider border-b border-industrial-border">
                <tr>
                  <th className="p-3">Title / Name</th>
                  {entity === 'documents' && <th className="p-3">Category</th>}
                  {entity !== 'documents' && <th className="p-3">Web Link URL</th>}
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
                      {entity === 'documents' && (
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-industrial-light text-industrial-dark border border-industrial-border">
                            {item.category || 'Catalogues'}
                          </span>
                        </td>
                      )}
                      {entity !== 'documents' && (
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
                          onClick={() => { setIsNew(false); setEditingItem(item); }}
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

    </div>
  );
};
