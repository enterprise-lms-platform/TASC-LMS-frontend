/**
 * Organization API Service
 * Handles organization listing for admin user management
 */

import { apiClient } from '../utils/config';
import type { Organization } from '../types/types';

export interface OrganizationListParams {
  search?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
  limit?: number;
}

export const organizationApi = {
  getAll: (params?: OrganizationListParams) =>
    apiClient.get<Organization[]>(`/api/v1/superadmin/organizations/`, { params }),

  getById: (id: number) =>
    apiClient.get<Organization>(`/api/v1/superadmin/organizations/${id}/`),

  create: (data: Partial<Organization>) =>
    apiClient.post<Organization>(`/api/v1/superadmin/organizations/`, data),

  update: (id: number, data: Partial<Organization>) =>
    apiClient.patch<Organization>(`/api/v1/superadmin/organizations/${id}/`, data),

  deactivate: (id: number) =>
    apiClient.patch<Organization>(`/api/v1/superadmin/organizations/${id}/`, { is_active: false }),
};

export const managerSettingsApi = {
  get: () =>
    apiClient.get<Organization>(`/api/v1/auth/manager/organization-settings/`),

  update: (data: Partial<Organization>) =>
    apiClient.patch<Organization>(`/api/v1/auth/manager/organization-settings/`, data),
};

export interface ActivityEvent {
  type: 'Enrollment' | 'Completion' | 'Submission';
  user_name: string;
  description: string;
  timestamp: string;
  relative_time: string;
}

export interface ActivitySummary {
  enrollments: number;
  completions: number;
  submissions: number;
}

export interface ActivityResponse {
  events: ActivityEvent[];
  summary: ActivitySummary;
}

export const managerActivityApi = {
  getActivity: (range: 'today' | '7days' | '30days' = '7days') =>
    apiClient.get<ActivityResponse>(`/api/v1/auth/manager/activity/`, { params: { range } }),
};

export interface ManagerBillingPlan {
  plan_name: string | null;
  price: string;
  currency: string;
  billing_cycle: string | null;
  renewal_date: string | null;
  user_limit: number | null;
}

export interface ManagerBillingUsage {
  active_users: number;
  active_courses: number;
}

export const managerBillingApi = {
  getPlan: () =>
    apiClient.get<ManagerBillingPlan>(`/api/v1/auth/manager/billing/plan/`),

  getUsage: () =>
    apiClient.get<ManagerBillingUsage>(`/api/v1/auth/manager/billing/usage/`),
};

export interface SecurityStats {
  failed_logins_today: number;
  locked_accounts: number;
  active_sessions: number;
  mfa_adoption_percent: number;
}

export const securityApi = {
  getStats: () =>
    apiClient.get<SecurityStats>(`/api/v1/superadmin/security/stats/`),
};
