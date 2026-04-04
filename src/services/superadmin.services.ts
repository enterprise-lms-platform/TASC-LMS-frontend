/**
 * Superadmin API Service
 * Handles superadmin-specific API calls (audit logs, user management, etc.)
 */

import { apiClient } from '../utils/config';
import type { AuditLogEntry, AuditLogFilters, PaginatedResponse } from '../types/types';

// ── Shared types ──────────────────────────────────────────────────────────────

export interface CourseReview {
  id: number;
  course: number;
  course_title: string;
  user: number;
  user_name: string;
  rating: number;
  content: string;
  is_approved: boolean;
  is_rejected: boolean;
  is_featured: boolean;
  helpful_count: number;
  report_count: number;
  created_at: string;
  updated_at: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface DemoRequest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  team_size: string;
  phone: string;
  status: 'new' | 'contacted' | 'closed';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface SystemSettings {
  platform_name: string;
  platform_url: string;
  support_email: string;
  default_timezone: string;
  max_upload_mb: number;
}

export interface SecurityPolicy {
  mfa_enabled: boolean;
  mfa_required_roles: string[];
  min_password_length: number;
  require_uppercase: boolean;
  require_special: boolean;
  password_expiry_days: number;
  password_history: number;
  max_failed_attempts: number;
  lockout_duration_minutes: number;
  session_timeout_minutes: number;
  idle_timeout_minutes: number;
  max_concurrent_sessions: number;
  force_single_session: boolean;
}

export interface AssessmentItem {
  id: number;
  type: 'quiz' | 'assignment';
  title: string;
  course_title: string;
  question_count?: number;
  max_points?: number;
  submission_count: number;
}

export interface AssessmentStats {
  total: number;
  quizzes: number;
  assignments: number;
  pass_rate: number;
  total_attempts: number;
}

const BASE_PATH = '/api/v1/superadmin';

// AUDIT LOGS

export const auditLogApi = {
  getAll: (filters?: AuditLogFilters) =>
    apiClient.get<PaginatedResponse<AuditLogEntry>>(`${BASE_PATH}/audit-logs/`, {
      params: filters,
    }),
};

// BULK USER IMPORT

export interface BulkImportResult {
  message: string;
  total_rows: number;
  imported: number;
  failed: number;
  errors: Array<{
    row: number;
    email: string;
    error: string;
  }>;
}

export const bulkImportApi = {
  /**
   * Download CSV template for bulk user import
   */
  downloadTemplate: () => {
    window.open(`${import.meta.env.VITE_API_BASE_URL || ''}/api/v1/admin/users/csv_template/`, '_blank');
  },

  /**
   * Upload CSV file for bulk user import
   */
  uploadCSV: async (file: File): Promise<BulkImportResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<BulkImportResult>(
      `/api/v1/admin/users/bulk_import/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },
};

// ── Review Moderation ─────────────────────────────────────────────────────────

export const superadminReviewApi = {
  getAll: (params?: { status?: ReviewStatus; page?: number; page_size?: number }) =>
    apiClient.get<PaginatedResponse<CourseReview>>(`${BASE_PATH}/reviews/`, { params }),
  approve: (id: number) =>
    apiClient.post<CourseReview>(`${BASE_PATH}/reviews/${id}/approve/`),
  reject: (id: number) =>
    apiClient.post<CourseReview>(`${BASE_PATH}/reviews/${id}/reject/`),
  feature: (id: number, is_featured: boolean) =>
    apiClient.patch<CourseReview>(`${BASE_PATH}/reviews/${id}/feature/`, { is_featured }),
};

// ── Demo Requests ─────────────────────────────────────────────────────────────

export const superadminDemoRequestApi = {
  getAll: (params?: { status?: string; page?: number }) =>
    apiClient.get<PaginatedResponse<DemoRequest>>(`${BASE_PATH}/demo-requests/`, { params }),
  update: (id: number, data: Partial<DemoRequest>) =>
    apiClient.patch<DemoRequest>(`${BASE_PATH}/demo-requests/${id}/`, data),
};

// ── System Settings ───────────────────────────────────────────────────────────

export const systemSettingsApi = {
  get: () =>
    apiClient.get<SystemSettings>(`${BASE_PATH}/system/settings/`),
  patch: (data: Partial<SystemSettings>) =>
    apiClient.patch<SystemSettings>(`${BASE_PATH}/system/settings/`, data),
};

export const smtpApi = {
  patch: (data: Record<string, unknown>) =>
    apiClient.patch(`${BASE_PATH}/system/smtp/`, data),
  testEmail: (recipient?: string) =>
    apiClient.post<{ detail: string }>(`${BASE_PATH}/system/smtp/test/`, { recipient }),
};

// ── Security Policy ───────────────────────────────────────────────────────────

export const securityPolicyApi = {
  get: () =>
    apiClient.get<SecurityPolicy>(`${BASE_PATH}/security/policy/`),
  patch: (data: Partial<SecurityPolicy>) =>
    apiClient.patch<SecurityPolicy>(`${BASE_PATH}/security/policy/`, data),
};

export const terminateSessionsApi = {
  terminate: () =>
    apiClient.post<{ detail: string }>(`${BASE_PATH}/security/terminate-sessions/`),
};

// ── Assessments ───────────────────────────────────────────────────────────────

export const superadminAssessmentsApi = {
  getAll: (params?: { type?: 'quiz' | 'assignment'; page?: number; page_size?: number }) =>
    apiClient.get<PaginatedResponse<AssessmentItem>>(`${BASE_PATH}/assessments/`, { params }),
  getStats: () =>
    apiClient.get<AssessmentStats>(`${BASE_PATH}/assessments/stats/`),
};

// ── Export helpers ────────────────────────────────────────────────────────────

const downloadBlob = async (url: string, filename: string) => {
  const res = await apiClient.get(url, { responseType: 'blob' });
  const href = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(href);
};

export const exportApi = {
  users:         () => downloadBlob('/api/v1/superadmin/users/export-csv/',         'users.csv'),
  organizations: () => downloadBlob('/api/v1/superadmin/organizations/export-csv/', 'organizations.csv'),
  courses:       () => downloadBlob('/api/v1/catalogue/courses/export-csv/',        'courses.csv'),
  invoices:      () => downloadBlob('/api/v1/payments/invoices/export-csv/',        'invoices.csv'),
  transactions:  () => downloadBlob('/api/v1/payments/transactions/export-csv/',    'transactions.csv'),
};
