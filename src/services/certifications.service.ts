import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { Certification } from '../types';
import { initialCertifications } from '../data/seedData';

const STORAGE_KEY = 'apex_certifications';

const getLocalCertifications = (): Certification[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialCertifications;
};

export const getCertifications = async (publicOnly = true): Promise<Certification[]> => {
  if (USE_DEMO_DATA) {
    const list = getLocalCertifications();
    return publicOnly ? list.filter(c => c.published) : list;
  }

  if (!db) throw new Error('Firestore not initialized');
  const q = query(collection(db, 'certifications'), orderBy('sortOrder', 'asc'));
  const snap = await getDocs(q);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Certification));
  return publicOnly ? list.filter(c => c.published) : list;
};

export const saveCertification = async (item: Partial<Certification> & { title: string; issuingAuthority: string }): Promise<Certification> => {
  const id = item.id || `cert-${Date.now()}`;
  const certToSave: Certification = {
    id,
    title: item.title,
    issuingAuthority: item.issuingAuthority,
    certificateNumber: item.certificateNumber || '',
    validUntil: item.validUntil || '',
    thumbnail: item.thumbnail || '',
    pdfUrl: item.pdfUrl || '',
    published: item.published ?? true,
    sortOrder: item.sortOrder ?? 1,
  };

  if (USE_DEMO_DATA) {
    const list = getLocalCertifications();
    const idx = list.findIndex(c => c.id === id);
    if (idx >= 0) list[idx] = certToSave;
    else list.push(certToSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return certToSave;
  }

  if (!db) throw new Error('Firestore not initialized');
  await setDoc(doc(db, 'certifications', id), certToSave, { merge: true });
  return certToSave;
};

export const deleteCertification = async (id: string): Promise<void> => {
  if (USE_DEMO_DATA) {
    const list = getLocalCertifications().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, 'certifications', id));
};
