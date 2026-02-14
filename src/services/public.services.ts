
// Public API Service

import { apiClient } from '../utils/config';
import type {
  Category,
  Tag,
  CourseList,
  PublicCourseDetail,
  PaginatedResponse,
  HealthCheckResponse,
} from '../types/types';

const PUBLIC_PATH = '/api/v1/public';
const HEALTH_PATH = '/api/v1/health';

// HEALTH CHECK

export const healthApi = {
  // P Health check endpoint
  check: () =>
    apiClient.get<HealthCheckResponse>(HEALTH_PATH),
};

// PUBLIC CATEGORIES

export const publicCategoryApi = {
  // P List all active categories (no auth required)
  getAll: () =>
    apiClient.get<Category[]>(`${PUBLIC_PATH}/categories/`),

  // P Get category details (no auth required)
  getById: (id: number) =>
    apiClient.get<Category>(`${PUBLIC_PATH}/categories/${id}/`),
};

// PUBLIC TAGS

export const publicTagApi = {
  // P List all tags (no auth required)
  getAll: () =>
    apiClient.get<Tag[]>(`${PUBLIC_PATH}/tags/`),

  // P Get tag details (no auth required)
  getById: (id: number) =>
    apiClient.get<Tag>(`${PUBLIC_PATH}/tags/${id}/`),
};

// PUBLIC COURSES

export interface PublicCourseParams {
  category?: number;
  featured?: boolean;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  page?: number;
  page_size?: number;
}

export const publicCourseApi = {
  // P List published courses (no auth required)
  getAll: (params?: PublicCourseParams) =>
    apiClient.get<PaginatedResponse<CourseList>>(`${PUBLIC_PATH}/courses/`, {
      params,
    }),

  // P Get course details by slug (no auth required)
  getBySlug: (slug: string) =>
    apiClient.get<PublicCourseDetail>(`${PUBLIC_PATH}/courses/${slug}/`),
};