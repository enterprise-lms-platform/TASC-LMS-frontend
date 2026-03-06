// useOrganizations.ts — hooks for organization queries

import { useQuery } from '@tanstack/react-query';
import { organizationApi, type OrganizationListParams } from '../services/organization.services';
import { queryKeys } from './queryKeys';

export const useOrganizations = (params?: OrganizationListParams) =>
  useQuery({
    queryKey: queryKeys.organizations.all(params),
    queryFn: () => organizationApi.getAll(params).then((r) => r.data),
  });

export const useOrganization = (id: number) =>
  useQuery({
    queryKey: queryKeys.organizations.detail(id),
    queryFn: () => organizationApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });
