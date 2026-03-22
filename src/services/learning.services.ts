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

export interface EnrollmentParams {
  course?: number;
  search?: string;              // Search by learner name/email or course title
  courseId?: number;
  page?: number;
  dateRange?: string;
  role?: 'instructor';
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
  course?: number;
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

// QUIZ SUBMISSIONS

export interface QuizSubmissionAnswer {
  question: number;
  selected_answer: Record<string, unknown>;
  is_correct?: boolean | null;
  points_awarded?: number | null;
}

export interface QuizSubmission {
  id: number;
  enrollment: number;
  quiz: number;
  quiz_title?: string;
  course_title?: string;
  attempt_number: number;
  score?: number | null;
  max_score: number;
  passed: boolean;
  time_spent_seconds: number;
  submitted_at: string;
  answers: QuizSubmissionAnswer[];
}

export interface QuizSubmissionCreateRequest {
  enrollment: number;
  quiz: number;
  time_spent_seconds?: number;
  answers: { question: number; selected_answer: Record<string, unknown> }[];
}

export const quizSubmissionApi = {
  getAll: (params?: { quiz?: number; enrollment?: number; page?: number; page_size?: number }) =>
    apiClient.get<QuizSubmission[]>(`${BASE_PATH}/quiz-submissions/`, { params }),

  create: (data: QuizSubmissionCreateRequest) =>
    apiClient.post<QuizSubmission>(`${BASE_PATH}/quiz-submissions/`, data),

  getById: (id: number) =>
    apiClient.get<QuizSubmission>(`${BASE_PATH}/quiz-submissions/${id}/`),
};

// GRADE STATISTICS

export interface GradeDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface GradeStatisticsResponse {
  total_submissions: number;
  average_score: number;
  pass_count: number;
  fail_count: number;
  distribution: GradeDistribution[];
}

export const gradeStatisticsApi = {
  getStatistics: (courseId?: number) =>
    apiClient.get<GradeStatisticsResponse>(`${BASE_PATH}/submissions/statistics/`, {
      params: courseId ? { course: courseId } : undefined,
    }),
};

// MANAGER ENROLLMENT API
export const managerEnrollmentApi = {
  getAll: (params?: { course?: number; user?: number; is_active?: boolean; page?: number; page_size?: number }) =>
    apiClient.get(`${BASE_PATH}/enrollments/`, { params }),

  enroll: (data: { user: number; course: number }) =>
    apiClient.post(`${BASE_PATH}/enrollments/`, data),

  unenroll: (id: number) =>
    apiClient.delete(`${BASE_PATH}/enrollments/${id}/`),
};

// MANAGER SESSION PROGRESS API
export const managerSessionProgressApi = {
  getAll: (params?: { enrollment?: number; session?: number; page?: number; page_size?: number }) =>
    apiClient.get(`${BASE_PATH}/session-progress/`, { params }),

  update: (id: number, data: Record<string, unknown>) =>
    apiClient.patch(`${BASE_PATH}/session-progress/${id}/`, data),
};

// MANAGER CERTIFICATE API
export const managerCertificateApi = {
  getAll: (params?: { enrollment?: number; course?: number; is_verified?: boolean; page?: number; page_size?: number }) =>
    apiClient.get(`${BASE_PATH}/certificates/`, { params }),

  issue: (data: { enrollment: number }) =>
    apiClient.post(`${BASE_PATH}/certificates/`, data),

  revoke: (id: number) =>
    apiClient.delete(`${BASE_PATH}/certificates/${id}/`),
};

// MANAGER GRADES API
export interface StudentGrade {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  enrollment: number;
  assignment_title: string;
  submission_date: string;
  grade?: number | null;
  max_grade: number;
  status: string;
  feedback?: string | null;
}

export const managerGradesApi = {
  getStudentGrades: (courseId: number) =>
    apiClient.get<StudentGrade[]>(`${BASE_PATH}/submissions/`, {
      params: { course: courseId },
    }),

  gradeSubmission: (id: number, data: { grade: number; feedback?: string }) =>
    apiClient.patch(`${BASE_PATH}/submissions/${id}/`, data),

  bulkGrade: (data: Array<{ id: number; grade: number; feedback?: string }>) =>
    apiClient.post(`${BASE_PATH}/submissions/bulk_grade/`, { submissions: data }),
};

