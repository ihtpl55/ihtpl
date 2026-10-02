import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { SiteSettings } from '../types';
import { initialSiteSettings } from '../data/seedData';

const STORAGE_KEY = 'infinite_site_settings_cache';
let memoryCache: SiteSettings | null = null;

// Helper to get local cache
const getCachedSettings = (): SiteSettings => {
  if (memoryCache) return memoryCache;
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      memoryCache = JSON.parse(local);
      return memoryCache!;
    } catch {
      return initialSiteSettings;
    }
  }
  return initialSiteSettings;
};

// Helper to set local cache
const setCachedSettings = (settings: SiteSettings) => {
  memoryCache = settings;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  // If running on demo data, return cached or initial values instantly
  if (USE_DEMO_DATA) {
    return getCachedSettings();
  }

  if (!db) {
    return initialSiteSettings;
  }

  // Background fetch logic: Return cached value immediately, but update in the background
  const cached = getCachedSettings();
  
  // Perform asynchronous fetch from Firestore
  const docRef = doc(db, 'settings', 'general');
  getDoc(docRef)
    .then((snap) => {
      if (snap.exists()) {
        const freshData = snap.data() as SiteSettings;
        setCachedSettings(freshData);
      }
    })
    .catch((err) => {
      console.warn('Failed to background fetch site settings', err);
    });

  return cached;
};

export const updateSiteSettings = async (settings: SiteSettings): Promise<void> => {
  // Always update local cache first for instant UI response
  setCachedSettings(settings);

  if (USE_DEMO_DATA) {
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(db, 'settings', 'general');
  await setDoc(docRef, settings, { merge: true });
};
