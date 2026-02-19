/**
 * TanStack Query hook for superadmin audit logs.
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { auditLogApi } from '../services/superadmin.services';
import type { AuditLogFilters } from '../types/types';

export const auditLogKeys = {
  all: ['audit-logs'] as const,
  list: (filters: AuditLogFilters) => [...auditLogKeys.all, filters] as const,
};

export const useAuditLogs = (filters: AuditLogFilters) =>
  useQuery({
    queryKey: auditLogKeys.list(filters),
    queryFn: async () => {
      // Strip empty/default values so they aren't sent as query params
      const cleanFilters: Record<string, string | number> = {};
      if (filters.search) cleanFilters.search = filters.search;
      if (filters.from) cleanFilters.from = filters.from;
      if (filters.to) cleanFilters.to = filters.to;
      if (filters.action) cleanFilters.action = filters.action.toLowerCase();
      if (filters.resource) cleanFilters.resource = filters.resource.toLowerCase();
      if (filters.page) cleanFilters.page = filters.page;
      if (filters.page_size) cleanFilters.page_size = filters.page_size;

      const { data } = await auditLogApi.getAll(cleanFilters);
      return data;
    },
    placeholderData: keepPreviousData,
  });
