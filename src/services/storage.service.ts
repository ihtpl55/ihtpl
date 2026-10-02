import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, USE_DEMO_DATA } from '../lib/firebase';

export interface UploadProgressCallback {
  (progress: number, downloadUrl?: string, error?: string): void;
}

export const uploadFile = async (
  file: File,
  folder: 'products' | 'projects' | 'documents' | 'certifications' | 'gallery' | 'company',
  onProgress?: UploadProgressCallback
): Promise<string> => {
  // Validate File Type & Size
  const isPdf = file.type === 'application/pdf';
  const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);

  if (!isPdf && !isImage) {
    throw new Error('Unsupported file format. Please upload JPEG, PNG, WEBP images or PDF documents.');
  }

  if (isImage && file.size > 10 * 1024 * 1024) {
    throw new Error('Image size exceeds maximum 10MB limit.');
  }

  if (isPdf && file.size > 20 * 1024 * 1024) {
    throw new Error('Document PDF size exceeds maximum 20MB limit.');
  }

  if (USE_DEMO_DATA) {
    // In local demo mode, create an Object URL or simulated URL
    return new Promise((resolve) => {
      let current = 0;
      const interval = setInterval(() => {
        current += 25;
        if (onProgress) onProgress(current);
        if (current >= 100) {
          clearInterval(interval);
          const fakeUrl = URL.createObjectURL(file);
          if (onProgress) onProgress(100, fakeUrl);
          resolve(fakeUrl);
        }
      }, 150);
    });
  }

  if (!storage) throw new Error('Firebase Storage not initialized');

  const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        if (onProgress) onProgress(0, undefined, error.message);
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        if (onProgress) onProgress(100, downloadUrl);
        resolve(downloadUrl);
      }
    );
  });
};

export const deleteFileByUrl = async (fileUrl: string): Promise<void> => {
  if (USE_DEMO_DATA || !storage) return;
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (err) {
    console.warn('Could not delete storage file or file does not exist:', err);
  }
};
