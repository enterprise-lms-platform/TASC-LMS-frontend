/**
 * useUpload — React Query mutation hooks for media uploads.
 *
 * Follows the same pattern as useCreateCourse / useUpdateCourse in useCatalogue.ts.
 */

import { useMutation } from '@tanstack/react-query';
import { uploadApi } from '../services/upload.services';
import type { UploadPrefix } from '../types/types';

/**
 * Mutation hook for uploading a media file via presigned URL.
 *
 * @example
 * ```tsx
 * const upload = useUploadMedia();
 * const url = await upload.mutateAsync({ file, prefix: 'course-thumbnails' });
 * ```
 */
export const useUploadMedia = () =>
  useMutation({
    mutationFn: ({ file, prefix }: { file: File; prefix: UploadPrefix }) =>
      uploadApi.uploadToSpaces(file, prefix),
  });
