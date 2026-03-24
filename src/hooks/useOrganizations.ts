// useOrganizations.ts — hooks for organization queries

import { useQuery } from '@tanstack/react-query';
import { organizationApi, type OrganizationListParams } from '../services/organization.services';
import { queryKeys } from './queryKeys';
import type { Organization } from '../types/types';

export const useOrganizations = (params?: OrganizationListParams) =>
  useQuery({
    queryKey: queryKeys.organizations.all(params),
    queryFn: () =>
      organizationApi.getAll(params).then((r) => {
        const data = r.data;
        // Handle DRF paginated response { results: [...], count: N }
        if (Array.isArray(data)) return data;
        if (data && typeof data === 'object' && 'results' in data)
          return (data as unknown as { results: Organization[] }).results;
        return [] as Organization[];
      }),
  });

export const useOrganization = (id: number) =>
  useQuery({
    queryKey: queryKeys.organizations.detail(id),
    queryFn: () => organizationApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });
