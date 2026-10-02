import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { BlogPost } from '../types';
import { initialBlogPosts } from '../data/seedData';

const STORAGE_KEY = 'apex_posts';

const getLocalPosts = (): BlogPost[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialBlogPosts;
};

export const getPosts = async (publicOnly = true): Promise<BlogPost[]> => {
  if (USE_DEMO_DATA) {
    const list = getLocalPosts();
    return publicOnly ? list.filter(p => p.published) : list;
  }

  if (!db) throw new Error('Firestore not initialized');
  const q = query(collection(db, 'posts'), orderBy('publishDate', 'desc'));
  const snap = await getDocs(q);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
  return publicOnly ? list.filter(p => p.published) : list;
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await getPosts(false);
  return posts.find(p => p.slug === slug) || null;
};

export const savePost = async (item: Partial<BlogPost> & { title: string; slug: string }): Promise<BlogPost> => {
  const id = item.id || `post-${Date.now()}`;
  const postToSave: BlogPost = {
    id,
    title: item.title,
    slug: item.slug,
    summary: item.summary || '',
    heroImage: item.heroImage || '',
    content: item.content || '',
    publishDate: item.publishDate || new Date().toISOString().split('T')[0],
    category: item.category || 'General',
    author: item.author || 'Technical Editorial',
    published: item.published ?? true,
  };

  if (USE_DEMO_DATA) {
    const list = getLocalPosts();
    const idx = list.findIndex(p => p.id === id);
    if (idx >= 0) list[idx] = postToSave;
    else list.push(postToSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return postToSave;
  }

  if (!db) throw new Error('Firestore not initialized');
  await setDoc(doc(db, 'posts', id), postToSave, { merge: true });
  return postToSave;
};

export const deletePost = async (id: string): Promise<void> => {
  if (USE_DEMO_DATA) {
    const list = getLocalPosts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, 'posts', id));
};
