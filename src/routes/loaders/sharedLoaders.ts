/**
 * Shared Loaders - Common data fetching across routes
 * These loaders pre-fetch data before route renders using TanStack Query's ensureQueryData
 */

import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'react-router-dom';
import { queryKeys } from '../../hooks/queryKeys';
import { courseApi, categoryApi, sessionApi } from '../../services/catalogue.services';
import { sessionProgressApi } from '../../services/learning.services';
import { publicCourseApi } from '../../services/public.services';

const DEV_BYPASS_AUTH = import.meta.env.VITE_AUTH_BYPASS === 'true' && import.meta.env.DEV;

/**
 * Course Detail Loader - Pre-fetch course with curriculum, reviews, enrollment data
 * Used by: Course detail page, Course player, Course preview
 */
export const courseDetailLoader = async (
  queryClient: QueryClient,
  courseId: number
) => {
  try {
    // Pre-fetch course details
    const courseData = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.detail(courseId),
      queryFn: () => courseApi.getById(courseId).then((r) => r.data),
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    return { course: courseData };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && DEV_BYPASS_AUTH) return { course: null };
    if (err.status === 404) {
      return redirect('/learner/courses');
    }
    throw error;
  }
};

/**
 * Course Catalog Loader - Pre-fetch courses with filters
 */
export const courseCatalogLoader = async (
  queryClient: QueryClient,
  params?: { category?: number; search?: string; page?: number }
) => {
  try {
    const courses = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.all(params),
      queryFn: () => courseApi.getAll(params).then((r) => r.data),
      staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    });

    return { courses };
  } catch (error) {
    console.error('Failed to load courses:', error);
    return { courses: [] };
  }
};

/**
 * Categories Loader - Pre-fetch all categories
 */
export const categoriesLoader = async (queryClient: QueryClient) => {
  try {
    const categories = await queryClient.ensureQueryData({
      queryKey: queryKeys.categories.all(),
      queryFn: () => categoryApi.getAll().then((r) => r.data),
      staleTime: 30 * 60 * 1000, // Cache for 30 minutes (rarely changes)
    });

    return { categories };
  } catch (error) {
    console.error('Failed to load categories:', error);
    return { categories: [] };
  }
};

/**
 * Public Catalog Loader - Pre-fetch public course catalog (no auth required)
 */
export const publicCatalogLoader = async (
  queryClient: QueryClient,
  params?: { category?: number; search?: string }
) => {
  try {
    const courses = await queryClient.ensureQueryData({
      queryKey: queryKeys.public.courses.all(params),
      queryFn: () => publicCourseApi.getAll(params).then((r) => r.data),
      staleTime: 10 * 60 * 1000,
    });

    return { courses };
  } catch (error) {
    console.error('Failed to load public courses:', error);
    return { courses: [] };
  }
};

/**
 * Session Detail Loader - Pre-fetch session for course player
 */
export const sessionDetailLoader = async (
  queryClient: QueryClient,
  sessionId: number
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const session = await queryClient.ensureQueryData({
      queryKey: queryKeys.sessions.detail(sessionId),
      queryFn: () => sessionApi.getById(sessionId).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { session };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && DEV_BYPASS_AUTH) return { session: null };
    throw error;
  }
};

/**
 * Enrollment Progress Loader - Pre-fetch user's progress for course
 */
export const enrollmentProgressLoader = async (
  queryClient: QueryClient,
  enrollmentId: number
) => {
  try {
    const progress = await queryClient.ensureQueryData({
      queryKey: queryKeys.sessionProgress.all({ enrollment: enrollmentId }),
      queryFn: () =>
        sessionProgressApi.getAll({ enrollment: enrollmentId }).then((r) => r.data),
      staleTime: 2 * 60 * 1000, // Cache for 2 minutes (progress changes frequently)
    });

    return { progress };
  } catch (error) {
    console.error('Failed to load progress:', error);
    return { progress: null };
  }
};
