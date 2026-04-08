import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  enrollmentApi,
  sessionProgressApi,
  certificateApi,
  discussionApi,
  discussionReplyApi,
  type SessionProgressParams,
  type DiscussionParams,
  type DiscussionReplyParams,
} from '../services/learning.services';
import {
  enrollmentError,
  progressError,
  certificateError,
  discussionError,
} from '../utils/learningErrors';
import { queryKeys } from './queryKeys';
import type {
  Certificate,
  Enrollment,
  EnrollmentCreateRequest,
  SessionProgressUpdateRequest,
  DiscussionCreateRequest,
  DiscussionReplyCreateRequest,
  Discussion,
  DiscussionReply,
  PaginatedResponse,
} from '../types/types';

/** Normalize GET /learning/enrollments/ whether the API returns a raw array or paginated { results }. */
export function normalizeEnrollmentListResponse(data: unknown): Enrollment[] {
  if (Array.isArray(data)) return data as Enrollment[];
  if (
    data &&
    typeof data === 'object' &&
    'results' in data &&
    Array.isArray((data as PaginatedResponse<Enrollment>).results)
  ) {
    return (data as PaginatedResponse<Enrollment>).results;
  }
  return [];
}

/** Normalize GET /learning/certificates/ whether the API returns a raw array or paginated { results }. */
export function normalizeCertificateListResponse(data: unknown): Certificate[] {
  if (Array.isArray(data)) return data as Certificate[];
  if (data && typeof data === 'object' && Array.isArray((data as { results?: unknown }).results)) {
    return (data as { results: Certificate[] }).results;
  }
  return [];
}

// ── Enrollments ──

export const useEnrollments = () =>
  useQuery({
    queryKey: queryKeys.enrollments.all,
    queryFn: () => enrollmentApi.getAll().then((r) => normalizeEnrollmentListResponse(r.data)),
  });

export const useEnrollment = (id: number) =>
  useQuery({
    queryKey: queryKeys.enrollments.detail(id),
    queryFn: () => enrollmentApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateEnrollment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: EnrollmentCreateRequest) =>
      enrollmentApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.enrollments.all });
      qc.invalidateQueries({ queryKey: ['learner', 'my-courses'] });
      qc.invalidateQueries({ queryKey: ['learner', 'enrollments', 'active'] });
      qc.invalidateQueries({ queryKey: ['learner', 'enrollments', 'stats'] });
    },
    onError: (error) => enrollmentError(error, 'enroll in this course'),
  });
};

export const useGenerateCertificate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (enrollmentId: number) =>
      enrollmentApi.generateCertificate(enrollmentId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['certificates'] });
      qc.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: (error) => certificateError(error),
  });
};

// ── Session Progress ──

export const useSessionProgressList = (params?: SessionProgressParams) =>
  useQuery({
    queryKey: queryKeys.sessionProgress.all(params),
    queryFn: () => sessionProgressApi.getAll(params).then((r) => {
      const data = r.data;
      return Array.isArray(data) ? data : (data as any).results ?? [];
    }),
  });

export const useSessionProgress = (id: number) =>
  useQuery({
    queryKey: queryKeys.sessionProgress.detail(id),
    queryFn: () => sessionProgressApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateSessionProgress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { enrollment: number; session: number }) =>
      sessionProgressApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-progress'] });
    },
    onError: (error) => progressError(error, 'create session progress'),
  });
};

export const useUpdateSessionProgress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SessionProgressUpdateRequest }) =>
      sessionProgressApi.update(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['session-progress'] });
      qc.invalidateQueries({
        queryKey: queryKeys.sessionProgress.detail(variables.id),
      });
      qc.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: (error) => progressError(error, 'update session progress'),
  });
};

export const usePartialUpdateSessionProgress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<SessionProgressUpdateRequest>;
    }) => sessionProgressApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['session-progress'] });
      qc.invalidateQueries({
        queryKey: queryKeys.sessionProgress.detail(variables.id),
      });
      qc.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: (error) => progressError(error, 'update session progress'),
  });
};

export const useDeleteSessionProgress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sessionProgressApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-progress'] });
      qc.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: (error) => progressError(error, 'delete session progress'),
  });
};

export const useMarkSessionCompleted = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, timeSpentSeconds }: { id: number; timeSpentSeconds?: number }) =>
      sessionProgressApi.markCompleted(id, timeSpentSeconds).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['session-progress'] });
      qc.invalidateQueries({
        queryKey: queryKeys.sessionProgress.detail(variables.id),
      });
      qc.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: (error) => progressError(error, 'mark session completed'),
  });
};

// ── Certificates ──

export const useCertificates = () =>
  useQuery({
    queryKey: queryKeys.certificates.all,
    queryFn: () =>
      certificateApi.getAll().then((r) => normalizeCertificateListResponse(r.data)),
  });

export const useCertificate = (id: number) =>
  useQuery({
    queryKey: queryKeys.certificates.detail(id),
    queryFn: () => certificateApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useVerifyCertificate = (certificateNumber: string) =>
  useQuery({
    queryKey: queryKeys.certificates.verify(certificateNumber),
    queryFn: () => certificateApi.verify(certificateNumber).then((r) => r.data),
    enabled: !!certificateNumber,
  });

// ── Discussions ──

export const useDiscussions = (params?: DiscussionParams) =>
  useQuery({
    queryKey: queryKeys.discussions.all(params),
    queryFn: () => discussionApi.getAll(params).then((r) => {
      const data = r.data;
      return Array.isArray(data) ? data : (data as any).results ?? [];
    }),
  });

export const useDiscussion = (id: number) =>
  useQuery({
    queryKey: queryKeys.discussions.detail(id),
    queryFn: () => discussionApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateDiscussion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DiscussionCreateRequest) =>
      discussionApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['discussions'] });
    },
    onError: (error) => discussionError(error, 'create discussion'),
  });
};

export const useUpdateDiscussion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Discussion> }) =>
      discussionApi.update(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['discussions'] });
      qc.invalidateQueries({
        queryKey: queryKeys.discussions.detail(variables.id),
      });
    },
    onError: (error) => discussionError(error, 'update discussion'),
  });
};

export const usePartialUpdateDiscussion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Discussion> }) =>
      discussionApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['discussions'] });
      qc.invalidateQueries({
        queryKey: queryKeys.discussions.detail(variables.id),
      });
    },
    onError: (error) => discussionError(error, 'update discussion'),
  });
};

export const useDeleteDiscussion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => discussionApi.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['discussions'] });
      const allQueries = qc.getQueriesData<Discussion[]>({
        queryKey: ['discussions'],
        exact: false,
      });
      allQueries.forEach(([key, data]) => {
        if (Array.isArray(data)) {
          qc.setQueryData(key, data.filter((d) => d.id !== id));
        }
      });
      return { allQueries };
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['discussions'] });
    },
    onError: (error, _id, context) => {
      context?.allQueries.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
      return discussionError(error, 'delete discussion');
    },
  });
};

// ── Discussion Replies ──

export const useDiscussionReplies = (params?: DiscussionReplyParams) =>
  useQuery({
    queryKey: queryKeys.discussionReplies.all(params),
    queryFn: () => discussionReplyApi.getAll(params).then((r) => {
      const data = r.data;
      return Array.isArray(data) ? data : (data as any).results ?? [];
    }),
  });

export const useDiscussionReply = (id: number) =>
  useQuery({
    queryKey: queryKeys.discussionReplies.detail(id),
    queryFn: () => discussionReplyApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateDiscussionReply = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DiscussionReplyCreateRequest) =>
      discussionReplyApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['discussion-replies'] });
      qc.invalidateQueries({ queryKey: ['discussions'] });
    },
    onError: (error) => discussionError(error, 'create reply'),
  });
};

export const useUpdateDiscussionReply = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DiscussionReply> }) =>
      discussionReplyApi.update(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['discussion-replies'] });
      qc.invalidateQueries({
        queryKey: queryKeys.discussionReplies.detail(variables.id),
      });
      qc.invalidateQueries({ queryKey: ['discussions'] });
    },
    onError: (error) => discussionError(error, 'update reply'),
  });
};

export const usePartialUpdateDiscussionReply = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DiscussionReply> }) =>
      discussionReplyApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['discussion-replies'] });
      qc.invalidateQueries({
        queryKey: queryKeys.discussionReplies.detail(variables.id),
      });
      qc.invalidateQueries({ queryKey: ['discussions'] });
    },
    onError: (error) => discussionError(error, 'update reply'),
  });
};

export const useDeleteDiscussionReply = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => discussionReplyApi.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['discussion-replies'] });
      const allQueries = qc.getQueriesData<DiscussionReply[]>({
        queryKey: ['discussion-replies'],
        exact: false,
      });
      allQueries.forEach(([key, data]) => {
        if (Array.isArray(data)) {
          qc.setQueryData(key, data.filter((r) => r.id !== id));
        }
      });
      return { allQueries };
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['discussion-replies'] });
      qc.invalidateQueries({ queryKey: ['discussions'] });
    },
    onError: (error, _id, context) => {
      context?.allQueries.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
      return discussionError(error, 'delete reply');
    },
  });
};
