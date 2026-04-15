/**
 * Manager route definitions.
 * All routes require allowedRoles: ['lms_manager', 'tasc_admin'].
 */
import { lazy, type ReactNode, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { type RouteObject } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorPage from '../pages/ErrorPage';
import * as managerLoaders from './loaders/managerLoaders';
import * as instructorLoaders from './loaders/instructorLoaders';

const SW = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>}>
    {children}
  </Suspense>
);
const PR = ({ children }: { children: React.ReactElement }) => (
  <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}>{children}</ProtectedRoute>
);

const ManagerDashboard          = lazy(() => import('../pages/manager/ManagerDashboard'));
const ManagerCategoriesPage     = lazy(() => import('../pages/manager/ManagerCategoriesPage'));
const ManagerAnalyticsPage      = lazy(() => import('../pages/manager/ManagerAnalyticsPage'));
const ManagerInviteUserPage     = lazy(() => import('../pages/manager/ManagerInviteUserPage'));
const CourseApprovalPage        = lazy(() => import('../pages/manager/CourseApprovalPage'));
const CourseApprovalDetailPage  = lazy(() => import('../pages/manager/CourseApprovalDetailPage'));
const ManagerReportsPage        = lazy(() => import('../pages/manager/ManagerReportsPage'));
const ManagerUsersPage          = lazy(() => import('../pages/manager/ManagerUsersPage'));
const ManagerBulkImportPage     = lazy(() => import('../pages/manager/ManagerBulkImportPage'));
const ManagerActivityPage       = lazy(() => import('../pages/manager/ManagerActivityPage'));
const ManagerCoursesPage        = lazy(() => import('../pages/manager/ManagerCoursesPage'));
const ManagerCreateCoursePage   = lazy(() => import('../pages/manager/ManagerCreateCoursePage'));
const ManagerInstructorsPage    = lazy(() => import('../pages/manager/ManagerInstructorsPage'));
const ManagerEnrollmentsPage    = lazy(() => import('../pages/manager/ManagerEnrollmentsPage'));
const ManagerBulkEnrollPage     = lazy(() => import('../pages/manager/ManagerBulkEnrollPage'));
const ManagerProgressPage       = lazy(() => import('../pages/manager/ManagerProgressPage'));
const ManagerCertificatesPage   = lazy(() => import('../pages/manager/ManagerCertificatesPage'));
const ManagerQuizzesPage        = lazy(() => import('../pages/manager/ManagerQuizzesPage'));
const ManagerAssignmentsPage    = lazy(() => import('../pages/manager/ManagerAssignmentsPage'));
const ManagerGradebookPage      = lazy(() => import('../pages/manager/ManagerGradebookPage'));
const ManagerSessionsPage       = lazy(() => import('../pages/manager/ManagerSessionsPage'));
const ManagerRecordingsPage     = lazy(() => import('../pages/manager/ManagerRecordingsPage'));
const ManagerScheduleNewPage    = lazy(() => import('../pages/manager/ManagerScheduleNewPage'));
const ManagerSettingsPage       = lazy(() => import('../pages/manager/ManagerSettingsPage'));
const ManagerNotificationsPage  = lazy(() => import('../pages/manager/ManagerNotificationsPage'));
const ManagerBillingPage        = lazy(() => import('../pages/manager/ManagerBillingPage'));
const ManagerProfilePage        = lazy(() => import('../pages/manager/ManagerProfilePage'));
const ManagerMessagesPage       = lazy(() => import('../pages/manager/ManagerMessagesPage'));
// Instructor-owned pages reused by manager
const CourseCreationPage        = lazy(() => import('../pages/instructor/CourseCreationPage'));
const CourseStructurePage       = lazy(() => import('../pages/instructor/CourseStructurePage'));
const ContentUploadPage         = lazy(() => import('../pages/instructor/ContentUploadPage'));
const CoursePreviewPage         = lazy(() => import('../pages/instructor/CoursePreviewPage'));
const QuizBuilderPage           = lazy(() => import('../pages/instructor/QuizBuilderPage'));
const AssignmentCreationPage    = lazy(() => import('../pages/instructor/AssignmentCreationPage'));
const SessionSchedulingPage     = lazy(() => import('../pages/instructor/SessionSchedulingPage'));

export const managerRoutes = (queryClient: QueryClient): RouteObject[] => [
  { path: '/manager', element: <SW><PR><ManagerDashboard /></PR></SW>, errorElement: <ErrorPage />, loader: async () => managerLoaders.managerDashboardLoader(queryClient) },
  { path: '/manager/categories', element: <SW><PR><ManagerCategoriesPage /></PR></SW>, loader: async () => managerLoaders.managerCategoriesLoader(queryClient) },
  { path: '/manager/analytics', element: <SW><PR><ManagerAnalyticsPage /></PR></SW>, loader: async () => managerLoaders.managerAnalyticsLoader(queryClient) },
  { path: '/manager/approvals', element: <SW><PR><CourseApprovalPage /></PR></SW>, loader: async () => managerLoaders.approvalQueueLoader(queryClient) },
  { path: '/manager/approvals/:requestId', element: <SW><PR><CourseApprovalDetailPage /></PR></SW>, loader: async (args: any) => managerLoaders.approvalDetailLoader(queryClient, args) },
  { path: '/manager/invite-user', element: <SW><PR><ManagerInviteUserPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/reports', element: <SW><PR><ManagerReportsPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/users', element: <SW><PR><ManagerUsersPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/import', element: <SW><PR><ManagerBulkImportPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/activity', element: <SW><PR><ManagerActivityPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/courses', element: <SW><PR><ManagerCoursesPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/create-course', element: <SW><PR><ManagerCreateCoursePage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/courses/create', element: <SW><PR><CourseCreationPage /></PR></SW>, loader: async () => instructorLoaders.courseCreationFormLoader(queryClient) },
  { path: '/manager/courses/:courseId', element: <SW><PR><CoursePreviewPage /></PR></SW>, loader: async (args: any) => instructorLoaders.coursePreviewLoader(queryClient, args) },
  { path: '/manager/courses/:courseId/edit', element: <SW><PR><CourseCreationPage /></PR></SW>, loader: async () => instructorLoaders.courseCreationFormLoader(queryClient) },
  { path: '/manager/courses/:courseId/structure', element: <SW><PR><CourseStructurePage /></PR></SW>, loader: async (args: any) => instructorLoaders.courseStructureLoader(queryClient, args) },
  { path: '/manager/courses/:courseId/upload', element: <SW><PR><ContentUploadPage /></PR></SW>, loader: async (args: any) => instructorLoaders.courseStructureLoader(queryClient, args) },
  { path: '/manager/courses/:courseId/preview', element: <SW><PR><CoursePreviewPage /></PR></SW>, loader: async (args: any) => instructorLoaders.coursePreviewLoader(queryClient, args) },
  { path: '/manager/courses/:courseId/quiz/builder', element: <SW><PR><QuizBuilderPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/manager/assignment/create', element: <SW><PR><AssignmentCreationPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/manager/sessions/schedule', element: <SW><PR><SessionSchedulingPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/manager/instructors', element: <SW><PR><ManagerInstructorsPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/enrollments', element: <SW><PR><ManagerEnrollmentsPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/bulk-enroll', element: <SW><PR><ManagerBulkEnrollPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/progress', element: <SW><PR><ManagerProgressPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/certificates', element: <SW><PR><ManagerCertificatesPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/quizzes', element: <SW><PR><ManagerQuizzesPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/assignments', element: <SW><PR><ManagerAssignmentsPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/gradebook', element: <SW><PR><ManagerGradebookPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/sessions', element: <SW><PR><ManagerSessionsPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/recordings', element: <SW><PR><ManagerRecordingsPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/schedule-new', element: <SW><PR><ManagerScheduleNewPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/settings', element: <SW><PR><ManagerSettingsPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/notifications', element: <SW><PR><ManagerNotificationsPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/billing', element: <SW><PR><ManagerBillingPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
  { path: '/manager/profile', element: <SW><PR><ManagerProfilePage /></PR></SW> },
  { path: '/manager/messages', element: <SW><PR><ManagerMessagesPage /></PR></SW>, loader: async () => managerLoaders.managerRouteLoader(queryClient) },
];
