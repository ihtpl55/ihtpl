import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { NavigationVisibility, SiteSettings } from '../types';

export const defaultNavVisibility: NavigationVisibility = {
  products: true,
  industries: true,
  capabilities: true,
  projects: true,
  documents: true,
  gallery: true,
  insights: true,
  about: true,
  contact: true,
};

const emptySettings: SiteSettings = {
  companyName: 'Infinite Hardware Technology (P) Ltd.',
  tagline: 'Bridge Bearings • Expansion Joints • Couplings',
  logoUrl: '/logo.jpg',
  phone: '',
  altPhone: '',
  email: '',
  whatsapp: '',
  address: '',
  businessHours: '',
  googleMapsUrl: '',
  footerDescription: '',
  copyrightText: '© ' + new Date().getFullYear() + ' Infinite Hardware Technology (P) Ltd. All rights reserved.',
  navVisibility: defaultNavVisibility,
};

const STORAGE_KEY = 'infinite_site_settings_cache';
let memoryCache: SiteSettings | null = null;

// Helper to get local cache
const getCachedSettings = (): SiteSettings => {
  if (memoryCache) return memoryCache;
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      memoryCache = {
        ...emptySettings,
        ...parsed,
        navVisibility: {
          ...defaultNavVisibility,
          ...(parsed.navVisibility || {}),
        },
      };
      return memoryCache!;
    } catch {
      return emptySettings;
    }
  }
  return emptySettings;
};

// Helper to set local cache
const setCachedSettings = (settings: SiteSettings) => {
  memoryCache = settings;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const getSiteSettings = async (forceFresh = false): Promise<SiteSettings> => {
  // If running on demo data, return cached or initial values instantly
  if (USE_DEMO_DATA) {
    return getCachedSettings();
  }

  if (!db) {
    return emptySettings;
  }

  const hasLocal = localStorage.getItem(STORAGE_KEY) !== null || memoryCache !== null;

  // If cached and fresh fetch not explicitly requested, return cached immediately and sync in background
  if (hasLocal && !forceFresh) {
    const docRef = doc(db, 'settings', 'general');
    getDoc(docRef)
      .then((snap) => {
        if (snap.exists()) {
          const freshData = snap.data() as SiteSettings;
          const normalized: SiteSettings = {
            ...emptySettings,
            ...freshData,
            navVisibility: {
              ...defaultNavVisibility,
              ...(freshData.navVisibility || {}),
            },
          };
          setCachedSettings(normalized);
        }
      })
      .catch((err) => {
        console.warn('Failed to background fetch site settings', err);
      });

    return getCachedSettings();
  }

  // Directly await live data from Firestore
  try {
    const docRef = doc(db, 'settings', 'general');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const freshData = snap.data() as SiteSettings;
      const normalized: SiteSettings = {
        ...emptySettings,
        ...freshData,
        navVisibility: {
          ...defaultNavVisibility,
          ...(freshData.navVisibility || {}),
        },
      };
      setCachedSettings(normalized);
      return normalized;
    }
  } catch (err) {
    console.warn('Failed to fetch site settings from Firestore, using cache', err);
  }

  return getCachedSettings();
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
