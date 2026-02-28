/**
 * Superadmin Route Loaders
 * Pre-fetches system-wide admin data (users, organizations, audit logs, etc.)
 */

import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'react-router-dom';
import { queryKeys } from '../../hooks/queryKeys';
import { courseApi } from '../../services/catalogue.services';
import { auditLogApi } from '../../services/superadmin.services';

/**
 * Superadmin Dashboard Loader
 * Pre-fetches system metrics and overview data
 */
export const superadminDashboardLoader = async (queryClient: QueryClient) => {
  try {
    // Fetch recent audit logs for activity overview
    const auditLogs = await queryClient.ensureQueryData({
      queryKey: queryKeys.auditLogs.all({ limit: 10 }),
      queryFn: () =>
        auditLogApi.getAll({ limit: 10 }).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    // Fetch all courses count
    const coursesData = await queryClient
      .ensureQueryData({
        queryKey: queryKeys.courses.all({ limit: 1 }),
        queryFn: () => courseApi.getAll({ limit: 1 }).then((r) => r.data),
        staleTime: 10 * 60 * 1000,
      })
      .catch(() => ({ results: [], count: 0 }));

    return { auditLogs, coursesData };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    if (err.status === 403) return redirect('/learner');
    return { auditLogs: { results: [], count: 0 }, coursesData: { results: [], count: 0 } };
  }
};

/**
 * Audit Logs Loader
 * Pre-fetches system audit logs with filters
 */
export const auditLogsLoader = async (
  queryClient: QueryClient,
  filters?: { user?: number; action?: string; date_from?: string; date_to?: string; page?: number }
) => {
  try {
    const auditLogs = await queryClient.ensureQueryData({
      queryKey: queryKeys.auditLogs.all(filters),
      queryFn: () => auditLogApi.getAll(filters).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { auditLogs };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    return { auditLogs: { results: [], count: 0 } };
  }
};

/**
 * All Courses Loader
 * Pre-fetches system-wide course listing
 */
export const allCoursesLoader = async (
  queryClient: QueryClient,
  params?: { search?: string; status?: string; page?: number }
) => {
  try {
    const courses = await queryClient.ensureQueryData({
      queryKey: queryKeys.courses.all(params),
      queryFn: () => courseApi.getAll(params).then((r) => r.data),
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
 * Generic Superadmin Route Loader
 * Used for pages that need basic admin auth check
 */
export const superadminRouteLoader = async (queryClient: QueryClient) => {
  try {
    // Minimal auth check
    const auditLogs = await queryClient.ensureQueryData({
      queryKey: queryKeys.auditLogs.all({ limit: 1 }),
      queryFn: () => auditLogApi.getAll({ limit: 1 }).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { auditLogs };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    if (err.status === 403) return redirect('/learner');
    return {};
  }
};
