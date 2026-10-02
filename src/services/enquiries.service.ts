import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { Enquiry, EnquiryStatus } from '../types';

const STORAGE_KEY = 'apex_enquiries';

const getLocalEnquiries = (): Enquiry[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const submitEnquiry = async (data: Omit<Enquiry, 'id' | 'status' | 'createdAt'>): Promise<{ success: boolean; error?: string }> => {
  // Honeypot anti-spam check
  if (data.honeypot) {
    console.warn('Bot detected via honeypot field');
    return { success: true }; // Fake success to mislead bot
  }

  // Client side validation
  if (!data.name.trim() || !data.email.trim() || !data.phone.trim() || !data.message.trim()) {
    return { success: false, error: 'Please complete all required fields.' };
  }

  const newEnquiry: Enquiry = {
    id: `enq-${Date.now()}`,
    name: data.name.trim().slice(0, 100),
    company: (data.company || '').trim().slice(0, 150),
    phone: data.phone.trim().slice(0, 50),
    email: data.email.trim().slice(0, 150),
    subject: (data.subject || 'Product Enquiry').trim().slice(0, 200),
    message: data.message.trim().slice(0, 3000),
    productName: data.productName ? data.productName.trim().slice(0, 200) : undefined,
    requirementType: data.requirementType ? data.requirementType.trim().slice(0, 100) : undefined,
    status: 'New',
    createdAt: new Date().toISOString(),
  };

  if (USE_DEMO_DATA) {
    const list = getLocalEnquiries();
    list.unshift(newEnquiry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return { success: true };
  }

  if (!db) throw new Error('Firestore not initialized');
  try {
    const docRef = doc(collection(db, 'enquiries'));
    await setDoc(docRef, {
      name: newEnquiry.name,
      company: newEnquiry.company,
      phone: newEnquiry.phone,
      email: newEnquiry.email,
      subject: newEnquiry.subject,
      message: newEnquiry.message,
      productName: newEnquiry.productName || null,
      requirementType: newEnquiry.requirementType || null,
      status: 'New',
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (err: any) {
    console.error('Failed to submit enquiry to Firestore', err);
    return { success: false, error: err.message || 'Failed to submit enquiry.' };
  }
};

export const getEnquiries = async (): Promise<Enquiry[]> => {
  if (USE_DEMO_DATA) {
    return getLocalEnquiries();
  }

  if (!db) throw new Error('Firestore not initialized');
  const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      company: data.company,
      phone: data.phone,
      email: data.email,
      subject: data.subject,
      message: data.message,
      productName: data.productName,
      requirementType: data.requirementType,
      status: data.status as EnquiryStatus,
      createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
    };
  });
};

export const updateEnquiryStatus = async (id: string, status: EnquiryStatus): Promise<void> => {
  if (USE_DEMO_DATA) {
    const list = getLocalEnquiries();
    const item = list.find(e => e.id === id);
    if (item) item.status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  await setDoc(doc(db, 'enquiries', id), { status }, { merge: true });
};

export const deleteEnquiry = async (id: string): Promise<void> => {
  if (USE_DEMO_DATA) {
    const list = getLocalEnquiries().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, 'enquiries', id));
};
