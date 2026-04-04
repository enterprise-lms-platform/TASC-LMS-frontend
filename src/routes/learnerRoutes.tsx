/**
 * Learner route definitions.
 * All routes require authentication. Role is not enforced at router level
 * (ProtectedRoute handles it) but learner routes are open to any authenticated user.
 */
import { lazy, type ReactNode, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { type RouteObject } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorPage from '../pages/ErrorPage';
import * as learnerLoaders from './loaders/learnerLoaders';

const SW = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>}>
    {children}
  </Suspense>
);
const PR = ({ children }: { children: React.ReactElement }) => <ProtectedRoute>{children}</ProtectedRoute>;

const LearnerDashboard           = lazy(() => import('../pages/learner/LearnerDashboard'));
const LearnerCourseCatalogPage   = lazy(() => import('../pages/learner/LearnerCourseCatalogPage'));
const MyCoursesPage              = lazy(() => import('../pages/learner/MyCoursesPage'));
const LearnerCourseDetailPage    = lazy(() => import('../pages/learner/LearnerCourseDetailPage'));
const CoursePlayerPage           = lazy(() => import('../pages/learner/CoursePlayerPage'));
const LearnerAssignmentsPage     = lazy(() => import('../pages/learner/LearnerAssignmentsPage'));
const LearnerNotificationsPage   = lazy(() => import('../pages/learner/LearnerNotificationsPage'));
const ProgressPage               = lazy(() => import('../pages/learner/ProgressPage'));
const QuizzesPage                = lazy(() => import('../pages/learner/QuizzesPage'));
const MySchedulePage             = lazy(() => import('../pages/learner/MySchedulePage'));
const SavedCoursesPage           = lazy(() => import('../pages/learner/SavedCoursesPage'));
const LearnerProfilePage         = lazy(() => import('../pages/learner/LearnerProfilePage'));
const CheckoutPaymentPage        = lazy(() => import('../pages/learner/CheckoutPaymentPage'));
const InvoiceReceiptPage         = lazy(() => import('../pages/learner/InvoiceReceiptPage'));
const SubscriptionManagementPage = lazy(() => import('../pages/learner/SubscriptionManagementPage'));
const PaymentHistoryPage         = lazy(() => import('../pages/learner/PaymentHistoryPage'));
const LearnerCertificatesPage    = lazy(() => import('../pages/learner/LearnerCertificatesPage'));
const LearnerBadgesPage          = lazy(() => import('../pages/learner/LearnerBadgesPage'));
const LearnerMessagesPage        = lazy(() => import('../pages/learner/LearnerMessagesPage'));

export const learnerRoutes = (queryClient: QueryClient): RouteObject[] => [
  { path: '/learner', element: <SW><PR><LearnerDashboard /></PR></SW>, errorElement: <ErrorPage />, loader: async () => learnerLoaders.learnerDashboardLoader(queryClient) },
  { path: '/learner/courses', element: <SW><PR><LearnerCourseCatalogPage /></PR></SW>, loader: async () => learnerLoaders.learnerCourseCatalogLoader(queryClient) },
  { path: '/learner/my-courses', element: <SW><PR><MyCoursesPage /></PR></SW>, loader: async () => learnerLoaders.myCoursesLoader(queryClient) },
  { path: '/learner/course/:courseId', element: <SW><PR><LearnerCourseDetailPage /></PR></SW>, errorElement: <ErrorPage />, loader: async (args: any) => learnerLoaders.learnerCourseDetailLoader(queryClient, args) },
  { path: '/learner/course/:courseId/learn', element: <SW><PR><CoursePlayerPage /></PR></SW>, errorElement: <ErrorPage />, loader: async (args: any) => learnerLoaders.coursePlayerLoader(queryClient, args) },
  { path: '/learner/assignments', element: <SW><PR><LearnerAssignmentsPage /></PR></SW>, loader: async () => learnerLoaders.learnerAssignmentsLoader(queryClient) },
  { path: '/learner/notifications', element: <SW><PR><LearnerNotificationsPage /></PR></SW>, loader: async () => learnerLoaders.learnerNotificationsLoader() },
  { path: '/learner/progress', element: <SW><PR><ProgressPage /></PR></SW>, loader: async () => learnerLoaders.learnerProgressLoader(queryClient) },
  { path: '/learner/quizzes', element: <SW><PR><QuizzesPage /></PR></SW> },
  { path: '/learner/schedule', element: <SW><PR><MySchedulePage /></PR></SW> },
  { path: '/learner/saved', element: <SW><PR><SavedCoursesPage /></PR></SW> },
  { path: '/learner/certificates', element: <SW><PR><LearnerCertificatesPage /></PR></SW>, loader: async () => learnerLoaders.learnerCertificatesLoader(queryClient) },
  { path: '/learner/badges', element: <SW><PR><LearnerBadgesPage /></PR></SW> },
  { path: '/learner/profile', element: <SW><PR><LearnerProfilePage /></PR></SW> },
  { path: '/learner/settings', element: <SW><PR><SubscriptionManagementPage /></PR></SW> },
  { path: '/learner/subscription', element: <SW><PR><SubscriptionManagementPage /></PR></SW> },
  { path: '/learner/payments', element: <SW><PR><PaymentHistoryPage /></PR></SW> },
  { path: '/learner/messages', element: <SW><PR><LearnerMessagesPage /></PR></SW> },
  // Checkout flows
  { path: '/checkout', element: <SW><PR><CheckoutPaymentPage /></PR></SW> },
  { path: '/invoice', element: <SW><PR><InvoiceReceiptPage /></PR></SW> },
];
