import { useQuery } from '@tanstack/react-query';
import {
  healthApi,
  publicCategoryApi,
  publicTagApi,
  publicCourseApi,
  type PublicCourseParams,
} from '../services/public.services';
import { queryKeys } from './queryKeys';

// ── Health ──

export const useHealthCheck = () =>
  useQuery({
    queryKey: queryKeys.public.health,
    queryFn: () => healthApi.check().then((r) => r.data),
  });

// ── Public Categories ──

export const usePublicCategories = () =>
  useQuery({
    queryKey: queryKeys.public.categories.all,
    queryFn: () => publicCategoryApi.getAll().then((r) => r.data),
  });

export const usePublicCategory = (id: number) =>
  useQuery({
    queryKey: queryKeys.public.categories.detail(id),
    queryFn: () => publicCategoryApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

// ── Public Tags ──

export const usePublicTags = () =>
  useQuery({
    queryKey: queryKeys.public.tags.all,
    queryFn: () => publicTagApi.getAll().then((r) => r.data),
  });

export const usePublicTag = (id: number) =>
  useQuery({
    queryKey: queryKeys.public.tags.detail(id),
    queryFn: () => publicTagApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

// ── Public Courses ──

export const usePublicCourses = (params?: PublicCourseParams) =>
  useQuery({
    queryKey: queryKeys.public.courses.all(params),
    queryFn: () => publicCourseApi.getAll(params).then((r) => r.data),
  });

export const usePublicCourse = (slug: string) =>
  useQuery({
    queryKey: queryKeys.public.courses.detail(slug),
    queryFn: () => publicCourseApi.getBySlug(slug).then((r) => r.data),
    enabled: !!slug,
  });
