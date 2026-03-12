/**
 * Learning API Service
 * Handles enrollments, progress tracking, certificates, discussions, and submissions
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
  Submission,
  SubmissionCreateRequest,
  SubmissionUpdateRequest,
  GradeSubmissionRequest,
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

// SUBMISSIONS

export interface SubmissionParams {
  course?: number;              // Filter submissions by course ID
  session?: number;             // Filter submissions by session/assignment ID
  enrollment?: number;          // Filter submissions by enrollment ID
  status?: string;              // Filter by submission status
  page?: number;                // Pagination page number
}

export const submissionApi = {

  //  List all submissions (instructors see their course submissions, learners see their own)
  getAll: (params?: SubmissionParams) =>
    apiClient.get<Submission[]>(`${BASE_PATH}/submissions/`, { params }),

  //  Get submission details by ID
  getById: (id: number) =>
    apiClient.get<Submission>(`${BASE_PATH}/submissions/${id}/`),

  //  Create a new submission (learner)
  create: (data: SubmissionCreateRequest) =>
    apiClient.post<Submission>(`${BASE_PATH}/submissions/`, data),

  //  Update submission (learner can update draft submissions)
  update: (id: number, data: SubmissionUpdateRequest) =>
    apiClient.put<Submission>(`${BASE_PATH}/submissions/${id}/`, data),

  //  Partially update submission
  partialUpdate: (id: number, data: Partial<SubmissionUpdateRequest>) =>
    apiClient.patch<Submission>(`${BASE_PATH}/submissions/${id}/`, data),

  //  Grade a submission (instructor only)
  grade: (id: number, data: GradeSubmissionRequest) =>
    apiClient.post<Submission>(`${BASE_PATH}/submissions/${id}/grade/`, data),

  //  Delete a submission (usually only drafts)
  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/submissions/${id}/`),
};

// MANAGER-LEVEL QUERIES (for org-wide data)

// Manager enrollments - gets all enrollments in the org
export interface ManagerEnrollmentParams extends EnrollmentParams {
  organization?: number;
  status?: string;
}

export const managerEnrollmentApi = {
  // Get all enrollments across org (for manager dashboard)
  getAllEnrollments: (params?: ManagerEnrollmentParams) =>
    apiClient.get<Enrollment[]>(`${BASE_PATH}/enrollments/`, { params }),
};

// Manager session progress - gets all progress across org
export interface ManagerSessionProgressParams extends SessionProgressParams {
  organization?: number;
}

export const managerSessionProgressApi = {
  // Get all session progress across org
  getAllProgress: (params?: ManagerSessionProgressParams) =>
    apiClient.get<SessionProgress[]>(`${BASE_PATH}/session-progress/`, { params }),
};

// Manager certificates - gets all certificates across org
export interface ManagerCertificateParams {
  organization?: number;
  course?: number;
}

export const managerCertificateApi = {
  // Get all certificates across org
  getAllCertificates: (params?: ManagerCertificateParams) =>
    apiClient.get<Certificate[]>(`${BASE_PATH}/certificates/`, { params }),
};

// Manager grade/submission data
export interface GradeDistribution {
  grade: string;
  range: string;
  count: number;
  percentage: number;
  color: string;
}

export interface StudentGrade {
  enrollment_id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  course_id: number;
  course_name: string;
  assignment_score?: number;
  quiz_score?: number;
  overall_score: number;
  status: 'pass' | 'fail';
}

export const managerGradesApi = {
  // Get grade distribution (placeholder - needs backend)
  getGradeDistribution: async (_courseId?: number): Promise<GradeDistribution[]> => {
    // TODO: Replace with actual API call when backend endpoint exists
    // For now, return mock data structure
    return [
      { grade: 'A', range: '90-100', count: 0, percentage: 0, color: '#16a34a' },
      { grade: 'B', range: '80-89', count: 0, percentage: 0, color: '#3b82f6' },
      { grade: 'C', range: '70-79', count: 0, percentage: 0, color: '#ffa424' },
      { grade: 'D', range: '60-69', count: 0, percentage: 0, color: '#f97316' },
      { grade: 'F', range: '<60', count: 0, percentage: 0, color: '#ef4444' },
    ];
  },

  // Get student grades (placeholder - needs backend)
  getStudentGrades: async (_courseId?: number): Promise<StudentGrade[]> => {
    // TODO: Replace with actual API call when backend endpoint exists
    return [];
  },
};