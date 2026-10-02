import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import {
  initialSiteSettings,
  initialHomepageConfig,
  initialCategories,
  initialBrands,
  initialProducts,
  initialIndustries,
  initialCapabilities,
  initialProjects,
  initialGalleryItems,
  initialDocuments,
  initialCertifications,
  initialBlogPosts,
} from '../data/seedData';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.VITE_FIREBASE_APP_ID || "",
};

async function seedFirestore() {
  console.log('🚀 Starting Firestore Seed Utility...');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  try {
    // 1. Site Settings
    console.log('Seeding Site Settings...');
    await setDoc(doc(db, 'settings', 'general'), initialSiteSettings);

    // 2. Homepage Configuration
    console.log('Seeding Homepage Configuration...');
    await setDoc(doc(db, 'homepage', 'main'), initialHomepageConfig);

    // 3. Categories
    console.log(`Seeding ${initialCategories.length} Categories...`);
    for (const item of initialCategories) {
      await setDoc(doc(db, 'categories', item.id), item);
    }

    // 4. Brands
    console.log(`Seeding ${initialBrands.length} Brands...`);
    for (const item of initialBrands) {
      await setDoc(doc(db, 'brands', item.id), item);
    }

    // 5. Products
    console.log(`Seeding ${initialProducts.length} Products...`);
    for (const item of initialProducts) {
      await setDoc(doc(db, 'products', item.id), item);
    }

    // 6. Industries
    console.log(`Seeding ${initialIndustries.length} Industries...`);
    for (const item of initialIndustries) {
      await setDoc(doc(db, 'industries', item.id), item);
    }

    // 7. Capabilities
    console.log(`Seeding ${initialCapabilities.length} Capabilities...`);
    for (const item of initialCapabilities) {
      await setDoc(doc(db, 'capabilities', item.id), item);
    }

    // 8. Projects
    console.log(`Seeding ${initialProjects.length} Projects...`);
    for (const item of initialProjects) {
      await setDoc(doc(db, 'projects', item.id), item);
    }

    // 9. Gallery
    console.log(`Seeding ${initialGalleryItems.length} Gallery Items...`);
    for (const item of initialGalleryItems) {
      await setDoc(doc(db, 'gallery', item.id), item);
    }

    // 10. Documents
    console.log(`Seeding ${initialDocuments.length} Documents...`);
    for (const item of initialDocuments) {
      await setDoc(doc(db, 'documents', item.id), item);
    }

    // 11. Certifications
    console.log(`Seeding ${initialCertifications.length} Certifications...`);
    for (const item of initialCertifications) {
      await setDoc(doc(db, 'certifications', item.id), item);
    }

    // 12. Posts
    console.log(`Seeding ${initialBlogPosts.length} Blog Posts...`);
    for (const item of initialBlogPosts) {
      await setDoc(doc(db, 'posts', item.id), item);
    }

    console.log('🎉 ALL DATA SEEDED TO FIRESTORE SUCCESSFULLY!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Firestore seeding error:', error.message || error);
    process.exit(1);
  }
}

seedFirestore();
