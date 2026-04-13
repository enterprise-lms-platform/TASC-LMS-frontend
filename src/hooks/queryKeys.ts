// queryKeys.ts

import type {
  CategoryListParams,
  CourseListParams,
  SessionListParams,
  ApprovalListParams,
  ModuleListParams,
} from '../services/catalogue.services';
import type { BankQuestionListParams } from '../types/types';
import type { SessionProgressParams, DiscussionParams, DiscussionReplyParams, SubmissionParams } from '../services/learning.services';
import type { InvoiceParams, TransactionParams, UserSubscriptionParams } from '../services/payments.services';
import type { PublicCourseParams } from '../services/public.services';
import type { OrganizationListParams, ManagerMembersParams } from '../services/organization.services';
import type { AuditLogFilters } from '../types/types';
import type { LivestreamListParams, LivestreamAttendanceParams } from '../services/livestream.services';

export const queryKeys = {
  // Auth; Already taken care of in useAuthQueries.ts to avoid circular imports, but shown here for reference:
  // auth: {
  //   all: ['auth'],
  //   me: ['auth', 'me'] as const,
  //   googleStatus: ['auth', 'google-status'] as const,
  // },

  // Catalogue
  categories: {
    all: (params?: CategoryListParams) => ['categories', params] as const,
    detail: (id: number) => ['categories', 'detail', id] as const,
  },
  tags: {
    all: ['tags'] as const,
    detail: (id: number) => ['tags', 'detail', id] as const,
  },
  courses: {
    all: (params?: CourseListParams) => ['courses', params] as const,
    detail: (id: number) => ['courses', 'detail', id] as const,
  },
  modules: {
    all: (params?: ModuleListParams) => ['modules', params] as const,
    detail: (id: number) => ['modules', 'detail', id] as const,
  },
  sessions: {
    all: (params?: SessionListParams) => ['sessions', params] as const,
    detail: (id: number) => ['sessions', 'detail', id] as const,
  },
  quiz: {
    detail: (sessionId: number) => ['quiz', 'detail', sessionId] as const,
  },
  assignment: {
    detail: (sessionId: number) => ['assignment', 'detail', sessionId] as const,
  },
  questionCategories: {
    all: (params?: Record<string, unknown>) => ['question-categories', params] as const,
  },
  bankQuestions: {
    list: (params?: BankQuestionListParams) => ['bank-questions', params] as const,
    detail: (id: number) => ['bank-questions', 'detail', id] as const,
  },

  // Learning
  enrollments: {
    all: ['enrollments'] as const,
    detail: (id: number) => ['enrollments', 'detail', id] as const,
  },
  sessionProgress: {
    all: (params?: SessionProgressParams) => ['session-progress', params] as const,
    detail: (id: number) => ['session-progress', 'detail', id] as const,
  },
  certificates: {
    all: ['certificates'] as const,
    detail: (id: number) => ['certificates', 'detail', id] as const,
    verify: (certNumber: string) => ['certificates', 'verify', certNumber] as const,
  },
  discussions: {
    all: (params?: DiscussionParams) => ['discussions', params] as const,
    detail: (id: number) => ['discussions', 'detail', id] as const,
  },
  discussionReplies: {
    all: (params?: DiscussionReplyParams) => ['discussion-replies', params] as const,
    detail: (id: number) => ['discussion-replies', 'detail', id] as const,
  },
  submissions: {
    all: (params?: SubmissionParams) => ['submissions', params] as const,
    detail: (id: number) => ['submissions', 'detail', id] as const,
  },
  savedCourses: {
    all: ['saved-courses'] as const,
  },

  // Payments
  invoices: {
    all: (params?: InvoiceParams) => ['invoices', params] as const,
    detail: (id: number) => ['invoices', 'detail', id] as const,
  },
  transactions: {
    all: (params?: TransactionParams) => ['transactions', params] as const,
    detail: (id: number) => ['transactions', 'detail', id] as const,
  },
  paymentMethods: {
    all: ['payment-methods'] as const,
    detail: (id: number) => ['payment-methods', 'detail', id] as const,
  },
  subscriptions: {
    all: ['subscriptions'] as const,
    detail: (id: number) => ['subscriptions', 'detail', id] as const,
    myStatus: ['subscriptions', 'my-status'] as const,
  },
  userSubscriptions: {
    all: (params?: UserSubscriptionParams) => ['user-subscriptions', params] as const,
    detail: (id: number) => ['user-subscriptions', 'detail', id] as const,
  },

  // Public
  public: {
    health: ['public', 'health'] as const,
    categories: {
      all: ['public', 'categories'] as const,
      detail: (id: number) => ['public', 'categories', 'detail', id] as const,
    },
    tags: {
      all: ['public', 'tags'] as const,
      detail: (id: number) => ['public', 'tags', 'detail', id] as const,
    },
    courses: {
      all: (params?: PublicCourseParams) => ['public', 'courses', params] as const,
      detail: (slug: string) => ['public', 'courses', 'detail', slug] as const,
    },
  },

  // Superadmin
  auditLogs: {
    all: (filters?: AuditLogFilters) => ['audit-logs', filters] as const,
  },
  superadminReviews: {
    all: (params?: object) => ['superadmin-reviews', params ?? {}] as const,
  },
  superadminDemoRequests: {
    all: (params?: object) => ['superadmin-demo-requests', params ?? {}] as const,
  },
  systemSettings: {
    current: ['system-settings'] as const,
  },
  securityPolicy: {
    current: ['security-policy'] as const,
  },
  superadminAssessments: {
    all: (params?: object) => ['superadmin-assessments', params ?? {}] as const,
    stats: ['superadmin-assessments', 'stats'] as const,
  },
  publicTestimonials: {
    all: ['public-testimonials'] as const,
  },
  publicInstructor: {
    detail: (id: number) => ['public-instructor', id] as const,
  },

  // OrgAdmin
  orgAdminMembers: {
    all: (params?: ManagerMembersParams) => ['org-admin-members', params] as const,
    dashboard: ['org-admin-members', 'dashboard'] as const,
  },
  orgAdmin: {
    settings: ['org-admin', 'settings'] as const,
    billingUsage: ['org-admin', 'billing-usage'] as const,
    activity: (range: string) => ['org-admin', 'activity', range] as const,
    courses: (params?: object) => ['org-admin', 'courses', params] as const,
    enrollments: (params?: object) => ['org-admin', 'enrollments', params] as const,
    certificates: (params?: object) => ['org-admin', 'certificates', params] as const,
    notifications: (params?: object) => ['org-admin', 'notifications', params] as const,
  },

  // Organizations
  organizations: {
    all: (params?: OrganizationListParams) => ['organizations', params] as const,
    detail: (id: number) => ['organizations', 'detail', id] as const,
  },

  // Course Approval Requests
  approvalRequests: {
    all: (params?: ApprovalListParams) => ['approval-requests', params] as const,
    detail: (id: number) => ['approval-requests', 'detail', id] as const,
  },

  // Livestream
  livestreams: {
    all: (params?: LivestreamListParams) => ['livestreams', params] as const,
    detail: (id: string) => ['livestreams', 'detail', id] as const,
  },
  livestreamAttendance: {
    all: (params?: LivestreamAttendanceParams) => ['livestream-attendance', params] as const,
    detail: (id: string) => ['livestream-attendance', 'detail', id] as const,
  },
};
