/**
 * Course utility functions for safe image handling and data mapping
 */

// Import local thumbnail images (Vite will resolve these to correct runtime URLs)
// NOTE: Only importing real JPEG files. Other categories temporarily mapped to these.
import weldingThumb from '../assets/course-thumbnails/welding.jpg';
import safetyThumb from '../assets/course-thumbnails/safety.jpg';

// Allowlist of trusted external image hosts
const ALLOWED_IMAGE_HOSTS = [
  'images.unsplash.com',
  'source.unsplash.com',
  // Add staging/production domain when available:
  // 'cdn.yourdomain.com',
];

/**
 * Check if an image URL is from an allowed external host
 */
export function isAllowedImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return ALLOWED_IMAGE_HOSTS.some(host => urlObj.hostname === host || urlObj.hostname.endsWith(`.${host}`));
  } catch {
    // Invalid URL
    return false;
  }
}

/**
 * Category slug to local thumbnail mapping
 * NOTE: Temporarily mapping all categories to 2 real JPEG files until proper images are added.
 */
const CATEGORY_THUMBNAIL_MAP: Record<string, string> = {
  // Real mappings (we have these JPEGs)
  'welding': weldingThumb,
  
  // Map all safety-related to safety.jpg
  'ews': safetyThumb,
  'ehs-safety': safetyThumb,
  'safety': safetyThumb,
  
  // Temporarily map industrial/trade categories to welding (industrial theme)
  'scaffolding': weldingThumb,
  'electrical': weldingThumb,
  'plumbing': weldingThumb,
  
  // Temporarily map office/training categories to safety
  'assessment': safetyThumb,
  'certification': safetyThumb,
  
};

// Export for use in image onError handlers (fallback when external URLs fail)
export const DEFAULT_THUMBNAIL = safetyThumb; // Use safety.jpg as safest default

/**
 * Get a local thumbnail based on category slug (for fallback when external images fail)
 * 
 * @param categorySlug - Category slug from API (e.g., 'welding', 'safety', 'ehs')
 * @returns Local thumbnail URL based on category, or DEFAULT_THUMBNAIL if no match
 */
export function getLocalThumbnailByCategory(categorySlug?: string | null): string {
  if (!categorySlug) {
    return DEFAULT_THUMBNAIL;
  }
  
  const normalized = categorySlug.toLowerCase();
  return CATEGORY_THUMBNAIL_MAP[normalized] || DEFAULT_THUMBNAIL;
}

/**
 * Get a safe thumbnail URL for a course
 * 
 * Priority:
 * 1. If course.thumbnail exists and is from an allowed host, use it
 * 2. Otherwise, map to a local thumbnail based on category slug
 * 3. Fall back to default thumbnail
 * 
 * @param course - Course object with thumbnail and category
 * @returns Safe thumbnail URL (local or allowed external)
 */
export function getCourseThumbnail(course: {
  thumbnail?: string | null;
  slug: string;
  category?: { slug?: string } | null;
}): string {
  // 1. Check if external thumbnail is allowed
  if (course.thumbnail && isAllowedImageUrl(course.thumbnail)) {
    return course.thumbnail;
  }

  // 2. Try to map category to local thumbnail
  const categorySlug = course.category?.slug?.toLowerCase();
  if (categorySlug && CATEGORY_THUMBNAIL_MAP[categorySlug]) {
    return CATEGORY_THUMBNAIL_MAP[categorySlug];
  }

  // 3. Fall back to default
  return DEFAULT_THUMBNAIL;
}
