// queryKeys.ts

import type { CourseListParams, SessionListParams } from '../services/catalogue.services';
import type { SessionProgressParams, DiscussionParams, DiscussionReplyParams } from '../services/learning.services';
import type { InvoiceParams, TransactionParams, UserSubscriptionParams } from '../services/payments.services';
import type { PublicCourseParams } from '../services/public.services';
import type { AuditLogFilters } from '../types/types';

export const queryKeys = {
  // Auth; Already taken care of in useAuthQueries.ts to avoid circular imports, but shown here for reference:
  // auth: {
  //   all: ['auth'],
  //   me: ['auth', 'me'] as const,
  //   googleStatus: ['auth', 'google-status'] as const,
  // },

  // Catalogue
  categories: {
    all: (params?: { parent?: number }) => ['categories', params] as const,
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
  sessions: {
    all: (params?: SessionListParams) => ['sessions', params] as const,
    detail: (id: number) => ['sessions', 'detail', id] as const,
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
};
