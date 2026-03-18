/**
 * Superadmin Route Loaders
 * Pre-fetches system-wide admin data (users, organizations, audit logs, etc.)
 */

import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'react-router-dom';
import { queryKeys } from '../../hooks/queryKeys';
import { courseApi, courseApprovalApi } from '../../services/catalogue.services';
import { auditLogApi } from '../../services/superadmin.services';

const DEV_BYPASS_AUTH = import.meta.env.VITE_AUTH_BYPASS === 'true' && import.meta.env.DEV;

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
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
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
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
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
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    return { courses: { results: [], count: 0 } };
  }
};

/**
 * Superadmin Approval Queue Loader
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
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    if (err.status === 403) return redirect('/learner');
    return { approvalRequests: { results: [], count: 0 } };
  }
};

/**
 * Superadmin Approval Detail Loader
 * Pre-fetches a single approval request and its associated course
 */
export const approvalDetailLoader = async (
  queryClient: QueryClient,
  args: { params: { requestId?: string } }
) => {
  const requestId = Number(args.params.requestId);
  if (!requestId) return redirect('/superadmin');

  try {
    const approvalRequest = await queryClient.ensureQueryData({
      queryKey: queryKeys.approvalRequests.detail(requestId),
      queryFn: () => courseApprovalApi.getById(requestId).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

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
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    if (err.status === 403) return redirect('/learner');
    return redirect('/superadmin');
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
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    if (err.status === 403) return redirect('/learner');
    return {};
  }
};
