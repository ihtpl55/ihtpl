import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { DocumentItem } from '../types';

const STORAGE_KEY = 'infinite_documents';
const CATEGORIES_KEY = 'infinite_doc_categories';

export const DEFAULT_DOCUMENT_CATEGORIES = [
  'Certifications',
  'Catalogues',
  'Technical Documents',
  'Approvals',
  'Company Documents'
];

export const getDocumentCategories = async (): Promise<string[]> => {
  let categories: string[] = [];

  if (USE_DEMO_DATA) {
    const saved = localStorage.getItem(CATEGORIES_KEY);
    categories = saved ? JSON.parse(saved) : DEFAULT_DOCUMENT_CATEGORIES;
  } else if (db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'document_categories'));
      if (snap.exists() && Array.isArray(snap.data()?.categories)) {
        categories = snap.data()?.categories;
      } else {
        categories = DEFAULT_DOCUMENT_CATEGORIES;
        setDoc(doc(db, 'settings', 'document_categories'), { categories: DEFAULT_DOCUMENT_CATEGORIES }, { merge: true }).catch(() => {});
      }
    } catch {
      categories = DEFAULT_DOCUMENT_CATEGORIES;
    }
  } else {
    categories = DEFAULT_DOCUMENT_CATEGORIES;
  }

  return categories;
};

export const saveDocumentCategory = async (newCategory: string): Promise<string[]> => {
  const trimmed = newCategory.trim();
  if (!trimmed) return getDocumentCategories();

  const current = await getDocumentCategories();
  if (current.includes(trimmed)) return current;

  const updated = [...current, trimmed];
  if (USE_DEMO_DATA) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
  } else if (db) {
    await setDoc(doc(db, 'settings', 'document_categories'), { categories: updated }, { merge: true });
  }
  return updated;
};

export const deleteDocumentCategory = async (categoryToDelete: string): Promise<string[]> => {
  const current = await getDocumentCategories();
  const updated = current.filter((c) => c !== categoryToDelete);
  const finalCategories = updated.length > 0 ? updated : ['Catalogues'];
  const fallbackCategory = finalCategories[0];

  if (USE_DEMO_DATA) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(finalCategories));
    const docs = getLocalDocuments();
    let changed = false;
    docs.forEach((d) => {
      if (d.category === categoryToDelete) {
        d.category = fallbackCategory;
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    }
    return finalCategories;
  }

  if (db) {
    const firestoreDb = db;
    await setDoc(doc(firestoreDb, 'settings', 'document_categories'), { categories: finalCategories });

    try {
      const snap = await getDocs(query(collection(firestoreDb, 'documents'), where('category', '==', categoryToDelete)));
      const promises = snap.docs.map((d) =>
        setDoc(doc(firestoreDb, 'documents', d.id), { category: fallbackCategory }, { merge: true })
      );
      await Promise.all(promises);
    } catch (err) {
      console.warn('Could not reassign documents for deleted category', err);
    }
  }

  return finalCategories;
};

const getLocalDocuments = (): DocumentItem[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const getDocuments = async (publicOnly = true): Promise<DocumentItem[]> => {
  if (USE_DEMO_DATA) {
    const list = getLocalDocuments();
    return publicOnly ? list.filter(d => d.published) : list;
  }

  if (!db) throw new Error('Firestore not initialized');
  const q = query(collection(db, 'documents'), orderBy('sortOrder', 'asc'));
  const snap = await getDocs(q);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as DocumentItem));
  return publicOnly ? list.filter(d => d.published) : list;
};

export const saveDocument = async (item: Partial<DocumentItem> & { title: string; fileUrl: string }): Promise<DocumentItem> => {
  const id = item.id || `doc-${Date.now()}`;
  const category = item.category || 'Catalogues';

  const docToSave: DocumentItem = {
    id,
    title: item.title,
    category,
    fileUrl: item.fileUrl,
    storagePath: item.storagePath || '',
    fileType: item.fileType || 'PDF',
    size: item.size || '1.0 MB',
    issueDate: item.issueDate || new Date().toISOString().split('T')[0],
    published: item.published ?? true,
    sortOrder: item.sortOrder ?? 1,
  };

  if (category) {
    await saveDocumentCategory(category);
  }

  if (USE_DEMO_DATA) {
    const list = getLocalDocuments();
    const idx = list.findIndex(d => d.id === id);
    if (idx >= 0) list[idx] = docToSave;
    else list.push(docToSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return docToSave;
  }

  if (!db) throw new Error('Firestore not initialized');
  await setDoc(doc(db, 'documents', id), docToSave, { merge: true });
  return docToSave;
};

export const deleteDocument = async (id: string): Promise<void> => {
  if (USE_DEMO_DATA) {
    const list = getLocalDocuments().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, 'documents', id));
};
