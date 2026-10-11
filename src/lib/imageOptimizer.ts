/**
 * Automatically optimizes image URLs (Unsplash, Cloudinary, etc.) for responsive delivery,
 * modern WebP/AVIF format, compressed size, and responsive dimensions.
 */
export const optimizeImageUrl = (
  url?: string,
  width = 800,
  quality = 70
): string => {
  if (!url) return '';

  // Ignore local assets and data URLs
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // Optimize Unsplash images
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('auto', 'format'); // delivers modern AVIF/WebP depending on browser
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('w', String(width));
      parsed.searchParams.set('q', String(quality));
      return parsed.toString();
    } catch {
      return url;
    }
  }

  return url;
};
