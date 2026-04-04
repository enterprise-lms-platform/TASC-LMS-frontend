import { useQuery, useMutation } from '@tanstack/react-query';
import {
  healthApi,
  publicCategoryApi,
  publicTagApi,
  publicCourseApi,
  publicTestimonialApi,
  publicDemoRequestApi,
  publicInstructorApi,
  type PublicCourseParams,
  type DemoRequestPayload,
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

// ── Testimonials ──

export const useTestimonials = () =>
  useQuery({
    queryKey: queryKeys.publicTestimonials.all,
    queryFn: () => publicTestimonialApi.getAll().then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

// ── Demo request ──

export const useSubmitDemoRequest = () =>
  useMutation({ mutationFn: (data: DemoRequestPayload) => publicDemoRequestApi.submit(data) });

// ── Public instructor profile ──

export const usePublicInstructor = (userId: number | undefined) =>
  useQuery({
    queryKey: queryKeys.publicInstructor.detail(userId!),
    queryFn: () => publicInstructorApi.getById(userId!).then((r) => r.data),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
