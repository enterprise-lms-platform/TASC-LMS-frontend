//useCatalogue.ts custom hook for all catalogue related queries and mutations (categories, tags, courses, sessions)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  categoryApi,
  tagApi,
  courseApi,
  sessionApi,
  type CourseListParams,
  type SessionListParams,
} from '../services/catalogue.services';
import { queryKeys } from './queryKeys';
import type {
  CategoryCreateRequest,
  CourseCreateRequest,
  SessionCreateRequest,
  CourseList,
  Session,
  PaginatedResponse,
} from '../types/types';

// ── Categories ──

export const useCategories = (params?: { parent?: number }) =>
  useQuery({
    queryKey: queryKeys.categories.all(params),
    queryFn: () => categoryApi.getAll(params).then((r) => r.data),
  });

export const useCategory = (id: number) =>
  useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoryApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryCreateRequest) =>
      categoryApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoryCreateRequest> }) =>
      categoryApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({
        queryKey: queryKeys.categories.detail(variables.id),
      });
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoryApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// ── Tags ──

export const useTags = () =>
  useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: () => tagApi.getAll().then((r) => r.data),
  });

export const useTag = (id: number) =>
  useQuery({
    queryKey: queryKeys.tags.detail(id),
    queryFn: () => tagApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

// ── Courses ──

export const useCourses = (params?: CourseListParams) =>
  useQuery({
    queryKey: queryKeys.courses.all(params),
    queryFn: () => courseApi.getAll(params).then((r) => r.data),
  });

export const useCourse = (id: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => courseApi.getById(id).then((r) => r.data),
    enabled: options?.enabled ?? !!id,
  });

export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseCreateRequest) =>
      courseApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CourseCreateRequest }) =>
      courseApi.update(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({
        queryKey: queryKeys.courses.detail(variables.id),
      });
    },
  });
};

export const usePartialUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CourseCreateRequest> }) =>
      courseApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({
        queryKey: queryKeys.courses.detail(variables.id),
      });
    },
  });
};

export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => courseApi.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['courses'] });

      const allQueries = qc.getQueriesData<PaginatedResponse<CourseList>>({
        queryKey: ['courses'],
        exact: false,
      });

      allQueries.forEach(([key, data]) => {
        if (data?.results) {
          qc.setQueryData(key, {
            ...data,
            results: data.results.filter((c) => c.id !== id),
            count: data.count - 1,
          });
        }
      });

      return { allQueries };
    },
    onError: (_err, _id, context) => {
      context?.allQueries.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// ── Sessions ──

export const useSessions = (params?: SessionListParams) =>
  useQuery({
    queryKey: queryKeys.sessions.all(params),
    queryFn: () => sessionApi.getAll(params).then((r) => r.data),
  });

export const useSession = (id: number) =>
  useQuery({
    queryKey: queryKeys.sessions.detail(id),
    queryFn: () => sessionApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SessionCreateRequest) =>
      sessionApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useUpdateSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SessionCreateRequest }) =>
      sessionApi.update(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['sessions'] });
      qc.invalidateQueries({
        queryKey: queryKeys.sessions.detail(variables.id),
      });
    },
  });
};

export const usePartialUpdateSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SessionCreateRequest> }) =>
      sessionApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['sessions'] });
      qc.invalidateQueries({
        queryKey: queryKeys.sessions.detail(variables.id),
      });
    },
  });
};

export const useDeleteSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sessionApi.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['sessions'] });
      const allQueries = qc.getQueriesData<Session[]>({
        queryKey: ['sessions'],
        exact: false,
      });
      allQueries.forEach(([key, data]) => {
        if (Array.isArray(data)) {
          qc.setQueryData(key, data.filter((s) => s.id !== id));
        }
      });
      return { allQueries };
    },
    onError: (_err, _id, context) => {
      context?.allQueries.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};
