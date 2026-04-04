/**
 * Users API Service
 * Handles user management for admin/manager roles
 * Endpoints: /api/v1/admin/users/
 */

import { apiClient } from '../utils/config';
import type { InviteUserRequest, PaginatedResponse } from '../types/types';

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

export interface InviteUserResponse {
  detail: string;
  email: string;
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

  /** Super Admin: invite a user by email (same endpoint as admin invite flow) */
  invite: (data: InviteUserRequest) =>
    apiClient.post<InviteUserResponse>(`${BASE_PATH}/invite/`, data),

  // Get instructor stats (derived client-side until backend endpoint exists)
  getInstructorStats: async (): Promise<InstructorStats> => {
    const response = await apiClient.get<PaginatedResponse<InstructorListItem>>(`${BASE_PATH}/`, {
      params: { role: 'instructor', page_size: 1000 }
    });
    const instructors = response.data.results || [];
    const ratings = instructors.map(i => i.rating).filter((r): r is number => r != null);
    const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;
    return {
      total: instructors.length,
      active: instructors.filter(i => i.is_active).length,
      avg_rating: Math.round(avgRating * 10) / 10,
      total_courses: instructors.reduce((sum, i) => sum + (i.courses_count || 0), 0),
    };
  },
};

export interface UserStats {
  total: number;
  active: number;
  new_this_month: number;
  suspended: number;
}

export const userStatsApi = {
  getStats: () =>
    apiClient.get<UserStats>('/api/v1/superadmin/users/stats/'),
};

export default usersApi;
