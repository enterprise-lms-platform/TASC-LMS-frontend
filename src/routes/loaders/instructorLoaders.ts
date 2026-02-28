/**
 * Instructor Route Loaders
 * Pre-fetches instructor-specific data (courses, learners, submissions, etc.)
 */

import { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { queryKeys } from '../../hooks/queryKeys';
import { courseApi } from '../../services/catalogue.services';
import { enrollmentApi } from '../../services/learning.services';

/**
 * Instructor Dashboard Loader
 * Pre-fetches instructor's courses and analytics data
 */
export const instructorDashboardLoader = async (queryClient: QueryClient) => {
  try {
    // Fetch instructor's courses
    const courses = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.all({ instructor_courses: true }),
      queryFn: () => courseApi.getAll({ instructor_courses: true }).then((r) => r.data),
      staleTime: 10 * 60 * 1000,
    });

    // Fetch enrollments in instructor's courses
    const enrollments = await queryClient.ensureQueryData({
      queryKey: queryKeys.enrollments.all,
      queryFn: () => enrollmentApi.getAll().then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { courses, enrollments };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    if (err.status === 403) return redirect('/learner'); // Not an instructor
    return { courses: { results: [], count: 0 }, enrollments: [] };
  }
};

/**
 * Instructor Courses Loader
 * Pre-fetches all courses created by instructor
 */
export const instructorCoursesLoader = async (
  queryClient: QueryClient,
  params?: { search?: string; page?: number }
) => {
  try {
    const courses = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.all({ ...params, instructor_courses: true }),
      queryFn: () =>
        courseApi.getAll({ ...params, instructor_courses: true }).then((r) => r.data),
      staleTime: 10 * 60 * 1000,
    });

    return { courses };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    return { courses: { results: [], count: 0 } };
  }
};

/**
 * Course Creation Loader
 * Loaders for pre-fetch categories and tags for course creation form
 */
export const courseCreationFormLoader = async (queryClient: QueryClient) => {
  try {
    // Load categories for dropdown
    const categoriesData = await queryClient
      .ensureQueryData({
        queryKey: queryKeys.categories.all(),
        queryFn: async () => {
          // This depends on catalogue service having category endpoints
          return { results: [], count: 0 };
        },
        staleTime: 30 * 60 * 1000,
      })
      .catch(() => ({ results: [], count: 0 }));

    return { categories: categoriesData };
  } catch (error) {
    console.error('Failed to load form data:', error);
    return { categories: { results: [], count: 0 } };
  }
};

/**
 * Course Structure Loader
 * Pre-fetches course structure/curriculum
 */
export const courseStructureLoader = async (
  queryClient: QueryClient,
  { params }: LoaderFunctionArgs
) => {
  const courseId = params.courseId ? parseInt(params.courseId, 10) : null;

  if (!courseId) {
    return redirect('/instructor/courses');
  }

  try {
    const course = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.detail(courseId),
      queryFn: () => courseApi.getById(courseId).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { course };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    if (err.status === 404 || err.status === 403) {
      return redirect('/instructor/courses');
    }
    throw error;
  }
};

/**
 * Course Preview Loader
 * Pre-fetches complete course structure for preview
 */
export const coursePreviewLoader = async (
  queryClient: QueryClient,
  { params }: LoaderFunctionArgs
) => {
  const courseId = params.courseId ? parseInt(params.courseId, 10) : null;

  if (!courseId) {
    return redirect('/instructor/courses');
  }

  try {
    const course = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.detail(courseId),
      queryFn: () => courseApi.getById(courseId).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { course };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    if (err.status === 404 || err.status === 403) {
      return redirect('/instructor/courses');
    }
    throw error;
  }
};

/**
 * Instructor Learners Loader
 * Pre-fetches learners enrolled in instructor's courses
 */
export const instructorLearnersLoader = async (
  queryClient: QueryClient,
  params?: { search?: string; courseId?: number; page?: number }
) => {
  try {
    const enrollments = await queryClient.ensureQueryData({
      queryKey: queryKeys.enrollments.all,
      queryFn: () => enrollmentApi.getAll(params).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { enrollments };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    return { enrollments: [] };
  }
};

/**
 * Grading Loader
 * Pre-fetches submissions for grading
 * NOTE: Requires backend endpoint for submissions/grading
 */
export const gradingLoader = async (
  // _queryClient: QueryClient,
  // _params?: { courseId?: number; page?: number }
) => {
  try {
    // TODO: Replace with actual submissions service call once submissionApi is available
    // const submissions = await queryClient.ensureQueryData({
    //   queryKey: ['submissions', params],
    //   queryFn: () => submissionApi.getAll(params).then((r) => r.data),
    // });

    return { submissions: [] };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    return { submissions: [] };
  }
};

/**
 * Gradebook Loader
 * Pre-fetches class grades for a course
 */
export const gradebookLoader = async (
  queryClient: QueryClient,
  params?: { courseId?: number; page?: number }
) => {
  const courseId = params?.courseId ?? null;

  try {
    const enrollments = await queryClient.ensureQueryData({
      queryKey: queryKeys.enrollments.all,
      queryFn: () => enrollmentApi.getAll({ course: courseId ?? undefined }).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { enrollments };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    return { enrollments: [] };
  }
};

/**
 * Analytics Loader
 * Pre-fetches analytics data for instructor
 */
export const instructorAnalyticsLoader = async (
  queryClient: QueryClient,
  params?: { courseId?: number; dateRange?: string }
) => {
  try {
    // Placeholder - depends on analytics service
    const enrollments = await queryClient.ensureQueryData({
      queryKey: queryKeys.enrollments.all,
      queryFn: () => enrollmentApi.getAll(params).then((r) => r.data),
      staleTime: 10 * 60 * 1000,
    });

    return { enrollments };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    return { enrollments: [] };
  }
};

/**
 * Generic Instructor Route Loader
 * Used for pages that don't need pre-flight data fetching
 */
export const instructorRouteLoader = async (queryClient: QueryClient) => {
  try {
    // Simple auth check - page will handle data fetching
    const courses = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.all({ instructor_courses: true }),
      queryFn: () => courseApi.getAll({ instructor_courses: true }).then((r) => r.data),
      staleTime: 10 * 60 * 1000,
    });

    return { courses };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    if (err.status === 403) return redirect('/learner');
    return { courses: { results: [], count: 0 } };
  }
};
