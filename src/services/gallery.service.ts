import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { GalleryItem } from '../types';
import { initialGalleryItems } from '../data/seedData';

const STORAGE_KEY = 'apex_gallery';

const getLocalGallery = (): GalleryItem[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialGalleryItems;
};

export const getGalleryItems = async (publicOnly = true): Promise<GalleryItem[]> => {
  if (USE_DEMO_DATA) {
    const list = getLocalGallery();
    return publicOnly ? list.filter(g => g.published) : list;
  }

  if (!db) throw new Error('Firestore not initialized');
  const q = query(collection(db, 'gallery'), orderBy('sortOrder', 'asc'));
  const snap = await getDocs(q);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
  return publicOnly ? list.filter(g => g.published) : list;
};

export const saveGalleryItem = async (item: Partial<GalleryItem> & { title: string; image: string }): Promise<GalleryItem> => {
  const id = item.id || `gal-${Date.now()}`;
  const galleryToSave: GalleryItem = {
    id,
    title: item.title,
    category: item.category || 'Products',
    image: item.image,
    caption: item.caption || '',
    published: item.published ?? true,
    sortOrder: item.sortOrder ?? 1,
  };

  if (USE_DEMO_DATA) {
    const list = getLocalGallery();
    const idx = list.findIndex(g => g.id === id);
    if (idx >= 0) list[idx] = galleryToSave;
    else list.push(galleryToSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return galleryToSave;
  }

  if (!db) throw new Error('Firestore not initialized');
  await setDoc(doc(db, 'gallery', id), galleryToSave, { merge: true });
  return galleryToSave;
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
  if (USE_DEMO_DATA) {
    const list = getLocalGallery().filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, 'gallery', id));
};
