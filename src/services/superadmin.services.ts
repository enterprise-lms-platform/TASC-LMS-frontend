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
