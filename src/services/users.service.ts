/**
 * Users API Service
 * Handles user management for admin/manager roles
 * Endpoints: /api/v1/admin/users/
 */

import { apiClient } from '../utils/config';
import type { PaginatedResponse } from '../types/types';

const BASE_PATH = '/api/v1/admin/users';

export interface UserListParams {
  role?: string;
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface UserListItem {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  avatar?: string | null;
  google_picture?: string | null;
  created_at: string;
  last_login?: string | null;
}

export interface UserUpdateRequest {
  role?: string;
  is_active?: boolean;
  first_name?: string;
  last_name?: string;
}

export interface InstructorStats {
  total: number;
  active: number;
  avg_rating: number;
  total_courses: number;
}

export interface InstructorListItem extends UserListItem {
  specialization?: string;
  bio?: string;
  courses_count: number;
  students_count: number;
  rating?: number;
}

export const usersApi = {
  // Get all users with filters
  getAll: (params?: UserListParams) =>
    apiClient.get<PaginatedResponse<UserListItem>>(`${BASE_PATH}/`, { params }),

  // Get user by ID
  getById: (id: number) =>
    apiClient.get<UserListItem>(`${BASE_PATH}/${id}/`),

  // Update user (role, is_active, profile)
  update: (id: number, data: UserUpdateRequest) =>
    apiClient.patch<UserListItem>(`${BASE_PATH}/${id}/`, data),

  // Deactivate user (suspend)
  deactivate: (id: number) =>
    apiClient.patch<UserListItem>(`${BASE_PATH}/${id}/`, { is_active: false }),

  // Activate user
  activate: (id: number) =>
    apiClient.patch<UserListItem>(`${BASE_PATH}/${id}/`, { is_active: true }),

  // Get instructors only
  getInstructors: (params?: UserListParams) =>
    apiClient.get<PaginatedResponse<InstructorListItem>>(`${BASE_PATH}/`, { 
      params: { ...params, role: 'instructor' } 
    }),

  // Get instructor stats (would need custom endpoint, fallback to counting)
  getInstructorStats: async (): Promise<InstructorStats> => {
    const response = await apiClient.get<PaginatedResponse<InstructorListItem>>(`${BASE_PATH}/`, {
      params: { role: 'instructor', page_size: 1000 }
    });
    const instructors = response.data.results || [];
    return {
      total: instructors.length,
      active: instructors.filter(i => i.is_active).length,
      avg_rating: 4.5, // Placeholder - needs backend support
      total_courses: instructors.reduce((sum, i) => sum + (i.courses_count || 0), 0),
    };
  },
};

export default usersApi;
