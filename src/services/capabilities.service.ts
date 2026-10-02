import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { Capability } from '../types';
import { initialCapabilities } from '../data/seedData';

const STORAGE_KEY = 'apex_capabilities';

const getLocalCapabilities = (): Capability[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialCapabilities;
};

export const getCapabilities = async (publicOnly = true): Promise<Capability[]> => {
  if (USE_DEMO_DATA) {
    const list = getLocalCapabilities();
    return publicOnly ? list.filter(c => c.published) : list;
  }

  if (!db) throw new Error('Firestore not initialized');
  const q = query(collection(db, 'capabilities'), orderBy('sortOrder', 'asc'));
  const snap = await getDocs(q);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Capability));
  return publicOnly ? list.filter(c => c.published) : list;
};

export const getCapabilityBySlug = async (slug: string): Promise<Capability | null> => {
  const list = await getCapabilities(false);
  return list.find(c => c.slug === slug) || null;
};

export const saveCapability = async (item: Partial<Capability> & { title: string; slug: string }): Promise<Capability> => {
  const id = item.id || `cap-${Date.now()}`;
  const capabilityToSave: Capability = {
    id,
    title: item.title,
    slug: item.slug,
    shortDescription: item.shortDescription || '',
    fullContent: item.fullContent || '',
    image: item.image || '',
    sortOrder: item.sortOrder ?? 1,
    published: item.published ?? true,
  };

  if (USE_DEMO_DATA) {
    const list = getLocalCapabilities();
    const idx = list.findIndex(c => c.id === id);
    if (idx >= 0) list[idx] = capabilityToSave;
    else list.push(capabilityToSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return capabilityToSave;
  }

  if (!db) throw new Error('Firestore not initialized');
  await setDoc(doc(db, 'capabilities', id), capabilityToSave, { merge: true });
  return capabilityToSave;
};

export const deleteCapability = async (id: string): Promise<void> => {
  if (USE_DEMO_DATA) {
    const list = getLocalCapabilities().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, 'capabilities', id));
};
