import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { Category } from '../types';
import { initialCategories } from '../data/seedData';

const STORAGE_KEY = 'apex_categories';

const getLocalCategories = (): Category[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialCategories;
};

export const getCategories = async (publicOnly = true): Promise<Category[]> => {
  if (USE_DEMO_DATA) {
    const list = getLocalCategories();
    return publicOnly ? list.filter(c => c.published) : list;
  }

  if (!db) throw new Error('Firestore not initialized');
  const q = query(collection(db, 'categories'), orderBy('sortOrder', 'asc'));
  const snap = await getDocs(q);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
  return publicOnly ? list.filter(c => c.published) : list;
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const categories = await getCategories(false);
  return categories.find(c => c.slug === slug) || null;
};

export const saveCategory = async (cat: Partial<Category> & { name: string; slug: string }): Promise<Category> => {
  const id = cat.id || `cat-${Date.now()}`;
  const categoryToSave: Category = {
    id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    image: cat.image || '',
    productCount: cat.productCount || 0,
    sortOrder: cat.sortOrder ?? 1,
    published: cat.published ?? true,
  };

  if (USE_DEMO_DATA) {
    const list = getLocalCategories();
    const idx = list.findIndex(c => c.id === id);
    if (idx >= 0) list[idx] = categoryToSave;
    else list.push(categoryToSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return categoryToSave;
  }

  if (!db) throw new Error('Firestore not initialized');
  await setDoc(doc(db, 'categories', id), categoryToSave, { merge: true });
  return categoryToSave;
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (USE_DEMO_DATA) {
    const list = getLocalCategories().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, 'categories', id));
};
