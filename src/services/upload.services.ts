/**
 * Upload Service — DO Spaces Presigned URL Flow
 *
 * Uses the backend presign endpoint to obtain a temporary, scoped PUT URL,
 * then uploads the file directly to DigitalOcean Spaces.
 *
 * Flow (public assets — thumbnails, banners):
 *   1. POST /api/v1/uploads/presign/  →  { upload_url, public_url, headers }
 *   2. PUT  file to upload_url with exact headers from step 1
 *   3. Return public_url for persistence in course payload
 *
 * Flow (session assets — videos, PDFs, SCORM):
 *   1. POST /api/v1/uploads/presign/  →  { upload_url, object_key, bucket, headers }
 *   2. PUT  file to upload_url (with progress via XMLHttpRequest)
 *   3. Return { object_key, bucket } for persistence in session payload
 */

import { apiClient } from '../utils/config';
import type {
  UploadPrefix,
  PresignRequest,
  PresignResponse,
  PresignSessionAssetResponse,
} from '../types/types';

const PRESIGN_PATH = '/api/v1/uploads/presign/';

export interface SessionAssetUploadResult {
  object_key: string;
  bucket: string;
  mime_type: string;
  size_bytes: number;
  original_filename: string;
}

export const uploadApi = {
  /**
   * Request a presigned upload URL from the backend.
   */
  presign: (data: PresignRequest) =>
    apiClient.post<PresignResponse>(PRESIGN_PATH, data),

  /**
   * Request a presigned upload URL for session assets (private bucket).
   */
  presignSessionAsset: (data: PresignRequest) =>
    apiClient.post<PresignSessionAssetResponse>(PRESIGN_PATH, data),

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

    return presign.public_url ?? '';
  },

  /**
   * Upload a session asset (video, PDF, SCORM zip) to private bucket.
   * Uses XMLHttpRequest for upload progress tracking.
   *
   * @param file        The file to upload
   * @param courseId    Course the session belongs to
   * @param sessionId  Session ID
   * @param onProgress  Callback with progress 0–100
   * @returns           Asset metadata to persist on the session
   */
  uploadSessionAsset: async (
    file: File,
    courseId: number,
    sessionId: number,
    onProgress?: (percent: number) => void,
  ): Promise<SessionAssetUploadResult> => {
    // Step 1 — get presigned URL for private bucket
    const { data: presign } = await uploadApi.presignSessionAsset({
      prefix: 'session-assets',
      filename: file.name,
      content_type: file.type,
      course_id: courseId,
      session_id: sessionId,
    });

    // Step 2 — PUT file to DO Spaces with progress via XHR
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(presign.method, presign.upload_url);

      // Set headers from presign response
      Object.entries(presign.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.onabort = () => reject(new Error('Upload cancelled'));

      xhr.send(file);
    });

    return {
      object_key: presign.object_key,
      bucket: presign.bucket,
      mime_type: file.type,
      size_bytes: file.size,
      original_filename: file.name,
    };
  },

  /** Convenience: upload a course thumbnail. */
  uploadThumbnail: (file: File): Promise<string> =>
    uploadApi.uploadToSpaces(file, 'course-thumbnails'),

  /** Convenience: upload a course banner. */
  uploadBanner: (file: File): Promise<string> =>
    uploadApi.uploadToSpaces(file, 'course-banners'),
};
