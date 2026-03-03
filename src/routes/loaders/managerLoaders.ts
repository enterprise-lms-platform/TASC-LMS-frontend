/**
 * Manager/LMS Manager Route Loaders
 * Pre-fetches data for LMS management pages
 */

import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'react-router-dom';
import { queryKeys } from '../../hooks/queryKeys';
import { categoryApi, courseApi, type CategoryListParams } from '../../services/catalogue.services';

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
