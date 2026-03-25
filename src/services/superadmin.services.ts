/**
 * Superadmin API Service
 * Handles superadmin-specific API calls (audit logs, user management, etc.)
 */

import { apiClient } from '../utils/config';
import type { AuditLogEntry, AuditLogFilters, PaginatedResponse } from '../types/types';

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
    window.open(`${import.meta.env.VITE_API_URL || ''}${BASE_PATH}/users/csv_template/`, '_blank');
  },

  /**
   * Upload CSV file for bulk user import
   */
  uploadCSV: async (file: File): Promise<BulkImportResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<BulkImportResult>(
      `${BASE_PATH}/users/bulk_import/`,
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
