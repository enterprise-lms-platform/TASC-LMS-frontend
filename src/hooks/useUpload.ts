/**
 * useUpload — React Query mutation hooks for media uploads.
 *
 * Follows the same pattern as useCreateCourse / useUpdateCourse in useCatalogue.ts.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { uploadApi } from '../services/upload.services';
import { sessionApi } from '../services/catalogue.services';
import type { UploadPrefix } from '../types/types';
import type { SessionAssetUploadResult } from '../services/upload.services';
import { genericMutationError } from '../utils/paymentErrors';

/**
 * Mutation hook for uploading a public media file (thumbnails, banners).
 */
export const useUploadMedia = () =>
  useMutation({
    mutationFn: ({ file, prefix }: { file: File; prefix: UploadPrefix }) =>
      uploadApi.uploadToSpaces(file, prefix),
    onError: (error) => genericMutationError(error, 'upload file'),
  });

/**
 * Mutation hook for uploading a session asset (video, PDF, SCORM zip).
 * Supports progress tracking via onProgress callback.
 */
export const useUploadSessionAsset = () =>
  useMutation<
    SessionAssetUploadResult,
    Error,
    {
      file: File;
      courseId: number;
      sessionId: number;
      onProgress?: (percent: number) => void;
    }
  >({
    mutationFn: ({ file, courseId, sessionId, onProgress }) =>
      uploadApi.uploadSessionAsset(file, courseId, sessionId, onProgress),
    onError: (error) => genericMutationError(error, 'upload session asset'),
  });

/**
 * Query hook for fetching a short-lived presigned GET URL for a session asset.
 * Enabled only when a sessionId is provided.
 */
export const useSessionAssetUrl = (sessionId: number | undefined) =>
  useQuery({
    queryKey: ['sessions', 'asset-url', sessionId],
    queryFn: () => sessionApi.getAssetUrl(sessionId!).then((r) => r.data),
    enabled: !!sessionId,
    staleTime: 4 * 60 * 1000, // Refetch before the 5-min expiry
  });
