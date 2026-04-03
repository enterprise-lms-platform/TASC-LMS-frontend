/**
 * Learner Route Loaders - FIXED VERSION
 * Pre-fetches data needed for learner pages before rendering
 */

import { QueryClient } from '@tanstack/react-query';
import { type LoaderFunctionArgs, redirect } from 'react-router-dom';
import { queryKeys } from '../../hooks/queryKeys';
import { normalizeEnrollmentListResponse } from '../../hooks/useLearning';
import { enrollmentApi, sessionProgressApi, certificateApi } from '../../services/learning.services';
import { courseApi } from '../../services/catalogue.services';

import { DEV_BYPASS_AUTH } from '../../utils/config';

/**
 * Learner Dashboard Loader
 * Pre-fetches: enrollments, session progress, certificates
 * Critical data for dashboard to display immediately
 */
export const learnerDashboardLoader = async (queryClient: QueryClient) => {
  try {
    // Fetch user's active enrollments
    const enrollments = await queryClient.ensureQueryData({
      queryKey: queryKeys.enrollments.all,
      queryFn: () => enrollmentApi.getAll().then((r) => normalizeEnrollmentListResponse(r.data)),
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    // Fetch session progress
    const progress = await queryClient.ensureQueryData({
      queryKey: queryKeys.sessionProgress.all(),
      queryFn: () => sessionProgressApi.getAll().then((r) => r.data),
      staleTime: 3 * 60 * 1000,
    });

    // Fetch certificates (non-critical, can fail silently)
    const certificates = await queryClient
      .ensureQueryData({
        queryKey: queryKeys.certificates.all,
        queryFn: () => certificateApi.getAll().then((r) => r.data),
        staleTime: 15 * 60 * 1000,
      })
      .catch(() => []);

    return {
      enrollments,
      progress,
      certificates,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.status === 401 && !DEV_BYPASS_AUTH) {
      return redirect('/login');
    }
    // For other errors, return empty data so the page can still render
    console.error('Dashboard loader error:', error);
    return { enrollments: [], progress: [], certificates: [] };
  }
};

/**
 * My Courses Loader
 * Pre-fetches user's enrolled courses
 */
export const myCoursesLoader = async (queryClient: QueryClient) => {
  try {
    const enrollments = await queryClient.ensureQueryData({
      queryKey: queryKeys.enrollments.all,
      queryFn: () => enrollmentApi.getAll().then((r) => normalizeEnrollmentListResponse(r.data)),
      staleTime: 5 * 60 * 1000,
    });

    return { enrollments };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    return { enrollments: [] };
  }
};

/**
 * Learner Course Catalog Loader
 * Pre-fetches available courses for enrollment
 */
export const learnerCourseCatalogLoader = async (
  queryClient: QueryClient,
  params?: { category?: number; search?: string; page?: number }
) => {
  try {
    const courses = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.all(params),
      queryFn: () => courseApi.getAll(params || {}).then((r) => r.data),
      staleTime: 10 * 60 * 1000,
    });

    return { courses };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    return { courses: [] };
  }
};

/**
 * Course Detail Loader
 * Pre-fetches course details with enrollment and progress info
 */
export const learnerCourseDetailLoader = async (
  queryClient: QueryClient,
  { params }: LoaderFunctionArgs
) => {
  const courseId = params.courseId ? parseInt(params.courseId, 10) : null;

  if (!courseId) {
    return redirect('/learner/courses');
  }

  try {
    // Fetch course details
    const course = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.detail(courseId),
      queryFn: () => courseApi.getById(courseId).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    // Fetch related enrollments info
    const enrollments = await queryClient
      .ensureQueryData({
        queryKey: queryKeys.enrollments.all,
        queryFn: () => enrollmentApi.getAll().then((r) => normalizeEnrollmentListResponse(r.data)),
        staleTime: 5 * 60 * 1000,
      })
      .catch(() => []);

    return { course, enrollments };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && !DEV_BYPASS_AUTH) {
      return redirect('/learner/courses');
    }
    if (err.status === 401 && DEV_BYPASS_AUTH) {
      return { course: null, enrollments: [] };
    }
    if (err.status === 404) {
      return redirect('/learner/courses');
    }
    throw error;
  }
};

/**
 * Course Player Loader
 * Pre-fetches course content, curriculum, and progress for active learning
 */
export const coursePlayerLoader = async (
  queryClient: QueryClient,
  { params }: LoaderFunctionArgs
) => {
  const courseId = params.courseId ? parseInt(params.courseId, 10) : null;

  if (!courseId) {
    return redirect('/learner/courses');
  }

  try {
    // Fetch course with sessions/modules
    const course = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.detail(courseId),
      queryFn: () => courseApi.getById(courseId).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    // Fetch user's progress in this course
    const progress = await queryClient
      .ensureQueryData({
        queryKey: queryKeys.sessionProgress.all({ course: courseId }),
        queryFn: () =>
          sessionProgressApi.getAll({ course: courseId }).then((r) => r.data),
        staleTime: 2 * 60 * 1000, // Refresh often for real-time progress
      })
      .catch(() => []);

    return { course, progress };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && !DEV_BYPASS_AUTH) {
      return redirect('/login');
    }
    if (err.status === 401 && DEV_BYPASS_AUTH) {
      // In dev bypass mode, return empty data so the page can still render
      return { course: null, progress: [] };
    }
    if (err.status === 404) {
      return redirect('/learner/courses');
    }
    throw error;
  }
};

/**
 * Assignments Loader
 * Pre-fetches learner's assignments
 */
export const learnerAssignmentsLoader = async (queryClient: QueryClient) => {
  try {
    // Fetch enrollments to get course IDs, then assignments
    const enrollments = await queryClient.ensureQueryData({
      queryKey: queryKeys.enrollments.all,
      queryFn: () => enrollmentApi.getAll().then((r) => normalizeEnrollmentListResponse(r.data)),
      staleTime: 5 * 60 * 1000,
    });

    return { enrollments };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    return { enrollments: [] };
  }
};

/**
 * Progress Loader
 * Pre-fetches learner's overall progress
 */
export const learnerProgressLoader = async (queryClient: QueryClient) => {
  try {
    const progress = await queryClient.ensureQueryData({
      queryKey: queryKeys.sessionProgress.all(),
      queryFn: () => sessionProgressApi.getAll().then((r) => r.data),
      staleTime: 3 * 60 * 1000,
    });

    const enrollments = await queryClient.ensureQueryData({
      queryKey: queryKeys.enrollments.all,
      queryFn: () => enrollmentApi.getAll().then((r) => normalizeEnrollmentListResponse(r.data)),
      staleTime: 5 * 60 * 1000,
    });

    return { progress, enrollments };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    return { progress: [], enrollments: [] };
  }
};

/**
 * Certificates Loader
 * Pre-fetches learner's certificates
 */
export const learnerCertificatesLoader = async (queryClient: QueryClient) => {
  try {
    const certificates = await queryClient.ensureQueryData({
      queryKey: queryKeys.certificates.all,
      queryFn: () => certificateApi.getAll().then((r) => r.data),
      staleTime: 15 * 60 * 1000,
    });

    return { certificates };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    return { certificates: [] };
  }
};

/**
 * Checkout Loader
 * Pre-fetches course and payment info for checkout
 */
export const checkoutLoader = async (
  queryClient: QueryClient,
  searchParams?: { courseId?: string }
) => {
  try {
    const courseId = searchParams?.courseId
      ? parseInt(searchParams.courseId, 10)
      : null;

    // If no courseId in URL params, still allow page to render —
    // the checkout page can receive course data via router state
    if (!courseId) {
      return { course: null };
    }

    const course = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.detail(courseId),
      queryFn: () => courseApi.getById(courseId).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { course };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    if (error?.status === 404) return redirect('/learner/courses');
    // Allow page to render with state-based course data on other errors
    return { course: null };
  }
};

/**
 * Payment History Loader
 * Pre-fetches learner's payment history
 */
export const paymentHistoryLoader = async () => {
  try {
    // This would use usePayments hook if available
    // For now, allow page to fetch its own data
    return {};
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    return {};
  }
};

/**
 * Notifications Loader
 * Pre-fetches learner notifications
 */
export const learnerNotificationsLoader = async () => {
  try {
    // When notifications service is ready, add here
    return {};
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    return {};
  }
};
