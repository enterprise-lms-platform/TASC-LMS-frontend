/**
 * Instructor route definitions.
 * All routes require allowedRoles: ['instructor', 'tasc_admin'].
 */
import { lazy, type ReactNode, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { type RouteObject } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorPage from '../pages/ErrorPage';
import * as instructorLoaders from './loaders/instructorLoaders';

const SW = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>}>
    {children}
  </Suspense>
);
const PR = ({ children }: { children: React.ReactElement }) => (
  <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}>{children}</ProtectedRoute>
);

const InstructorDashboard        = lazy(() => import('../pages/instructor/InstructorDashboard'));
const InstructorCoursesPage      = lazy(() => import('../pages/instructor/InstructorCoursesPage'));
const CourseCreationPage         = lazy(() => import('../pages/instructor/CourseCreationPage'));
const CourseStructurePage        = lazy(() => import('../pages/instructor/CourseStructurePage'));
const ContentUploadPage          = lazy(() => import('../pages/instructor/ContentUploadPage'));
const CoursePreviewPage          = lazy(() => import('../pages/instructor/CoursePreviewPage'));
const QuizBuilderPage            = lazy(() => import('../pages/instructor/QuizBuilderPage'));
const QuestionBankPage           = lazy(() => import('../pages/instructor/QuestionBankPage'));
const AssignmentsHubPage         = lazy(() => import('../pages/instructor/AssignmentsHubPage'));
const AssignmentCreationPage     = lazy(() => import('../pages/instructor/AssignmentCreationPage'));
const GradingPage                = lazy(() => import('../pages/instructor/GradingPage'));
const GradebookPage              = lazy(() => import('../pages/instructor/GradebookPage'));
const SessionSchedulingPage      = lazy(() => import('../pages/instructor/SessionSchedulingPage'));
const InstructorAnalyticsPage    = lazy(() => import('../pages/instructor/InstructorAnalyticsPage'));
const InstructorNotificationsPage = lazy(() => import('../pages/instructor/InstructorNotificationsPage'));
const InstructorLearnersPage     = lazy(() => import('../pages/instructor/InstructorLearnersPage'));
const ProgressTrackingPage       = lazy(() => import('../pages/instructor/ProgressTrackingPage'));
const InstructorProfilePage      = lazy(() => import('../pages/instructor/InstructorProfilePage'));
const RecordingsPage             = lazy(() => import('../pages/instructor/RecordingsPage'));
const UpcomingSessionsPage       = lazy(() => import('../pages/instructor/UpcomingSessionsPage'));
const WorkshopsPage              = lazy(() => import('../pages/instructor/WorkshopsPage'));
const WorkshopDetailsPage        = lazy(() => import('../pages/instructor/WorkshopDetailsPage'));
const InstructorMessagesPage     = lazy(() => import('../pages/InstructorMessagesPage'));

export const instructorRoutes = (queryClient: QueryClient): RouteObject[] => [
  { path: '/instructor', element: <SW><PR><InstructorDashboard /></PR></SW>, errorElement: <ErrorPage />, loader: async () => instructorLoaders.instructorDashboardLoader(queryClient) },
  { path: '/instructor/courses', element: <SW><PR><InstructorCoursesPage /></PR></SW>, loader: async () => instructorLoaders.instructorCoursesLoader(queryClient) },
  { path: '/instructor/course/create', element: <SW><PR><CourseCreationPage /></PR></SW>, loader: async () => instructorLoaders.courseCreationFormLoader(queryClient) },
  { path: '/instructor/course/:courseId/edit', element: <SW><PR><CourseCreationPage /></PR></SW>, loader: async () => instructorLoaders.courseCreationFormLoader(queryClient) },
  { path: '/instructor/course/:courseId/structure', element: <SW><PR><CourseStructurePage /></PR></SW>, loader: async (args: any) => instructorLoaders.courseStructureLoader(queryClient, args) },
  { path: '/instructor/course/:courseId/upload', element: <SW><PR><ContentUploadPage /></PR></SW>, loader: async (args: any) => instructorLoaders.courseStructureLoader(queryClient, args) },
  { path: '/instructor/course/:courseId/preview', element: <SW><PR><CoursePreviewPage /></PR></SW>, loader: async (args: any) => instructorLoaders.coursePreviewLoader(queryClient, args) },
  { path: '/instructor/course/:courseId/quiz/builder', element: <SW><PR><QuizBuilderPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/instructor/question-bank', element: <SW><PR><QuestionBankPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/instructor/assignments', element: <SW><PR><AssignmentsHubPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/instructor/assignment/create', element: <SW><PR><AssignmentCreationPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/instructor/grading', element: <SW><PR><GradingPage /></PR></SW> },
  { path: '/instructor/gradebook', element: <SW><PR><GradebookPage /></PR></SW>, loader: async () => instructorLoaders.gradebookLoader(queryClient) },
  { path: '/instructor/sessions/schedule', element: <SW><PR><SessionSchedulingPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/instructor/analytics', element: <SW><PR><InstructorAnalyticsPage /></PR></SW>, loader: async () => instructorLoaders.instructorAnalyticsLoader(queryClient) },
  { path: '/instructor/notifications', element: <SW><PR><InstructorNotificationsPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/instructor/learners', element: <SW><PR><InstructorLearnersPage /></PR></SW>, loader: async () => instructorLoaders.instructorLearnersLoader(queryClient) },
  { path: '/instructor/progress', element: <SW><PR><ProgressTrackingPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/instructor/profile', element: <SW><PR><InstructorProfilePage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/instructor/sessions/recordings', element: <SW><PR><RecordingsPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/instructor/sessions/upcoming', element: <SW><PR><UpcomingSessionsPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/instructor/workshops', element: <SW><PR><WorkshopsPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/instructor/workshops/:workshopId', element: <SW><PR><WorkshopDetailsPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
  { path: '/instructor/messages', element: <SW><PR><InstructorMessagesPage /></PR></SW>, loader: async () => instructorLoaders.instructorRouteLoader(queryClient) },
];
