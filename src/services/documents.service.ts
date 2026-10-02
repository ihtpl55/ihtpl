import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { DocumentItem } from '../types';
import { initialDocuments } from '../data/seedData';

const STORAGE_KEY = 'apex_documents';

const getLocalDocuments = (): DocumentItem[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialDocuments;
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
  const docToSave: DocumentItem = {
    id,
    title: item.title,
    category: item.category || 'Technical Documents',
    fileUrl: item.fileUrl,
    storagePath: item.storagePath || '',
    fileType: item.fileType || 'PDF',
    size: item.size || '1.0 MB',
    issueDate: item.issueDate || new Date().toISOString().split('T')[0],
    published: item.published ?? true,
    sortOrder: item.sortOrder ?? 1,
  };

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
