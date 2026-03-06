/**
 * Catalogue API Service
 * Handles courses, categories, sessions, and tags
 */

import { apiClient } from '../utils/config';
import type {
  Category,
  CategoryDetail,
  CategoryCreateRequest,
  Tag,
  CourseList,
  CourseDetail,
  CourseCreateRequest,
  Session,
  SessionCreateRequest,
  PaginatedResponse,
  CourseApprovalRequest,
  CourseApprovalActionRequest,
} from '../types/types';

const BASE_PATH = '/api/v1/catalogue';

// CATEGORIES

export interface CategoryListParams {
  parent?: number;
  // TODO: Backend API must support these query parameters
  search?: string;
  page?: number;
  limit?: number;
}

export const categoryApi = {

  // Get all categories
  getAll: (params?: CategoryListParams) =>
    apiClient.get<Category[]>(`${BASE_PATH}/categories/`, { params }),


  // Get category details by ID
  getById: (id: number) =>
    apiClient.get<CategoryDetail>(`${BASE_PATH}/categories/${id}/`),

  // Create a new category
  create: (data: CategoryCreateRequest) =>
    apiClient.post<Category>(`${BASE_PATH}/categories/`, data),

  // Update a category
  update: (id: number, data: CategoryCreateRequest) =>
    apiClient.put<Category>(`${BASE_PATH}/categories/${id}/`, data),

  // Partially update a category
  partialUpdate: (id: number, data: Partial<CategoryCreateRequest>) =>
    apiClient.patch<Category>(`${BASE_PATH}/categories/${id}/`, data),

  // Delete a category
  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/categories/${id}/`),
};

// TAGS

export const tagApi = {

  // Get all tags
  getAll: () =>
    apiClient.get<Tag[]>(`${BASE_PATH}/tags/`),


  // Get tag details by ID
  getById: (id: number) =>
    apiClient.get<Tag>(`${BASE_PATH}/tags/${id}/`),
};

// COURSES

export interface CourseListParams {
  category?: number;
  instructor?: number;
  is_published?: boolean;
  tag?: string;
  page?: number;
  page_size?: number;
  // TODO: Backend API must support these query parameters
  search?: string;              // Full-text search across course title/description
  instructor_courses?: boolean; // Filter to only courses owned by the authenticated instructor
  limit?: number;               // Limit the number of results returned
  status?: string;              // Filter by course status (e.g., 'draft', 'published')
}

export const courseApi = {

  // List all courses with optional filters
  getAll: (params?: CourseListParams) =>
    apiClient.get<PaginatedResponse<CourseList>>(`${BASE_PATH}/courses/`, {
      params,
    }),


  // Get course details by ID
  getById: (id: number) =>
    apiClient.get<CourseDetail>(`${BASE_PATH}/courses/${id}/`),


  // Create a new course (instructor/admin only)
  create: (data: CourseCreateRequest) =>
    apiClient.post<CourseDetail>(`${BASE_PATH}/courses/`, data),


  // Update a course (instructor/admin only)
  update: (id: number, data: CourseCreateRequest) =>
    apiClient.put<CourseDetail>(`${BASE_PATH}/courses/${id}/`, data),


  // Partially update a course (instructor/admin only)
  partialUpdate: (id: number, data: Partial<CourseCreateRequest>) =>
    apiClient.patch<CourseDetail>(`${BASE_PATH}/courses/${id}/`, data),


  // Delete a course (instructor/admin only)
  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/courses/${id}/`),

  // Submit a draft course for approval
  submitForApproval: (id: number) =>
    apiClient.post<CourseDetail>(`${BASE_PATH}/courses/${id}/submit-for-approval/`),

  // Request deletion of a published course (goes through approval)
  requestDeletion: (id: number) =>
    apiClient.post<CourseDetail>(`${BASE_PATH}/courses/${id}/request-deletion/`),
};

// SESSIONS

export interface SessionListParams {
  course?: number;
  type?: 'video' | 'text' | 'live' | 'document' | 'html' | 'quiz' | 'assignment' | 'scorm';
}

export const sessionApi = {

  // List all sessions with optional filters
  getAll: (params?: SessionListParams) =>
    apiClient.get<Session[]>(`${BASE_PATH}/sessions/`, { params }),


  // Get session details by ID
  getById: (id: number) =>
    apiClient.get<Session>(`${BASE_PATH}/sessions/${id}/`),


  // Create a new session
  create: (data: SessionCreateRequest) =>
    apiClient.post<Session>(`${BASE_PATH}/sessions/`, data),


  // Update a session
  update: (id: number, data: SessionCreateRequest) =>
    apiClient.put<Session>(`${BASE_PATH}/sessions/${id}/`, data),


  // Partially update a session
  partialUpdate: (id: number, data: Partial<SessionCreateRequest>) =>
    apiClient.patch<Session>(`${BASE_PATH}/sessions/${id}/`, data),


  // Delete a session
  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/sessions/${id}/`),
};

// COURSE APPROVAL REQUESTS

export interface ApprovalListParams {
  status?: string;
  request_type?: string;
  course?: number;
  page?: number;
  page_size?: number;
}

export const courseApprovalApi = {
  // List all approval requests with optional filters
  getAll: (params?: ApprovalListParams) =>
    apiClient.get<PaginatedResponse<CourseApprovalRequest>>(
      `${BASE_PATH}/approval-requests/`,
      { params },
    ),

  // Get a single approval request by ID
  getById: (id: number) =>
    apiClient.get<CourseApprovalRequest>(`${BASE_PATH}/approval-requests/${id}/`),

  // Approve a course approval request
  approve: (id: number, data?: CourseApprovalActionRequest) =>
    apiClient.post<CourseApprovalRequest>(
      `${BASE_PATH}/approval-requests/${id}/approve/`,
      data,
    ),

  // Reject a course approval request (reviewer_comments required)
  reject: (id: number, data: CourseApprovalActionRequest) =>
    apiClient.post<CourseApprovalRequest>(
      `${BASE_PATH}/approval-requests/${id}/reject/`,
      data,
    ),
};