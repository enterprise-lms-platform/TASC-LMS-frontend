
// Public API Service

import { apiClient } from '../utils/config';
import type {
  Category,
  Tag,
  CourseList,
  PublicCourseDetail,
  HealthCheckResponse,
} from '../types/types';

const PUBLIC_PATH = '/api/v1/public';
const HEALTH_PATH = '/api/v1/health';

// HEALTH CHECK

export const healthApi = {
  //  Health check endpoint
  check: () =>
    apiClient.get<HealthCheckResponse>(HEALTH_PATH),
};

// PUBLIC CATEGORIES

export const publicCategoryApi = {
  //  List all active categories (no auth required)
  getAll: () =>
    apiClient.get<{ count: number; results: Category[] }>(`${PUBLIC_PATH}/categories/`),

  //  Get category details (no auth required)
  getById: (id: number) =>
    apiClient.get<Category>(`${PUBLIC_PATH}/categories/${id}/`),
};

// PUBLIC TAGS

export const publicTagApi = {
  // List all tags (no auth required)
  getAll: () =>
    apiClient.get<Tag[]>(`${PUBLIC_PATH}/tags/`),

  // Get tag details (no auth required)
  getById: (id: number) =>
    apiClient.get<Tag>(`${PUBLIC_PATH}/tags/${id}/`),
};

// PUBLIC COURSES

export interface PublicCourseParams {
  category?: number;
  featured?: boolean;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface PlatformStats {
  courses: number;
  learners: number;
  instructors: number;
  certificates: number;
}

export interface TrustedClient {
  name: string;
  logo_url: string;
}

export const publicCourseApi = {
  // List published courses (no auth required)
  getAll: (params?: PublicCourseParams) =>
    apiClient.get<{ count: number; results: CourseList[] }>(`${PUBLIC_PATH}/courses/`, {
      params,
    }),

  // Get course details by slug (no auth required)
  getBySlug: (slug: string) =>
    apiClient.get<PublicCourseDetail>(`${PUBLIC_PATH}/courses/${slug}/`),
};

// PUBLIC STATS

export const publicStatsApi = {
  // Get platform-wide statistics
  getStats: () =>
    apiClient.get<PlatformStats>(`${PUBLIC_PATH}/stats/`),
};

// TRUSTED CLIENTS

export const publicClientsApi = {
  // Get trusted client logos for landing page
  getClients: () =>
    apiClient.get<TrustedClient[]>(`${PUBLIC_PATH}/clients/`),
};

// PUBLIC SUBSCRIPTION PLANS (for landing page pricing)

export interface PublicSubscriptionPlan {
  id: number;
  name: string;
  description?: string;
  price: string;
  currency: string;
  billing_cycle: string;
  features?: unknown;
  status?: string;
}

export const publicSubscriptionPlansApi = {
  // List active subscription plans for public pricing display (no auth required)
  getAll: () =>
    apiClient.get<{ count: number; results: PublicSubscriptionPlan[] }>(`${PUBLIC_PATH}/subscription-plans/`),
};