import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { GalleryItem } from '../types';

const STORAGE_KEY = 'infinite_gallery';
const CATEGORIES_KEY = 'infinite_gallery_categories';

export const DEFAULT_GALLERY_CATEGORIES = [
  'Products',
  'Projects',
  'Facilities',
  'Deliveries',
  'Warehouse',
  'Events',
];

export const getGalleryCategories = async (): Promise<string[]> => {
  let categories: string[] = [];

  if (USE_DEMO_DATA) {
    const saved = localStorage.getItem(CATEGORIES_KEY);
    categories = saved ? JSON.parse(saved) : DEFAULT_GALLERY_CATEGORIES;
  } else if (db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'general'));
      if (snap.exists() && Array.isArray(snap.data()?.galleryCategories) && snap.data()?.galleryCategories.length > 0) {
        categories = snap.data()?.galleryCategories;
      } else {
        categories = DEFAULT_GALLERY_CATEGORIES;
        setDoc(doc(db, 'settings', 'general'), { galleryCategories: DEFAULT_GALLERY_CATEGORIES }, { merge: true }).catch(() => {});
      }
    } catch {
      categories = DEFAULT_GALLERY_CATEGORIES;
    }
  } else {
    categories = DEFAULT_GALLERY_CATEGORIES;
  }

  if (!categories || categories.length === 0) {
    const saved = localStorage.getItem(CATEGORIES_KEY);
    categories = saved ? JSON.parse(saved) : DEFAULT_GALLERY_CATEGORIES;
  }

  return categories;
};

export const saveGalleryCategory = async (newCategory: string): Promise<string[]> => {
  const trimmed = newCategory.trim();
  if (!trimmed) return getGalleryCategories();

  const current = await getGalleryCategories();
  if (current.includes(trimmed)) return current;

  const updated = [...current, trimmed];
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));

  if (db) {
    try {
      await setDoc(doc(db, 'settings', 'general'), { galleryCategories: updated }, { merge: true });
    } catch (err) {
      console.warn('Could not save category to settings/general:', err);
    }
  }
  return updated;
};

export const deleteGalleryCategory = async (categoryToDelete: string): Promise<string[]> => {
  const current = await getGalleryCategories();
  const updated = current.filter((c) => c !== categoryToDelete);
  const finalCategories = updated.length > 0 ? updated : ['Products'];
  const fallbackCategory = finalCategories[0];

  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(finalCategories));

  if (USE_DEMO_DATA) {
    const items = getLocalGallery();
    let changed = false;
    items.forEach((item) => {
      if (item.category === categoryToDelete) {
        item.category = fallbackCategory;
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
    return finalCategories;
  }

  if (db) {
    const firestoreDb = db;
    try {
      await setDoc(doc(firestoreDb, 'settings', 'general'), { galleryCategories: finalCategories }, { merge: true });
    } catch (err) {
      console.warn('Could not save updated gallery categories list to settings/general:', err);
    }

    try {
      const snap = await getDocs(collection(firestoreDb, 'gallery'));
      const matchingItems = snap.docs.filter((d) => d.data().category === categoryToDelete);
      const promises = matchingItems.map((d) =>
        setDoc(doc(firestoreDb, 'gallery', d.id), { category: fallbackCategory }, { merge: true })
      );
      await Promise.all(promises);
    } catch (err) {
      console.warn('Could not reassign gallery items for deleted category:', err);
    }
  }

  return finalCategories;
};

const getLocalGallery = (): GalleryItem[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
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
  const category = (item.category || 'Products').trim();

  const galleryToSave: GalleryItem = {
    id,
    title: item.title,
    category,
    image: item.image,
    caption: item.caption || '',
    published: item.published ?? true,
    sortOrder: item.sortOrder ?? 1,
  };

  if (category) {
    await saveGalleryCategory(category);
  }

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

