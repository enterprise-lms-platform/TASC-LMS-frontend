/**
 * Organization API Service
 * Handles organization listing for admin user management
 */

import { apiClient } from '../utils/config';
import type { Organization } from '../types/types';

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
};

export const managerSettingsApi = {
  get: () =>
    apiClient.get<Organization>(`/api/v1/auth/manager/organization-settings/`),

  update: (data: Partial<Organization>) =>
    apiClient.patch<Organization>(`/api/v1/auth/manager/organization-settings/`, data),
};
