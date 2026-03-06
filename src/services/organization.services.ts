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
  limit?: number;
}

export const organizationApi = {
  getAll: (params?: OrganizationListParams) =>
    apiClient.get<Organization[]>(`/api/v1/admin/organizations/`, { params }),

  getById: (id: number) =>
    apiClient.get<Organization>(`/api/v1/admin/organizations/${id}/`),
};
