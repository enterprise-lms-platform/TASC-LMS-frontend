import { useQuery } from '@tanstack/react-query';
import { auditLogApi } from '../services/superadmin.services';
import { queryKeys } from './queryKeys';
import type { AuditLogFilters } from '../types/types';

export const useAuditLogs = (filters?: AuditLogFilters) =>
  useQuery({
    queryKey: queryKeys.auditLogs.all(filters),
    queryFn: () => auditLogApi.getAll(filters).then((r) => r.data),
  });
