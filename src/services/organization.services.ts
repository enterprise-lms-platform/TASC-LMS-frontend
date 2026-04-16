/**
 * Organization API Service
 * Handles organization listing for admin user management
 */

import { apiClient } from '../utils/config';
import type { Organization, PaginatedResponse } from '../types/types';

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

export interface SeatUsage {
  organization: {
    id: number;
    name: string;
  };
  seats: {
    max: number | null;
    used: number;
    remaining: number | null;
    percent_used: number;
    at_warning: boolean;
    at_capacity: boolean;
  };
}

export interface OrgMember {
  id: number;
  user_id: number;
  name: string;
  email: string;
  role: string;
  joined_at: string;
}

export interface OrgMembersResponse {
  results: OrgMember[];
}

export const seatManagementApi = {
  getSeatUsage: () =>
    apiClient.get<SeatUsage>(`/api/v1/admin/seats/`),
  
  getMembers: () =>
    apiClient.get<OrgMembersResponse>(`/api/v1/admin/members/`),
  
  unassignMember: (memberId: number) =>
    apiClient.delete(`/api/v1/admin/members/${memberId}/`),
};

// Business Testimonials API
export interface BusinessTestimonial {
  id: number;
  user: number;
  user_name: string;
  company_name: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'featured';
  created_at: string;
  updated_at: string;
}

export interface BusinessTestimonialCreate {
  company_name: string;
  content: string;
  rating: number;
}

export const testimonialApi = {
  // Get all testimonials (TASC Admin sees all, Org Admin sees theirs)
  getAll: () =>
    apiClient.get<BusinessTestimonial[]>(`/api/v1/admin/testimonials/`),

  // Get single testimonial
  getById: (id: number) =>
    apiClient.get<BusinessTestimonial>(`/api/v1/admin/testimonials/${id}/`),

  // Submit a new testimonial (Org Admin)
  create: (data: BusinessTestimonialCreate) =>
    apiClient.post<BusinessTestimonial>(`/api/v1/admin/testimonials/`, data),

  // Update testimonial status (TASC Admin only)
  updateStatus: (id: number, status: 'pending' | 'approved' | 'featured') =>
    apiClient.patch<BusinessTestimonial>(`/api/v1/admin/testimonials/${id}/`, { status }),

  // Delete testimonial
  delete: (id: number) =>
    apiClient.delete(`/api/v1/admin/testimonials/${id}/`),
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

export interface ManagerMemberItem {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface ManagerMembersParams {
  search?: string;
  role?: string;
  page?: number;
  page_size?: number;
}

export interface BulkImportMembersResult {
  message: string;
  total_rows: number;
  imported: number;
  failed: number;
  errors: Array<{ row: number; email: string; error: string }>;
}

export const managerMembersApi = {
  getAll: (params?: ManagerMembersParams) =>
    apiClient.get<PaginatedResponse<ManagerMemberItem>>(`/api/v1/auth/manager/members/`, { params }),

  bulkImport: async (file: File): Promise<BulkImportMembersResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<BulkImportMembersResult>(
      `/api/v1/auth/manager/members/import/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },
};

export interface SecurityStats {
  failed_logins_today: number;
  locked_accounts: number;
  active_sessions: number;
  mfa_adoption_percent: number;
}

export interface UserSession {
  id: number;
  user: number;
  user_email: string;
  user_name: string;
  session_key: string;
  ip_address: string | null;
  user_agent: string;
  device_info: Record<string, unknown>;
  last_activity: string;
  created_at: string;
  is_active: boolean;
}

export interface SessionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserSession[];
}

export const securityApi = {
  getStats: () =>
    apiClient.get<SecurityStats>(`/api/v1/superadmin/security/stats/`),
  getSessions: (params?: { user?: string; is_active?: boolean; recent?: boolean }) =>
    apiClient.get<SessionsResponse>(`/api/v1/superadmin/sessions/`, { params }),
  terminateSession: (id: number) =>
    apiClient.delete(`/api/v1/superadmin/sessions/${id}/`),
};
