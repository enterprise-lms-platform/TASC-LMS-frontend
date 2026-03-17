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
  Module,
  ModuleCreateRequest,
  QuizDetailResponse,
  QuizSettings,
  QuizQuestion,
  Session,
  SessionCreateRequest,
  PaginatedResponse,
  CourseApprovalRequest,
  CourseApprovalActionRequest,
  AssetUrlResponse,
  QuestionCategory,
  BankQuestion,
  BankQuestionListParams,
  AddFromBankPayload,
  AddFromBankResponse,
  AssignmentConfig,
  AssignmentConfigCreateUpdate,
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

// MODULES

export interface ModuleListParams {
  course?: number;
}

export const moduleApi = {
  getAll: (params?: ModuleListParams) =>
    apiClient.get<PaginatedResponse<Module>>(`${BASE_PATH}/modules/`, { params }),

  getById: (id: number) =>
    apiClient.get<Module>(`${BASE_PATH}/modules/${id}/`),

  create: (data: ModuleCreateRequest) =>
    apiClient.post<Module>(`${BASE_PATH}/modules/`, data),

  partialUpdate: (id: number, data: Partial<ModuleCreateRequest>) =>
    apiClient.patch<Module>(`${BASE_PATH}/modules/${id}/`, data),

  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/modules/${id}/`),
};

// SESSIONS

export interface SessionListParams {
  course?: number;
  type?: 'video' | 'text' | 'live' | 'document' | 'html' | 'quiz' | 'assignment' | 'scorm';
  page?: number;
  page_size?: number;
}

export const sessionApi = {

  // List all sessions with optional filters
  getAll: (params?: SessionListParams) =>
    apiClient.get<PaginatedResponse<Session>>(`${BASE_PATH}/sessions/`, { params }),


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

  // Get a short-lived presigned GET URL for a session's uploaded asset
  getAssetUrl: (id: number) =>
    apiClient.get<AssetUrlResponse>(`${BASE_PATH}/sessions/${id}/asset-url/`),

  // Quiz authoring (session_type='quiz' only)
  getQuiz: (sessionId: number) =>
    apiClient.get<QuizDetailResponse>(`${BASE_PATH}/sessions/${sessionId}/quiz/`),

  patchQuiz: (sessionId: number, payload: { settings: QuizSettings }) =>
    apiClient.patch<QuizDetailResponse>(`${BASE_PATH}/sessions/${sessionId}/quiz/`, payload),

  putQuizQuestions: (
    sessionId: number,
    payload: {
      questions: Array<{
        id?: number;
        order?: number;
        question_type: string;
        question_text: string;
        points?: number;
        answer_payload?: Record<string, unknown>;
      }>;
    }
  ) =>
    apiClient.put<{ questions: QuizQuestion[] }>(
      `${BASE_PATH}/sessions/${sessionId}/quiz/questions/`,
      payload
    ),

  addQuestionsFromBank: (sessionId: number, payload: AddFromBankPayload) =>
    apiClient.post<AddFromBankResponse>(
      `${BASE_PATH}/sessions/${sessionId}/quiz/questions/add-from-bank/`,
      payload
    ),

  // Assignment config (session_type='assignment' only)
  getAssignment: (sessionId: number) =>
    apiClient.get<AssignmentConfig>(`${BASE_PATH}/sessions/${sessionId}/assignment/`),

  putAssignment: (sessionId: number, payload: AssignmentConfigCreateUpdate) =>
    apiClient.put<AssignmentConfig>(`${BASE_PATH}/sessions/${sessionId}/assignment/`, payload),

  patchAssignment: (sessionId: number, payload: Partial<AssignmentConfigCreateUpdate>) =>
    apiClient.patch<AssignmentConfig>(`${BASE_PATH}/sessions/${sessionId}/assignment/`, payload),
};

// QUESTION CATEGORIES (instructor-owned)
export interface QuestionCategoryCreatePayload {
  name: string;
  order?: number;
}

export const questionCategoryApi = {
  list: (params?: { page?: number; page_size?: number }) =>
    apiClient.get<PaginatedResponse<QuestionCategory>>(`${BASE_PATH}/question-categories/`, { params }),

  create: (payload: QuestionCategoryCreatePayload) =>
    apiClient.post<QuestionCategory>(`${BASE_PATH}/question-categories/`, payload),

  patch: (id: number, payload: Partial<QuestionCategoryCreatePayload>) =>
    apiClient.patch<QuestionCategory>(`${BASE_PATH}/question-categories/${id}/`, payload),

  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/question-categories/${id}/`),
};

// BANK QUESTIONS (instructor-owned)
export interface BankQuestionCreatePayload {
  category?: number | null;
  question_type: string;
  question_text: string;
  points?: number;
  answer_payload?: Record<string, unknown>;
  difficulty?: string;
  tags?: string[];
  explanation?: string;
}

export const bankQuestionApi = {
  list: (params?: BankQuestionListParams) =>
    apiClient.get<PaginatedResponse<BankQuestion>>(`${BASE_PATH}/bank-questions/`, { params }),

  create: (payload: BankQuestionCreatePayload) =>
    apiClient.post<BankQuestion>(`${BASE_PATH}/bank-questions/`, payload),

  get: (id: number) =>
    apiClient.get<BankQuestion>(`${BASE_PATH}/bank-questions/${id}/`),

  patch: (id: number, payload: Partial<BankQuestionCreatePayload>) =>
    apiClient.patch<BankQuestion>(`${BASE_PATH}/bank-questions/${id}/`, payload),

  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/bank-questions/${id}/`),
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

// COURSE REVIEWS

export interface CourseReview {
  id: number;
  user: number;
  user_name: string;
  course: number;
  rating: number;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseReviewSummary {
  average: number;
  total: number;
  distribution: number[];
  reviews: CourseReview[];
}

export const courseReviewApi = {
  // Get reviews for a course with summary
  getSummary: (courseId: number) =>
    apiClient.get<CourseReviewSummary>(`${BASE_PATH}/courses/${courseId}/reviews/`),

  // Get all reviews (with optional filters)
  getAll: (params?: { course?: number; rating?: number; page?: number; page_size?: number }) =>
    apiClient.get<PaginatedResponse<CourseReview>>(`${BASE_PATH}/course-reviews/`, { params }),
};