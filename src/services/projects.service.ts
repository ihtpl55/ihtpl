import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { Project } from '../types';
import { initialProjects } from '../data/seedData';

const STORAGE_KEY = 'apex_projects';

const getLocalProjects = (): Project[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialProjects;
};

export const getProjects = async (publicOnly = true): Promise<Project[]> => {
  if (USE_DEMO_DATA) {
    const list = getLocalProjects();
    return publicOnly ? list.filter(p => p.published) : list;
  }

  if (!db) throw new Error('Firestore not initialized');
  const q = query(collection(db, 'projects'), orderBy('sortOrder', 'asc'));
  const snap = await getDocs(q);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
  return publicOnly ? list.filter(p => p.published) : list;
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  const projects = await getProjects(false);
  return projects.find(p => p.slug === slug) || null;
};

export const saveProject = async (item: Partial<Project> & { title: string; slug: string }): Promise<Project> => {
  const id = item.id || `proj-${Date.now()}`;
  const projectToSave: Project = {
    id,
    title: item.title,
    slug: item.slug,
    industry: item.industry || '',
    location: item.location || '',
    year: item.year || new Date().getFullYear().toString(),
    client: item.client || '',
    shortResult: item.shortResult || '',
    challenge: item.challenge || '',
    solution: item.solution || '',
    outcome: item.outcome || '',
    heroImage: item.heroImage || '',
    gallery: item.gallery || [],
    published: item.published ?? true,
    sortOrder: item.sortOrder ?? 1,
  };

  if (USE_DEMO_DATA) {
    const list = getLocalProjects();
    const idx = list.findIndex(p => p.id === id);
    if (idx >= 0) list[idx] = projectToSave;
    else list.push(projectToSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return projectToSave;
  }

  if (!db) throw new Error('Firestore not initialized');
  await setDoc(doc(db, 'projects', id), projectToSave, { merge: true });
  return projectToSave;
};

export const deleteProject = async (id: string): Promise<void> => {
  if (USE_DEMO_DATA) {
    const list = getLocalProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, 'projects', id));
};
