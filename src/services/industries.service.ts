import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { Industry } from '../types';
import { initialIndustries } from '../data/seedData';

const STORAGE_KEY = 'apex_industries';

const getLocalIndustries = (): Industry[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialIndustries;
};

export const getIndustries = async (publicOnly = true): Promise<Industry[]> => {
  if (USE_DEMO_DATA) {
    const list = getLocalIndustries();
    return publicOnly ? list.filter(i => i.published) : list;
  }

  if (!db) throw new Error('Firestore not initialized');
  const q = query(collection(db, 'industries'), orderBy('sortOrder', 'asc'));
  const snap = await getDocs(q);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Industry));
  return publicOnly ? list.filter(i => i.published) : list;
};

export const saveIndustry = async (item: Partial<Industry> & { title: string; slug: string }): Promise<Industry> => {
  const id = item.id || `ind-${Date.now()}`;
  const industryToSave: Industry = {
    id,
    title: item.title,
    slug: item.slug,
    shortDescription: item.shortDescription || '',
    image: item.image || '',
    sortOrder: item.sortOrder ?? 1,
    published: item.published ?? true,
  };

  if (USE_DEMO_DATA) {
    const list = getLocalIndustries();
    const idx = list.findIndex(i => i.id === id);
    if (idx >= 0) list[idx] = industryToSave;
    else list.push(industryToSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return industryToSave;
  }

  if (!db) throw new Error('Firestore not initialized');
  await setDoc(doc(db, 'industries', id), industryToSave, { merge: true });
  return industryToSave;
};

export const deleteIndustry = async (id: string): Promise<void> => {
  if (USE_DEMO_DATA) {
    const list = getLocalIndustries().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, 'industries', id));
};
