/**
 * Learning API Service
 * Handles enrollments, progress tracking, certificates, and discussions
 */

import { apiClient } from '../utils/config';
import type {
  Enrollment,
  EnrollmentCreateRequest,
  SessionProgress,
  SessionProgressUpdateRequest,
  Certificate,
  Discussion,
  DiscussionCreateRequest,
  DiscussionReply,
  DiscussionReplyCreateRequest,
} from '../types/types';

const BASE_PATH = '/api/v1/learning';

// ENROLLMENTS

// TODO: Backend API must support these query parameters for enrollment filtering
export interface EnrollmentParams {
  course?: number;              // Filter enrollments by course ID
  search?: string;              // Search enrollments by learner name/email
  courseId?: number;             // Alternative course filter used by some loaders
  page?: number;                // Pagination page number
  dateRange?: string;           // Filter by date range (used by analytics)
}

export const enrollmentApi = {

  //  List all enrollments for the authenticated user
  getAll: (params?: EnrollmentParams) =>
    apiClient.get<Enrollment[]>(`${BASE_PATH}/enrollments/`, { params }),


  //  Get enrollment details by ID
  getById: (id: number) =>
    apiClient.get<Enrollment>(`${BASE_PATH}/enrollments/${id}/`),


  //  Enroll in a course (idempotent: 201 first time, 200 if already enrolled)
  create: (data: EnrollmentCreateRequest) =>
    apiClient.post<Enrollment>(`${BASE_PATH}/enrollments/`, data),

  //  Generate certificate for completed enrollment
  generateCertificate: (id: number) =>
    apiClient.post<Certificate>(`${BASE_PATH}/enrollments/${id}/generate_certificate/`),
};

// SESSION PROGRESS

export interface SessionProgressParams {
  enrollment?: number;
  session?: number;
  // TODO: Backend API must support filtering session progress by course
  course?: number;              // Filter progress records by course ID
}

export const sessionProgressApi = {

  //  List session progress
  getAll: (params?: SessionProgressParams) =>
    apiClient.get<SessionProgress[]>(`${BASE_PATH}/session-progress/`, {
      params,
    }),


  //  Get session progress by ID
  getById: (id: number) =>
    apiClient.get<SessionProgress>(`${BASE_PATH}/session-progress/${id}/`),


  //  Create session progress entry
  create: (data: { enrollment: number; session: number }) =>
    apiClient.post<SessionProgress>(`${BASE_PATH}/session-progress/`, data),


  //  Update session progress
  update: (id: number, data: SessionProgressUpdateRequest) =>
    apiClient.put<SessionProgress>(`${BASE_PATH}/session-progress/${id}/`, data),


  //  Partially update session progress
  partialUpdate: (id: number, data: Partial<SessionProgressUpdateRequest>) =>
    apiClient.patch<SessionProgress>(`${BASE_PATH}/session-progress/${id}/`, data),


  //  Delete session progress
  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/session-progress/${id}/`),


  //  Mark session as completed
  markCompleted: (id: number, timeSpentSeconds?: number) =>
    apiClient.put<SessionProgress>(`${BASE_PATH}/session-progress/${id}/`, {
      is_completed: true,
      time_spent_seconds: timeSpentSeconds,
    }),
};

// CERTIFICATES

export const certificateApi = {

  //  List all certificates for the authenticated user
  getAll: () =>
    apiClient.get<Certificate[]>(`${BASE_PATH}/certificates/`),


  //  Get certificate details by ID
  getById: (id: number) =>
    apiClient.get<Certificate>(`${BASE_PATH}/certificates/${id}/`),


  //  Verify a certificate by certificate number
  verify: (certificateNumber: string) =>
    apiClient.get<Certificate>(`${BASE_PATH}/certificates/verify/`, {
      params: { certificate_number: certificateNumber },
    }),
};

// DISCUSSIONS

export interface DiscussionParams {
  course?: number;
  session?: number;
}

export const discussionApi = {

  //  List all discussions
  getAll: (params?: DiscussionParams) =>
    apiClient.get<Discussion[]>(`${BASE_PATH}/discussions/`, { params }),


  //  Get discussion details with replies
  getById: (id: number) =>
    apiClient.get<Discussion>(`${BASE_PATH}/discussions/${id}/`),


  //  Create a new discussion thread
  create: (data: DiscussionCreateRequest) =>
    apiClient.post<Discussion>(`${BASE_PATH}/discussions/`, data),


  //  Update a discussion
  update: (id: number, data: Partial<Discussion>) =>
    apiClient.put<Discussion>(`${BASE_PATH}/discussions/${id}/`, data),


  //  Partially update a discussion
  partialUpdate: (id: number, data: Partial<Discussion>) =>
    apiClient.patch<Discussion>(`${BASE_PATH}/discussions/${id}/`, data),


  //  Delete a discussion
  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/discussions/${id}/`),
};

// DISCUSSION REPLIES

export interface DiscussionReplyParams {
  discussion?: number;
}

export const discussionReplyApi = {

  //  List all replies
  getAll: (params?: DiscussionReplyParams) =>
    apiClient.get<DiscussionReply[]>(`${BASE_PATH}/discussion-replies/`, {
      params,
    }),


  //  Get reply details by ID
  getById: (id: number) =>
    apiClient.get<DiscussionReply>(`${BASE_PATH}/discussion-replies/${id}/`),


  //  Create a new reply
  create: (data: DiscussionReplyCreateRequest) =>
    apiClient.post<DiscussionReply>(`${BASE_PATH}/discussion-replies/`, data),


  //  Update a reply
  update: (id: number, data: Partial<DiscussionReply>) =>
    apiClient.put<DiscussionReply>(`${BASE_PATH}/discussion-replies/${id}/`, data),


  //  Partially update a reply
  partialUpdate: (id: number, data: Partial<DiscussionReply>) =>
    apiClient.patch<DiscussionReply>(`${BASE_PATH}/discussion-replies/${id}/`, data),


  //  Delete a reply
  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/discussion-replies/${id}/`),
};