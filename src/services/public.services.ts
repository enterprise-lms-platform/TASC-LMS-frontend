
// Public API Service

import { apiClient } from '../utils/config';
import type {
  Category,
  Tag,
  CourseList,
  PublicCourseDetail,
  PaginatedResponse,
  HealthCheckResponse,
  Subscription,
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
    apiClient.get<PaginatedResponse<Category>>(`${PUBLIC_PATH}/categories/`),

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
  page?: number;
  page_size?: number;
  /** Matches public course list `search` query (title, description, instructor). */
  search?: string;
}

/** Public landing-page subscription plan row from `/api/v1/public/subscription-plans/`. */
export type PublicSubscriptionPlan = Pick<
  Subscription,
  'id' | 'name' | 'description' | 'price' | 'currency' | 'billing_cycle' | 'features' | 'status'
>;

export const publicSubscriptionPlansApi = {
  getAll: () =>
    apiClient.get<PaginatedResponse<PublicSubscriptionPlan>>(`${PUBLIC_PATH}/subscription-plans/`),
};

export interface PlatformStats {
  courses: number;
  learners: number;
  instructors: number;
  certificates: number;
}

export interface TrustedClient {
  id: number;
  name: string;
  logo_url: string;
  website_url: string;
  is_active: boolean;
  order: number;
  created_at: string;
}

export const publicCourseApi = {
  // List published courses (no auth required)
  getAll: (params?: PublicCourseParams) =>
    apiClient.get<PaginatedResponse<CourseList>>(`${PUBLIC_PATH}/courses/`, {
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
    apiClient.get<PaginatedResponse<TrustedClient>>(`${PUBLIC_PATH}/clients/`),
};

// BUSINESS PRICING

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billing_period: string;
  features: string[];
  recommended?: boolean;
  max_users?: number;
  storage_gb?: number;
}

export const businessPricingApi = {
  // Get business/enterprise pricing plans
  getPlans: () =>
    apiClient.get<PricingPlan[]>(`${PUBLIC_PATH}/pricing/business/`),
};

// FAQS

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

export const faqApi = {
  // Get FAQs for landing pages
  getAll: () =>
    apiClient.get<FaqItem[]>(`${PUBLIC_PATH}/faqs/`),
};