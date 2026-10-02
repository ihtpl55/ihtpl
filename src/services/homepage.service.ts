import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { HomepageConfig } from '../types';
import { initialHomepageConfig } from '../data/seedData';

const STORAGE_KEY = 'apex_homepage_config';

export const getHomepageConfig = async (): Promise<HomepageConfig> => {
  if (USE_DEMO_DATA) {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialHomepageConfig;
  }

  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(db, 'homepage', 'main');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as HomepageConfig;
  }
  return initialHomepageConfig;
};

export const updateHomepageConfig = async (config: HomepageConfig): Promise<void> => {
  if (USE_DEMO_DATA) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(db, 'homepage', 'main');
  await setDoc(docRef, config, { merge: true });
};
