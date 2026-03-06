/**
 * Manager/LMS Manager Route Loaders
 * Pre-fetches data for LMS management pages
 */

import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'react-router-dom';
import { queryKeys } from '../../hooks/queryKeys';
import { categoryApi, courseApi, courseApprovalApi, type CategoryListParams } from '../../services/catalogue.services';

/**
 * Manager Dashboard Loader
 * Pre-fetches management overview data
 */
export const managerDashboardLoader = async (queryClient: QueryClient) => {
  try {
    // Fetch categories for overview
    const categories = await queryClient.ensureQueryData({
      queryKey: queryKeys.categories.all(),
      queryFn: () => categoryApi.getAll().then((r) => r.data),
      staleTime: 30 * 60 * 1000,
    });

    // Fetch course overview
    const coursesData = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.all({ limit: 10 }),
      queryFn: () => courseApi.getAll({ limit: 10 }).then((r) => r.data),
      staleTime: 10 * 60 * 1000,
    });

    return { categories, coursesData };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    if (err.status === 403) return redirect('/learner');
    return { categories: { results: [], count: 0 }, coursesData: { results: [], count: 0 } };
  }
};

/**
 * Manager Categories Loader
 * Pre-fetches categories for management
 */
export const managerCategoriesLoader = async (
  queryClient: QueryClient,
  params?: CategoryListParams
) => {
  try {
    const categories = await queryClient.ensureQueryData({
      queryKey: queryKeys.categories.all(params),
      queryFn: () => categoryApi.getAll(params).then((r) => r.data),
      staleTime: 10 * 60 * 1000,
    });

    return { categories };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    return { categories: { results: [], count: 0 } };
  }
};

/**
 * Manager Analytics Loader
 * Pre-fetches data for analytics overview
 */
export const managerAnalyticsLoader = async (queryClient: QueryClient) => {
  try {
    const categories = await queryClient.ensureQueryData({
      queryKey: queryKeys.categories.all(),
      queryFn: () => categoryApi.getAll().then((r) => r.data),
      staleTime: 15 * 60 * 1000,
    });

    const coursesData = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.all({ limit: 20 }),
      queryFn: () => courseApi.getAll({ limit: 20 }).then((r) => r.data),
      staleTime: 10 * 60 * 1000,
    });

    return { categories, coursesData };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    return { categories: { results: [], count: 0 }, coursesData: { results: [], count: 0 } };
  }
};

/**
 * Approval Queue Loader
 * Pre-fetches pending approval requests for course approvals page
 */
export const approvalQueueLoader = async (queryClient: QueryClient) => {
  try {
    const approvalRequests = await queryClient.ensureQueryData({
      queryKey: queryKeys.approvalRequests.all({ status: 'pending' }),
      queryFn: () => courseApprovalApi.getAll({ status: 'pending' }).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { approvalRequests };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    if (err.status === 403) return redirect('/learner');
    return { approvalRequests: { results: [], count: 0 } };
  }
};

/**
 * Approval Detail Loader
 * Pre-fetches a single approval request and its associated course
 */
export const approvalDetailLoader = async (
  queryClient: QueryClient,
  args: { params: { requestId?: string } }
) => {
  const requestId = Number(args.params.requestId);
  if (!requestId) return redirect('/manager/approvals');

  try {
    const approvalRequest = await queryClient.ensureQueryData({
      queryKey: queryKeys.approvalRequests.detail(requestId),
      queryFn: () => courseApprovalApi.getById(requestId).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    // Also pre-fetch the course data
    if (approvalRequest.course) {
      await queryClient.ensureQueryData({
        queryKey: queryKeys.courses.detail(approvalRequest.course),
        queryFn: () => courseApi.getById(approvalRequest.course).then((r) => r.data),
        staleTime: 5 * 60 * 1000,
      });
    }

    return { approvalRequest };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    if (err.status === 403) return redirect('/learner');
    return redirect('/manager/approvals');
  }
};

/**
 * Generic Manager Route Loader
 * Used for pages that need basic manager auth check
 */
export const managerRouteLoader = async (queryClient: QueryClient) => {
  try {
    // Check auth
    const categories = await queryClient.ensureQueryData({
      queryKey: queryKeys.categories.all({ limit: 1 }),
      queryFn: () => categoryApi.getAll().then((r) => r.data),
      staleTime: 30 * 60 * 1000,
    });

    return { categories };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    if (err.status === 403) return redirect('/learner');
    return {};
  }
};
