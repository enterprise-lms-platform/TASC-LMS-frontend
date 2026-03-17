/**
 * Superadmin API Service
 * Handles superadmin-specific API calls (audit logs, etc.)
 */

import { apiClient } from '../utils/config';
import type { AuditLogEntry, AuditLogFilters, PaginatedResponse } from '../types/types';

const BASE_PATH = '/api/v1/superadmin';

export const auditLogApi = {
  getAll: (filters?: AuditLogFilters) =>
    apiClient.get<PaginatedResponse<AuditLogEntry>>(`${BASE_PATH}/audit-logs/`, {
      params: filters,
    }),
};

// BULK IMPORT

export interface BulkImportResult {
  created: number;
  errors: { row: number; message: string }[];
}

export const bulkImportApi = {
  uploadCsv: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<BulkImportResult>(`${BASE_PATH}/users/bulk_import/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  downloadTemplate: () =>
    apiClient.get<Blob>(`${BASE_PATH}/users/csv_template/`, {
      responseType: 'blob',
    }),
};
