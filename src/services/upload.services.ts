/**
 * DigitalOcean Spaces Upload Service
 * Uploads media files (thumbnails, banners) to DO Spaces and returns CDN URLs.
 */

const DO_SPACES_ORIGIN = 'https://tasc-public.lon1.digitaloceanspaces.com';
const DO_SPACES_CDN = 'https://tasc-public.lon1.cdn.digitaloceanspaces.com';

/**
 * Upload a file to DigitalOcean Spaces public bucket.
 * Returns the CDN URL of the uploaded file.
 */
export const uploadToSpaces = async (
  file: File,
  folder: 'course-thumbnails' | 'course-banners'
): Promise<string> => {
  const ext = file.name.split('.').pop() || 'png';
  const uniqueName = `${crypto.randomUUID()}.${ext}`;
  const key = `${folder}/${uniqueName}`;

  const response = await fetch(`${DO_SPACES_ORIGIN}/${key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'x-amz-acl': 'public-read',
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  return `${DO_SPACES_CDN}/${key}`;
};

/**
 * Upload a course thumbnail and return the CDN URL.
 */
export const uploadThumbnail = (file: File): Promise<string> =>
  uploadToSpaces(file, 'course-thumbnails');

/**
 * Upload a course banner and return the CDN URL.
 */
export const uploadBanner = (file: File): Promise<string> =>
  uploadToSpaces(file, 'course-banners');
