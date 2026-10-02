import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { Brand } from '../types';
import { initialBrands } from '../data/seedData';

const STORAGE_KEY = 'apex_brands';

const getLocalBrands = (): Brand[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialBrands;
};

export const getBrands = async (publicOnly = true): Promise<Brand[]> => {
  if (USE_DEMO_DATA) {
    const list = getLocalBrands();
    return publicOnly ? list.filter(b => b.published) : list;
  }

  if (!db) throw new Error('Firestore not initialized');
  const q = query(collection(db, 'brands'), orderBy('sortOrder', 'asc'));
  const snap = await getDocs(q);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Brand));
  return publicOnly ? list.filter(b => b.published) : list;
};

export const saveBrand = async (brand: Partial<Brand> & { name: string }): Promise<Brand> => {
  const id = brand.id || `brand-${Date.now()}`;
  const brandToSave: Brand = {
    id,
    name: brand.name,
    logo: brand.logo || '',
    description: brand.description || '',
    sortOrder: brand.sortOrder ?? 1,
    published: brand.published ?? true,
  };

  if (USE_DEMO_DATA) {
    const list = getLocalBrands();
    const idx = list.findIndex(b => b.id === id);
    if (idx >= 0) list[idx] = brandToSave;
    else list.push(brandToSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return brandToSave;
  }

  if (!db) throw new Error('Firestore not initialized');
  await setDoc(doc(db, 'brands', id), brandToSave, { merge: true });
  return brandToSave;
};

export const deleteBrand = async (id: string): Promise<void> => {
  if (USE_DEMO_DATA) {
    const list = getLocalBrands().filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, 'brands', id));
};
