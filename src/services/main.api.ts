/*
  TASC LMS API Client
  Main entry point - exports all API services
 */

// Configuration & Types
export * from '../utils/config';
export * from '../types/types';

// Services
export * from './auth.services';
export * from './catalogue.services';
export { enrollmentApi, sessionProgressApi, certificateApi, discussionApi, discussionReplyApi, submissionApi, quizSubmissionApi, gradeStatisticsApi, managerGradesApi, savedCourseApi, statsApi, workshopApi, attendanceApi, analyticsApi, managerEnrollmentApi, managerSessionProgressApi, managerCertificateApi, useEnrollmentTrends, useLearningStats, useTopCoursePerformance, useCoursesByCategory, useRevenueTrends, useSavedCourses, useToggleSavedCourse, useCourseStats, useCertificateStats, useAssessmentStats, useInvoiceStats, useRevenueStats, useInstructorStats, useWorkshops, useCreateWorkshop, useUpdateWorkshop, useDeleteWorkshop, useWorkshopAttendance, useUpdateAttendance, useCreateAttendance, useUserSearch } from './learning.services';
export type { EnrollmentParams, SessionProgressParams, CertificateListParams, SubmissionParams, WorkshopItem, WorkshopAttendance, QuizSubmission } from './learning.services';
export * from './payments.services';
export * from './public.services';
export * from './upload.services';
export * from './organization.services';
export * from './users.services';
export * from './notifications.services';
export * from './reports.services';
export * from './livestream.services';
export * from './messaging.services';

// Re-export services as a single object for convenience
import { authApi, adminApi } from './auth.services';
import { categoryApi, tagApi, courseApi, sessionApi, courseApprovalApi, sessionAttachmentApi } from './catalogue.services';
import { organizationApi } from './organization.services';
import { usersApi } from './users.services';
import { notificationApi } from './notifications.services';
import { reportsApi } from './reports.services';
import {
  enrollmentApi,
  sessionProgressApi,
  certificateApi,
  discussionApi,
  discussionReplyApi,
  submissionApi,
  quizSubmissionApi,
  gradeStatisticsApi,
  managerGradesApi,
  savedCourseApi,
  statsApi,
} from './learning.services';
import {
  invoiceApi,
  transactionApi,
  paymentMethodApi,
  subscriptionApi,
  userSubscriptionApi,
} from './payments.services';
import {
  healthApi,
  publicCategoryApi,
  publicTagApi,
  publicCourseApi,
  publicStatsApi,
  publicClientsApi,
} from './public.services';
import { uploadApi } from './upload.services';
import { livestreamApi, livestreamAttendanceApi } from './livestream.services';
import { messagingApi } from './messaging.services';

/*
  Consolidated API object with all services
  
  @example
  ```typescript
  import { api } from '@/api';
  
  // Login
  const response = await api.auth.login({ email, password });
  
  // Get courses
  const courses = await api.catalogue.course.getAll();
  
  // Enroll in course
  await api.learning.enrollment.create({ course: courseId });
  ```
 */
export const api = {
  // Authentication & Admin
  auth: authApi,
  admin: adminApi,

  // Users (Admin/Manager)
  users: usersApi,

  // Catalogue
  catalogue: {
    category: categoryApi,
    tag: tagApi,
    course: courseApi,
    session: sessionApi,
    approval: courseApprovalApi,
    sessionAttachment: sessionAttachmentApi,
  },

  // Organizations
  organization: organizationApi,

  // Learning
  learning: {
    enrollment: enrollmentApi,
    sessionProgress: sessionProgressApi,
    certificate: certificateApi,
    discussion: discussionApi,
    discussionReply: discussionReplyApi,
    submission: submissionApi,
    quizSubmission: quizSubmissionApi,
    gradeStatistics: gradeStatisticsApi,
    managerGrades: managerGradesApi,
    savedCourse: savedCourseApi,
  },

  // Payments
  payments: {
    invoice: invoiceApi,
    transaction: transactionApi,
    paymentMethod: paymentMethodApi,
    subscription: subscriptionApi,
    userSubscription: userSubscriptionApi,
  },

  // Public (no auth required)
  public: {
    health: healthApi,
    category: publicCategoryApi,
    tag: publicTagApi,
    course: publicCourseApi,
    stats: publicStatsApi,
    clients: publicClientsApi,
  },

  // Uploads (DO Spaces presigned)
  upload: uploadApi,

  // Livestream
  livestream: {
    session: livestreamApi,
    attendance: livestreamAttendanceApi,
  },

  // Notifications
  notifications: notificationApi,

  // Reports
  reports: reportsApi,

  // Messaging
  messaging: messagingApi,

  // Stats (Superadmin dashboard)
  stats: statsApi,
};

export default api;