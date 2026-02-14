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
export * from './learning.services';
export * from './payments.services';
export * from './public.services';

// Re-export services as a single object for convenience
import { authApi, adminApi } from './auth.services';
import { categoryApi, tagApi, courseApi, sessionApi } from './catalogue.services';
import {
  enrollmentApi,
  sessionProgressApi,
  certificateApi,
  discussionApi,
  discussionReplyApi,
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
} from './public.services';

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

  // Catalogue
  catalogue: {
    category: categoryApi,
    tag: tagApi,
    course: courseApi,
    session: sessionApi,
  },

  // Learning
  learning: {
    enrollment: enrollmentApi,
    sessionProgress: sessionProgressApi,
    certificate: certificateApi,
    discussion: discussionApi,
    discussionReply: discussionReplyApi,
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
  },
};

export default api;