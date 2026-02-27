/**
 * Upload Service — DO Spaces Presigned URL Flow
 *
 * Uses the backend presign endpoint to obtain a temporary, scoped PUT URL,
 * then uploads the file directly to DigitalOcean Spaces.
 *
 * Flow:
 *   1. POST /api/v1/uploads/presign/  →  { upload_url, public_url, headers }
 *   2. PUT  file to upload_url with exact headers from step 1
 *   3. Return public_url for persistence in course payload
 */

import { apiClient } from '../utils/config';
import type { UploadPrefix, PresignRequest, PresignResponse } from '../types/types';

const PRESIGN_PATH = '/api/v1/uploads/presign/';

export const uploadApi = {
  /**
   * Request a presigned upload URL from the backend.
   */
  presign: (data: PresignRequest) =>
    apiClient.post<PresignResponse>(PRESIGN_PATH, data),

  /**
   * Full two-step upload: presign → PUT to Spaces.
   * Returns the public CDN URL of the uploaded file.
   */
  uploadToSpaces: async (file: File, prefix: UploadPrefix): Promise<string> => {
    // Step 1 — get presigned URL + headers from backend
    const { data: presign } = await uploadApi.presign({
      prefix,
      filename: file.name,
      content_type: file.type,
    });

    // Step 2 — PUT file directly to DO Spaces (raw fetch, not apiClient)
    const uploadResponse = await fetch(presign.upload_url, {
      method: presign.method,
      headers: presign.headers,
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(
        `Upload to Spaces failed: ${uploadResponse.status} ${uploadResponse.statusText}`
      );
    }

    return presign.public_url;
  },

  /** Convenience: upload a course thumbnail. */
  uploadThumbnail: (file: File): Promise<string> =>
    uploadApi.uploadToSpaces(file, 'course-thumbnails'),

  /** Convenience: upload a course banner. */
  uploadBanner: (file: File): Promise<string> =>
    uploadApi.uploadToSpaces(file, 'course-banners'),
};
