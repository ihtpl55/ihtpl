import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { Product } from '../types';
import { initialProducts } from '../data/seedData';

const STORAGE_KEY = 'apex_products';

const getLocalProducts = (): Product[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialProducts;
};

export const getProducts = async (publicOnly = true): Promise<Product[]> => {
  if (USE_DEMO_DATA) {
    const list = getLocalProducts();
    return publicOnly ? list.filter(p => p.published) : list;
  }

  if (!db) throw new Error('Firestore not initialized');
  const q = query(collection(db, 'products'), orderBy('sortOrder', 'asc'));
  const snap = await getDocs(q);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  return publicOnly ? list.filter(p => p.published) : list;
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const products = await getProducts(false);
  return products.find(p => p.slug === slug) || null;
};

export const saveProduct = async (product: Partial<Product> & { name: string; slug: string }): Promise<Product> => {
  const id = product.id || `prod-${Date.now()}`;
  const now = new Date().toISOString();
  
  const productToSave: Product = {
    id,
    name: product.name,
    slug: product.slug,
    categoryId: product.categoryId || '',
    categoryName: product.categoryName || '',
    brandId: product.brandId || '',
    brandName: product.brandName || '',
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    featuredImage: product.featuredImage || '',
    galleryImages: product.galleryImages || [],
    specifications: product.specifications || [],
    documents: product.documents || [],
    featured: product.featured ?? false,
    published: product.published ?? true,
    sortOrder: product.sortOrder ?? 1,
    createdAt: product.createdAt || now,
    updatedAt: now,
  };

  if (USE_DEMO_DATA) {
    const list = getLocalProducts();
    const idx = list.findIndex(p => p.id === id);
    if (idx >= 0) list[idx] = productToSave;
    else list.push(productToSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return productToSave;
  }

  if (!db) throw new Error('Firestore not initialized');
  await setDoc(doc(db, 'products', id), productToSave, { merge: true });
  return productToSave;
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (USE_DEMO_DATA) {
    const list = getLocalProducts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, 'products', id));
};
