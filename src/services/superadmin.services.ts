/**
 * Superadmin API Service
 * Handles superadmin-specific API calls (audit logs, etc.)
 */

import { apiClient } from '../utils/config';
import type { AuditLogEntry, AuditLogFilters, PaginatedResponse } from '../types/types';

const BASE_PATH = '/api/v1/superadmin';

export const bulkImportApi = {
  getCsvTemplate: () =>
    apiClient.get<Blob>(`${BASE_PATH}/users/csv_template/`, {
      responseType: 'blob',
    }),

  bulkImport: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<any>(`${BASE_PATH}/users/bulk_import/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const auditLogApi = {
  getAll: (filters?: AuditLogFilters) =>
    apiClient.get<PaginatedResponse<AuditLogEntry>>(`${BASE_PATH}/audit-logs/`, {
      params: filters,
    }),
};
