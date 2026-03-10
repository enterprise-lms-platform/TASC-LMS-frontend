/**
 * Main Router Configuration using React Router v7 createBrowserRouter
 * 
 * This router configuration:
 * - Uses route loaders to pre-fetch data before rendering pages
 * - Implements role-based access control via ProtectedRoute
 * - Provides centralized error handling
 * - Optimizes UX by ensuring data is ready when pages render
 * 
 * Route Loader Strategy:
 * - Critical data (enrollments, courses) loaded in loaders
 * - Loaders use TanStack Query ensureQueryData() to use cache
 * - Suspense boundaries can show skeletons while loading
 * - Failed loaders redirect to appropriate fallback routes
 */

import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';

// Layout & Error Components
import ErrorPage from '../pages/ErrorPage';
import ProtectedRoute from '../components/ProtectedRoute';

// Public Pages
import LandingPage from '../pages/LandingPage';
import CourseCataloguePage from '../pages/CourseCataloguePage';
import CourseLandingPage from '../pages/CourseLandingPage';
import ForBusinessPage from '../pages/ForBusinessPage';
import LoginPage from '../pages/LoginPage';
import RegistrationPage from '../pages/RegistrationPage';
import EmailVerificationPage from '../pages/EmailVerificationPage';
import PasswordResetPage from '../pages/PasswordReset';
import SetPasswordPage from '../pages/SetPasswordPage';

// Learner Pages
import LearnerDashboard from '../pages/LearnerDashboard';
import LearnerCourseCatalogPage from '../pages/LearnerCourseCatalogPage';
import MyCoursesPage from '../pages/MyCoursesPage';
import LearnerCourseDetailPage from '../pages/LearnerCourseDetailPage';
import CoursePlayerPage from '../pages/CoursePlayerPage';
import LearnerAssignmentsPage from '../pages/LearnerAssignmentsPage';
import LearnerNotificationsPage from '../pages/LearnerNotificationsPage';
import ProgressPage from '../pages/ProgressPage';
import QuizzesPage from '../pages/QuizzesPage';
import MySchedulePage from '../pages/MySchedulePage';
import SavedCoursesPage from '../pages/SavedCoursesPage';
import LearnerProfilePage from '../pages/LearnerProfilePage';
import CheckoutPaymentPage from '../pages/CheckoutPaymentPage';
import InvoiceReceiptPage from '../pages/InvoiceReceiptPage';
import SubscriptionManagementPage from '../pages/SubscriptionManagementPage';
import PaymentHistoryPage from '../pages/PaymentHistoryPage';
import LearnerCertificatesPage from '../pages/LearnerCertificatesPage';

// Instructor Pages
import InstructorDashboard from '../pages/InstructorDashboard';
import InstructorCoursesPage from '../pages/InstructorCoursesPage';
import CourseCreationPage from '../pages/CourseCreationPage';
import CourseStructurePage from '../pages/CourseStructurePage';
import ContentUploadPage from '../pages/ContentUploadPage';
import CoursePreviewPage from '../pages/CoursePreviewPage';
import QuizBuilderPage from '../pages/QuizBuilderPage';
import QuestionBankPage from '../pages/QuestionBankPage';
import AssignmentCreationPage from '../pages/AssignmentCreationPage';
import GradingPage from '../pages/GradingPage';
import GradebookPage from '../pages/GradebookPage';
import SessionSchedulingPage from '../pages/SessionSchedulingPage';
import InstructorAnalyticsPage from '../pages/InstructorAnalyticsPage';
import InstructorNotificationsPage from '../pages/InstructorNotificationsPage';
import InstructorLearnersPage from '../pages/InstructorLearnersPage';
import ProgressTrackingPage from '../pages/ProgressTrackingPage';
import InstructorProfilePage from '../pages/InstructorProfilePage';
import RecordingsPage from '../pages/RecordingsPage';
import UpcomingSessionsPage from '../pages/UpcomingSessionsPage';
import WorkshopsPage from '../pages/WorkshopsPage';
import WorkshopDetailsPage from '../pages/WorkshopDetailsPage';

// Manager Pages
import ManagerDashboard from '../pages/ManagerDashboard';
import ManagerCategoriesPage from '../pages/ManagerCategoriesPage';
import ManagerAnalyticsPage from '../pages/ManagerAnalyticsPage';
import ManagerInviteUserPage from '../pages/ManagerInviteUserPage';
import CourseApprovalPage from '../pages/CourseApprovalPage';
import CourseApprovalDetailPage from '../pages/CourseApprovalDetailPage';
import ManagerReportsPage from '../pages/ManagerReportsPage';
import ManagerUsersPage from '../pages/ManagerUsersPage';
import ManagerRolesPage from '../pages/ManagerRolesPage';
import ManagerBulkImportPage from '../pages/ManagerBulkImportPage';
import ManagerActivityPage from '../pages/ManagerActivityPage';
import ManagerCoursesPage from '../pages/ManagerCoursesPage';
import ManagerCreateCoursePage from '../pages/ManagerCreateCoursePage';
import ManagerInstructorsPage from '../pages/ManagerInstructorsPage';
import ManagerEnrollmentsPage from '../pages/ManagerEnrollmentsPage';
import ManagerBulkEnrollPage from '../pages/ManagerBulkEnrollPage';
import ManagerProgressPage from '../pages/ManagerProgressPage';
import ManagerCertificatesPage from '../pages/ManagerCertificatesPage';
import ManagerQuizzesPage from '../pages/ManagerQuizzesPage';
import ManagerAssignmentsPage from '../pages/ManagerAssignmentsPage';
import ManagerGradebookPage from '../pages/ManagerGradebookPage';
import ManagerSessionsPage from '../pages/ManagerSessionsPage';
import ManagerRecordingsPage from '../pages/ManagerRecordingsPage';
import ManagerScheduleNewPage from '../pages/ManagerScheduleNewPage';
import ManagerSettingsPage from '../pages/ManagerSettingsPage';
import ManagerNotificationsPage from '../pages/ManagerNotificationsPage';
import ManagerIntegrationsPage from '../pages/ManagerIntegrationsPage';
import ManagerBillingPage from '../pages/ManagerBillingPage';

// Finance Pages
import FinanceDashboard from '../pages/FinanceDashboard';
import FinanceAnalyticsPage from '../pages/FinanceAnalyticsPage';
import FinanceAlertsPage from '../pages/FinanceAlertsPage';
import FinancePaymentsPage from '../pages/FinancePaymentsPage';
import FinanceInvoicesPage from '../pages/FinanceInvoicesPage';
import FinanceRevenueReportsPage from '../pages/FinanceRevenueReportsPage';
import FinanceSubscriptionsPage from '../pages/FinanceSubscriptionsPage';
import FinanceSubscriptionHistoryPage from '../pages/FinanceSubscriptionHistoryPage';
import FinanceChurnPage from '../pages/FinanceChurnPage';
import FinancePricingPage from '../pages/FinancePricingPage';
import FinanceExportPage from '../pages/FinanceExportPage';
import FinanceStatementsPage from '../pages/FinanceStatementsPage';
import FinanceCustomReportsPage from '../pages/FinanceCustomReportsPage';
import GatewayMpesaPage from '../pages/GatewayMpesaPage';
import GatewayMtnPage from '../pages/GatewayMtnPage';
import GatewayAirtelPage from '../pages/GatewayAirtelPage';
import GatewayPesapalPage from '../pages/GatewayPesapalPage';

// Superadmin Pages
import SuperadminDashboard from '../pages/SuperadminDashboard';
import AllUsersPage from '../pages/superadmin/AllUsersPage';
import RolesPermissionsPage from '../pages/superadmin/RolesPermissionsPage';
import AuditLogsPage from '../pages/superadmin/AuditLogsPage';
import AllOrganizationsPage from '../pages/superadmin/AllOrganizationsPage';
import AddOrganizationPage from '../pages/superadmin/AddOrganizationPage';
import PartnershipsPage from '../pages/superadmin/PartnershipsPage';
import AllCoursesPage from '../pages/superadmin/AllCoursesPage';
import InstructorsPage from '../pages/superadmin/InstructorsPage';
import CertificationsPage from '../pages/superadmin/CertificationsPage';
import AssessmentsPage from '../pages/superadmin/AssessmentsPage';
import PaymentsPage from '../pages/superadmin/PaymentsPage';
import RevenuePage from '../pages/superadmin/RevenuePage';
import InvoicesPage from '../pages/superadmin/InvoicesPage';
import GatewaySettingsPage from '../pages/superadmin/GatewaySettingsPage';
import SystemSettingsPage from '../pages/superadmin/SystemSettingsPage';
import IntegrationsPage from '../pages/superadmin/IntegrationsPage';
import DataMigrationPage from '../pages/superadmin/DataMigrationPage';
import SecurityPage from '../pages/superadmin/SecurityPage';
import AnalyticsPage from '../pages/superadmin/AnalyticsPage';
import NotificationsPage from '../pages/superadmin/NotificationsPage';
import InviteUserPage from '../pages/InviteUserPage';

// Import all loaders
import * as learnerLoaders from './loaders/learnerLoaders';
import * as instructorLoaders from './loaders/instructorLoaders';
import * as financeLoaders from './loaders/financeLoaders';
import * as superadminLoaders from './loaders/superadminLoaders';
import * as managerLoaders from './loaders/managerLoaders';
import * as sharedLoaders from './loaders/sharedLoaders';

/**
 * Higher-order function to create loader that has access to queryClient
 * This pattern allows loaders to inject queryClient dependency
 */
export const createLoader =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (loaderFn: (queryClient: QueryClient, ...args: any[]) => any) =>
  (queryClient: QueryClient) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]) =>
    loaderFn(queryClient, ...args);

/**
 * Create router with all routes configured
 * Call this function in App.tsx after getting queryClient from provider
 */
export const createAppRouter = (queryClient: QueryClient) => {
  const routes: RouteObject[] = [
    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC ROUTES - No authentication required
    // ═══════════════════════════════════════════════════════════════════════════
    {
      path: '/',
      element: <LandingPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/register',
      element: <RegistrationPage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/courses',
      element: <CourseCataloguePage />,
      loader: async () => sharedLoaders.publicCatalogLoader(queryClient),
    },
    {
      path: '/for-business',
      element: <ForBusinessPage />,
    },
    {
      path: '/course-details',
      element: <CourseLandingPage />,
    },
    {
      path: '/verify-email/:uidb64/:token',
      element: <EmailVerificationPage />,
    },
    {
      path: '/passwordreset',
      element: <PasswordResetPage />,
    },
    {
      path: '/reset-password/:uidb64/:token',
      element: <PasswordResetPage />,
    },
    {
      path: '/set-password/:uidb64/:token',
      element: <SetPasswordPage />,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // LEARNER ROUTES - Protected, role-restricted to learners
    // ═══════════════════════════════════════════════════════════════════════════
    {
      path: '/learner',
      element: <ProtectedRoute><LearnerDashboard /></ProtectedRoute>,
      errorElement: <ErrorPage />,
      loader: async () => learnerLoaders.learnerDashboardLoader(queryClient),
    },
    {
      path: '/learner/courses',
      element: <ProtectedRoute><LearnerCourseCatalogPage /></ProtectedRoute>,
      loader: async () => learnerLoaders.learnerCourseCatalogLoader(queryClient),
    },
    {
      path: '/learner/my-courses',
      element: <ProtectedRoute><MyCoursesPage /></ProtectedRoute>,
      loader: async () => learnerLoaders.myCoursesLoader(queryClient),
    },
    {
      path: '/learner/course/:courseId',
      element: <ProtectedRoute><LearnerCourseDetailPage /></ProtectedRoute>,
      loader: async (args) => learnerLoaders.learnerCourseDetailLoader(queryClient, args),
    },
    {
      path: '/learner/course/:courseId/learn',
      element: <ProtectedRoute><CoursePlayerPage /></ProtectedRoute>,
      loader: async (args) => learnerLoaders.coursePlayerLoader(queryClient, args),
    },
    {
      path: '/learner/assignments',
      element: <ProtectedRoute><LearnerAssignmentsPage /></ProtectedRoute>,
      loader: async () => learnerLoaders.learnerAssignmentsLoader(queryClient),
    },
    {
      path: '/learner/notifications',
      element: <ProtectedRoute><LearnerNotificationsPage /></ProtectedRoute>,
      loader: async () => learnerLoaders.learnerNotificationsLoader(),
    },
    {
      path: '/learner/progress',
      element: <ProtectedRoute><ProgressPage /></ProtectedRoute>,
      loader: async () => learnerLoaders.learnerProgressLoader(queryClient),
    },
    {
      path: '/learner/quizzes',
      element: <ProtectedRoute><QuizzesPage /></ProtectedRoute>,
    },
    {
      path: '/learner/schedule',
      element: <ProtectedRoute><MySchedulePage /></ProtectedRoute>,
    },
    {
      path: '/learner/saved',
      element: <ProtectedRoute><SavedCoursesPage /></ProtectedRoute>,
    },
    {
      path: '/learner/certificates',
      element: <ProtectedRoute><LearnerCertificatesPage /></ProtectedRoute>,
      loader: async () => learnerLoaders.learnerCertificatesLoader(queryClient),
    },
    {
      path: '/learner/profile',
      element: <ProtectedRoute><LearnerProfilePage /></ProtectedRoute>,
    },
    {
      path: '/learner/settings',
      element: <ProtectedRoute><SubscriptionManagementPage /></ProtectedRoute>,
    },
    {
      path: '/learner/subscription',
      element: <ProtectedRoute><SubscriptionManagementPage /></ProtectedRoute>,
    },
    {
      path: '/learner/payments',
      element: <ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>,
      // changes to be made in loader once payments service is ready
      // loader: async () => learnerLoaders.paymentHistoryLoader(queryClient),
    },

    // Checkout & Payments
    {
      path: '/checkout',
      element: <ProtectedRoute><CheckoutPaymentPage /></ProtectedRoute>,
      loader: async ({ request }) => {
        const url = new URL(request.url);
        const courseId = url.searchParams.get('courseId');
        return learnerLoaders.checkoutLoader(queryClient, { courseId: courseId || undefined });
      },
    },
    {
      path: '/invoice',
      element: <ProtectedRoute><InvoiceReceiptPage /></ProtectedRoute>,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // INSTRUCTOR ROUTES - Protected, role-restricted to instructors
    // ═══════════════════════════════════════════════════════════════════════════
    {
      path: '/instructor',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorDashboard /></ProtectedRoute>,
      errorElement: <ErrorPage />,
      loader: async () => instructorLoaders.instructorDashboardLoader(queryClient),
    },
    {
      path: '/instructor/courses',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorCoursesPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorCoursesLoader(queryClient),
    },
    {
      path: '/instructor/course/create',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CourseCreationPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.courseCreationFormLoader(queryClient),
    },
    {
      path: '/instructor/course/:courseId/edit',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CourseCreationPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.courseCreationFormLoader(queryClient),
    },
    {
      path: '/instructor/course/:courseId/structure',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CourseStructurePage /></ProtectedRoute>,
      loader: async (args) => instructorLoaders.courseStructureLoader(queryClient, args),
    },
    {
      path: '/instructor/course/:courseId/upload',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><ContentUploadPage /></ProtectedRoute>,
      loader: async (args) => instructorLoaders.courseStructureLoader(queryClient, args),
    },
    {
      path: '/instructor/course/:courseId/preview',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CoursePreviewPage /></ProtectedRoute>,
      loader: async (args) => instructorLoaders.coursePreviewLoader(queryClient, args),
    },
    {
      path: '/instructor/course/:courseId/quiz/builder',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><QuizBuilderPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/question-bank',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><QuestionBankPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/assignment/create',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><AssignmentCreationPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/grading',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><GradingPage /></ProtectedRoute>,
      // loader: async () => instructorLoaders.gradingLoader(queryClient),
    },
    {
      path: '/instructor/gradebook',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><GradebookPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.gradebookLoader(queryClient),
    },
    {
      path: '/instructor/sessions/schedule',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><SessionSchedulingPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/analytics',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorAnalyticsPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorAnalyticsLoader(queryClient),
    },
    {
      path: '/instructor/notifications',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorNotificationsPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/learners',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorLearnersPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorLearnersLoader(queryClient),
    },
    {
      path: '/instructor/progress',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><ProgressTrackingPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/profile',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorProfilePage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/sessions/recordings',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><RecordingsPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/sessions/upcoming',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><UpcomingSessionsPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/workshops',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><WorkshopsPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/workshops/:workshopId',
      element: <ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><WorkshopDetailsPage /></ProtectedRoute>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // MANAGER ROUTES - Protected, role-restricted to LMS managers
    // ═══════════════════════════════════════════════════════════════════════════
    {
      path: '/manager',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerDashboard /></ProtectedRoute>,
      errorElement: <ErrorPage />,
      loader: async () => managerLoaders.managerDashboardLoader(queryClient),
    },
    {
      path: '/manager/categories',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerCategoriesPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerCategoriesLoader(queryClient),
    },
    {
      path: '/manager/analytics',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerAnalyticsPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerAnalyticsLoader(queryClient),
    },
    {
      path: '/manager/approvals',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><CourseApprovalPage /></ProtectedRoute>,
      loader: async () => managerLoaders.approvalQueueLoader(queryClient),
    },
    {
      path: '/manager/approvals/:requestId',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><CourseApprovalDetailPage /></ProtectedRoute>,
      loader: async (args) => managerLoaders.approvalDetailLoader(queryClient, args as { params: { requestId?: string } }),
    },
    {
      path: '/manager/invite-user',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerInviteUserPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/reports',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerReportsPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/users',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerUsersPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/roles',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerRolesPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/import',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerBulkImportPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/activity',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerActivityPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/courses',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerCoursesPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/create-course',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerCreateCoursePage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/instructors',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerInstructorsPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/enrollments',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerEnrollmentsPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/bulk-enroll',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerBulkEnrollPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/progress',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerProgressPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/certificates',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerCertificatesPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/quizzes',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerQuizzesPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/assignments',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerAssignmentsPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/gradebook',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerGradebookPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/sessions',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerSessionsPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/recordings',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerRecordingsPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/schedule-new',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerScheduleNewPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/settings',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerSettingsPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/notifications',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerNotificationsPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/integrations',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerIntegrationsPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/billing',
      element: <ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerBillingPage /></ProtectedRoute>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // FINANCE ROUTES - Protected, role-restricted to finance personnel
    // ═══════════════════════════════════════════════════════════════════════════
    {
      path: '/finance',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceDashboard /></ProtectedRoute>,
      errorElement: <ErrorPage />,
      loader: async () => financeLoaders.financeDashboardLoader(queryClient),
    },
    {
      path: '/finance/payments',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinancePaymentsPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financePaymentsLoader(queryClient),
    },
    {
      path: '/finance/invoices',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceInvoicesPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeInvoicesLoader(queryClient),
    },
    {
      path: '/finance/subscriptions',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceSubscriptionsPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeSubscriptionsLoader(queryClient),
    },
    {
      path: '/finance/analytics',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceAnalyticsPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/alerts',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceAlertsPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/revenue-reports',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceRevenueReportsPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/subscription-history',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceSubscriptionHistoryPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/churn',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceChurnPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/pricing',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinancePricingPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/export',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceExportPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/statements',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceStatementsPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/custom-reports',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceCustomReportsPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/gateway/mpesa',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><GatewayMpesaPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/gateway/mtn',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><GatewayMtnPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/gateway/airtel',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><GatewayAirtelPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/gateway/pesapal',
      element: <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><GatewayPesapalPage /></ProtectedRoute>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SUPERADMIN ROUTES - Protected, role-restricted to system admins
    // ═══════════════════════════════════════════════════════════════════════════
    {
      path: '/superadmin',
      element: <ProtectedRoute requiredRole="tasc_admin"><SuperadminDashboard /></ProtectedRoute>,
      errorElement: <ErrorPage />,
      loader: async () => superadminLoaders.superadminDashboardLoader(queryClient),
    },
    {
      path: '/superadmin/users',
      element: <ProtectedRoute requiredRole="tasc_admin"><AllUsersPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/roles',
      element: <ProtectedRoute requiredRole="tasc_admin"><RolesPermissionsPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/audit-logs',
      element: <ProtectedRoute requiredRole="tasc_admin"><AuditLogsPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.auditLogsLoader(queryClient),
    },
    {
      path: '/superadmin/organizations',
      element: <ProtectedRoute requiredRole="tasc_admin"><AllOrganizationsPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/organizations/add',
      element: <ProtectedRoute requiredRole="tasc_admin"><AddOrganizationPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/partnerships',
      element: <ProtectedRoute requiredRole="tasc_admin"><PartnershipsPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/courses',
      element: <ProtectedRoute requiredRole="tasc_admin"><AllCoursesPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.allCoursesLoader(queryClient),
    },
    {
      path: '/superadmin/instructors',
      element: <ProtectedRoute requiredRole="tasc_admin"><InstructorsPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/certifications',
      element: <ProtectedRoute requiredRole="tasc_admin"><CertificationsPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/assessments',
      element: <ProtectedRoute requiredRole="tasc_admin"><AssessmentsPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/payments',
      element: <ProtectedRoute requiredRole="tasc_admin"><PaymentsPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/revenue',
      element: <ProtectedRoute requiredRole="tasc_admin"><RevenuePage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/invoices',
      element: <ProtectedRoute requiredRole="tasc_admin"><InvoicesPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/gateway-settings',
      element: <ProtectedRoute requiredRole="tasc_admin"><GatewaySettingsPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/settings',
      element: <ProtectedRoute requiredRole="tasc_admin"><SystemSettingsPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/integrations',
      element: <ProtectedRoute requiredRole="tasc_admin"><IntegrationsPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/data-migration',
      element: <ProtectedRoute requiredRole="tasc_admin"><DataMigrationPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/security',
      element: <ProtectedRoute requiredRole="tasc_admin"><SecurityPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/analytics',
      element: <ProtectedRoute requiredRole="tasc_admin"><AnalyticsPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/notifications',
      element: <ProtectedRoute requiredRole="tasc_admin"><NotificationsPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/add-user',
      element: <ProtectedRoute requiredRole="tasc_admin"><InviteUserPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/approvals',
      element: <ProtectedRoute requiredRole="tasc_admin"><CourseApprovalPage /></ProtectedRoute>,
      loader: async () => superadminLoaders.approvalQueueLoader(queryClient),
    },
    {
      path: '/superadmin/approvals/:requestId',
      element: <ProtectedRoute requiredRole="tasc_admin"><CourseApprovalDetailPage /></ProtectedRoute>,
      loader: async (args) => superadminLoaders.approvalDetailLoader(queryClient, args as { params: { requestId?: string } }),
    },
  ];

  return createBrowserRouter(routes);
};

export default createAppRouter;
