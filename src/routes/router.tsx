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
import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { QueryClient } from '@tanstack/react-query';

// Layout & Error Components
import ErrorPage from '../pages/ErrorPage';
import ProtectedRoute from '../components/ProtectedRoute';

// Public Pages
const LandingPage = lazy(() => import('../pages/public/LandingPage'));
const CourseCataloguePage = lazy(() => import('../pages/public/CourseCataloguePage'));
const CourseLandingPage = lazy(() => import('../pages/public/CourseLandingPage'));
const ForBusinessPage = lazy(() => import('../pages/public/ForBusinessPage'));
const LoginPage = lazy(() => import('../pages/public/LoginPage'));
const RegistrationPage = lazy(() => import('../pages/public/RegistrationPage'));
const EmailVerificationPage = lazy(() => import('../pages/public/EmailVerificationPage'));
const PasswordResetPage = lazy(() => import('../pages/public/PasswordReset'));
const SetPasswordPage = lazy(() => import('../pages/public/SetPasswordPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/public/PrivacyPolicyPage'));
const CertificateValidationPage = lazy(() => import('../pages/public/CertificateValidationPage'));

// Learner Pages
const LearnerDashboard = lazy(() => import('../pages/learner/LearnerDashboard'));
const LearnerCourseCatalogPage = lazy(() => import('../pages/learner/LearnerCourseCatalogPage'));
const MyCoursesPage = lazy(() => import('../pages/learner/MyCoursesPage'));
const LearnerCourseDetailPage = lazy(() => import('../pages/learner/LearnerCourseDetailPage'));
const CoursePlayerPage = lazy(() => import('../pages/learner/CoursePlayerPage'));
const LearnerAssignmentsPage = lazy(() => import('../pages/learner/LearnerAssignmentsPage'));
const LearnerNotificationsPage = lazy(() => import('../pages/learner/LearnerNotificationsPage'));
const ProgressPage = lazy(() => import('../pages/learner/ProgressPage'));
const QuizzesPage = lazy(() => import('../pages/learner/QuizzesPage'));
const MySchedulePage = lazy(() => import('../pages/learner/MySchedulePage'));
const SavedCoursesPage = lazy(() => import('../pages/learner/SavedCoursesPage'));
const LearnerProfilePage = lazy(() => import('../pages/learner/LearnerProfilePage'));
const CheckoutPaymentPage = lazy(() => import('../pages/learner/CheckoutPaymentPage'));
const InvoiceReceiptPage = lazy(() => import('../pages/learner/InvoiceReceiptPage'));
const SubscriptionManagementPage = lazy(() => import('../pages/learner/SubscriptionManagementPage'));
const PaymentHistoryPage = lazy(() => import('../pages/learner/PaymentHistoryPage'));
const LearnerCertificatesPage = lazy(() => import('../pages/learner/LearnerCertificatesPage'));
const LearnerBadgesPage = lazy(() => import('../pages/learner/LearnerBadgesPage'));
const LearnerMessagesPage = lazy(() => import('../pages/learner/LearnerMessagesPage'));

// Instructor Pages
const InstructorDashboard = lazy(() => import('../pages/instructor/InstructorDashboard'));
const InstructorCoursesPage = lazy(() => import('../pages/instructor/InstructorCoursesPage'));
const CourseCreationPage = lazy(() => import('../pages/instructor/CourseCreationPage'));
const CourseStructurePage = lazy(() => import('../pages/instructor/CourseStructurePage'));
const ContentUploadPage = lazy(() => import('../pages/instructor/ContentUploadPage'));
const CoursePreviewPage = lazy(() => import('../pages/instructor/CoursePreviewPage'));
const QuizBuilderPage = lazy(() => import('../pages/instructor/QuizBuilderPage'));
const QuestionBankPage = lazy(() => import('../pages/instructor/QuestionBankPage'));
const AssignmentsHubPage = lazy(() => import('../pages/instructor/AssignmentsHubPage'));
const AssignmentCreationPage = lazy(() => import('../pages/instructor/AssignmentCreationPage'));
const GradingPage = lazy(() => import('../pages/instructor/GradingPage'));
const GradebookPage = lazy(() => import('../pages/instructor/GradebookPage'));
const SessionSchedulingPage = lazy(() => import('../pages/instructor/SessionSchedulingPage'));
const InstructorAnalyticsPage = lazy(() => import('../pages/instructor/InstructorAnalyticsPage'));
const InstructorNotificationsPage = lazy(() => import('../pages/instructor/InstructorNotificationsPage'));
const InstructorLearnersPage = lazy(() => import('../pages/instructor/InstructorLearnersPage'));
const ProgressTrackingPage = lazy(() => import('../pages/instructor/ProgressTrackingPage'));
const InstructorProfilePage = lazy(() => import('../pages/instructor/InstructorProfilePage'));
const RecordingsPage = lazy(() => import('../pages/instructor/RecordingsPage'));
const UpcomingSessionsPage = lazy(() => import('../pages/instructor/UpcomingSessionsPage'));
const WorkshopsPage = lazy(() => import('../pages/instructor/WorkshopsPage'));
const WorkshopDetailsPage = lazy(() => import('../pages/instructor/WorkshopDetailsPage'));
const InstructorMessagesPage = lazy(() => import('../pages/InstructorMessagesPage'));

// Manager Pages
const ManagerDashboard = lazy(() => import('../pages/manager/ManagerDashboard'));
const ManagerCategoriesPage = lazy(() => import('../pages/manager/ManagerCategoriesPage'));
const ManagerAnalyticsPage = lazy(() => import('../pages/manager/ManagerAnalyticsPage'));
const ManagerInviteUserPage = lazy(() => import('../pages/manager/ManagerInviteUserPage'));
const CourseApprovalPage = lazy(() => import('../pages/manager/CourseApprovalPage'));
const CourseApprovalDetailPage = lazy(() => import('../pages/manager/CourseApprovalDetailPage'));
const ManagerReportsPage = lazy(() => import('../pages/manager/ManagerReportsPage'));
const ManagerUsersPage = lazy(() => import('../pages/manager/ManagerUsersPage'));
const ManagerRolesPage = lazy(() => import('../pages/manager/ManagerRolesPage'));
const ManagerBulkImportPage = lazy(() => import('../pages/manager/ManagerBulkImportPage'));
const ManagerActivityPage = lazy(() => import('../pages/manager/ManagerActivityPage'));
const ManagerCoursesPage = lazy(() => import('../pages/manager/ManagerCoursesPage'));
const ManagerCreateCoursePage = lazy(() => import('../pages/manager/ManagerCreateCoursePage'));

const ManagerInstructorsPage = lazy(() => import('../pages/manager/ManagerInstructorsPage'));
const ManagerEnrollmentsPage = lazy(() => import('../pages/manager/ManagerEnrollmentsPage'));
const ManagerBulkEnrollPage = lazy(() => import('../pages/manager/ManagerBulkEnrollPage'));
const ManagerProgressPage = lazy(() => import('../pages/manager/ManagerProgressPage'));
const ManagerCertificatesPage = lazy(() => import('../pages/manager/ManagerCertificatesPage'));
const ManagerQuizzesPage = lazy(() => import('../pages/manager/ManagerQuizzesPage'));
const ManagerAssignmentsPage = lazy(() => import('../pages/manager/ManagerAssignmentsPage'));
const ManagerGradebookPage = lazy(() => import('../pages/manager/ManagerGradebookPage'));
const ManagerSessionsPage = lazy(() => import('../pages/manager/ManagerSessionsPage'));
const ManagerRecordingsPage = lazy(() => import('../pages/manager/ManagerRecordingsPage'));
const ManagerScheduleNewPage = lazy(() => import('../pages/manager/ManagerScheduleNewPage'));
const ManagerSettingsPage = lazy(() => import('../pages/manager/ManagerSettingsPage'));
const ManagerNotificationsPage = lazy(() => import('../pages/manager/ManagerNotificationsPage'));
const ManagerIntegrationsPage = lazy(() => import('../pages/manager/ManagerIntegrationsPage'));
const ManagerBillingPage = lazy(() => import('../pages/manager/ManagerBillingPage'));
const ManagerProfilePage = lazy(() => import('../pages/manager/ManagerProfilePage'));
const ManagerMessagesPage = lazy(() => import('../pages/manager/ManagerMessagesPage'));

// Finance Pages
const FinanceDashboard = lazy(() => import('../pages/finance/FinanceDashboard'));
const FinanceAnalyticsPage = lazy(() => import('../pages/finance/FinanceAnalyticsPage'));
const FinanceAlertsPage = lazy(() => import('../pages/finance/FinanceAlertsPage'));
const FinancePaymentsPage = lazy(() => import('../pages/finance/FinancePaymentsPage'));
const FinanceInvoicesPage = lazy(() => import('../pages/finance/FinanceInvoicesPage'));
const FinanceRevenueReportsPage = lazy(() => import('../pages/finance/FinanceRevenueReportsPage'));
const FinanceSubscriptionsPage = lazy(() => import('../pages/finance/FinanceSubscriptionsPage'));
const FinanceSubscriptionHistoryPage = lazy(() => import('../pages/finance/FinanceSubscriptionHistoryPage'));
const FinanceChurnPage = lazy(() => import('../pages/finance/FinanceChurnPage'));
const FinancePricingPage = lazy(() => import('../pages/finance/FinancePricingPage'));
const FinanceExportPage = lazy(() => import('../pages/finance/FinanceExportPage'));
const FinanceStatementsPage = lazy(() => import('../pages/finance/FinanceStatementsPage'));
const FinanceCustomReportsPage = lazy(() => import('../pages/finance/FinanceCustomReportsPage'));
const GatewayMpesaPage = lazy(() => import('../pages/finance/GatewayMpesaPage'));
const GatewayMtnPage = lazy(() => import('../pages/finance/GatewayMtnPage'));
const GatewayAirtelPage = lazy(() => import('../pages/finance/GatewayAirtelPage'));
const GatewayPesapalPage = lazy(() => import('../pages/finance/GatewayPesapalPage'));
const FinanceProfilePage = lazy(() => import('../pages/finance/FinanceProfilePage'));

// Superadmin Pages
const SuperadminDashboard = lazy(() => import('../pages/SuperadminDashboard'));
const AllUsersPage = lazy(() => import('../pages/superadmin/AllUsersPage'));
const RolesPermissionsPage = lazy(() => import('../pages/superadmin/RolesPermissionsPage'));
const AuditLogsPage = lazy(() => import('../pages/superadmin/AuditLogsPage'));
const AllOrganizationsPage = lazy(() => import('../pages/superadmin/AllOrganizationsPage'));
const AddOrganizationPage = lazy(() => import('../pages/superadmin/AddOrganizationPage'));
const PartnershipsPage = lazy(() => import('../pages/superadmin/PartnershipsPage'));
const AllCoursesPage = lazy(() => import('../pages/superadmin/AllCoursesPage'));
const InstructorsPage = lazy(() => import('../pages/superadmin/InstructorsPage'));
const CertificationsPage = lazy(() => import('../pages/superadmin/CertificationsPage'));
const AssessmentsPage = lazy(() => import('../pages/superadmin/AssessmentsPage'));
const PaymentsPage = lazy(() => import('../pages/superadmin/PaymentsPage'));
const RevenuePage = lazy(() => import('../pages/superadmin/RevenuePage'));
const InvoicesPage = lazy(() => import('../pages/superadmin/InvoicesPage'));
const GatewaySettingsPage = lazy(() => import('../pages/superadmin/GatewaySettingsPage'));
const SystemSettingsPage = lazy(() => import('../pages/superadmin/SystemSettingsPage'));
const IntegrationsPage = lazy(() => import('../pages/superadmin/IntegrationsPage'));
const DataMigrationPage = lazy(() => import('../pages/superadmin/DataMigrationPage'));
const SecurityPage = lazy(() => import('../pages/superadmin/SecurityPage'));
const AnalyticsPage = lazy(() => import('../pages/superadmin/AnalyticsPage'));
const NotificationsPage = lazy(() => import('../pages/superadmin/NotificationsPage'));
const InviteUserPage = lazy(() => import('../pages/superadmin/InviteUserPage'));
const SuperadminProfilePage = lazy(() => import('../pages/superadmin/SuperadminProfilePage'));

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

/**
 * Suspense fallback for lazy-loaded routes
 */
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  }>
    {children}
  </Suspense>
);

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
      element: <SuspenseWrapper><LandingPage /></SuspenseWrapper>,
      errorElement: <ErrorPage />,
    },
    {
      path: '/register',
      element: <SuspenseWrapper><RegistrationPage /></SuspenseWrapper>,
    },
    {
      path: '/login',
      element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
    },
    {
      path: '/courses',
      element: <SuspenseWrapper><CourseCataloguePage /></SuspenseWrapper>,
      loader: async () => sharedLoaders.publicCatalogLoader(queryClient),
    },
    {
      path: '/for-business',
      element: <SuspenseWrapper><ForBusinessPage /></SuspenseWrapper>,
    },
    {
      path: '/course-details/:slug',
      element: <SuspenseWrapper><CourseLandingPage /></SuspenseWrapper>,
    },
    {
      path: '/verify-email/:uidb64/:token',
      element: <SuspenseWrapper><EmailVerificationPage /></SuspenseWrapper>,
    },
    {
      path: '/passwordreset',
      element: <SuspenseWrapper><PasswordResetPage /></SuspenseWrapper>,
    },
    {
      path: '/reset-password/:uidb64/:token',
      element: <SuspenseWrapper><PasswordResetPage /></SuspenseWrapper>,
    },
    {
      path: '/set-password/:uidb64/:token',
      element: <SuspenseWrapper><SetPasswordPage /></SuspenseWrapper>,
    },
    {
      path: '/privacy-policy',
      element: <SuspenseWrapper><PrivacyPolicyPage /></SuspenseWrapper>,
    },
    {
      path: '/verify-certificate',
      element: <SuspenseWrapper><CertificateValidationPage /></SuspenseWrapper>,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // LEARNER ROUTES - Protected, role-restricted to learners
    // ═══════════════════════════════════════════════════════════════════════════
    {
      path: '/learner',
      element: <SuspenseWrapper><ProtectedRoute><LearnerDashboard /></ProtectedRoute></SuspenseWrapper>,
      errorElement: <ErrorPage />,
      loader: async () => learnerLoaders.learnerDashboardLoader(queryClient),
    },
    {
      path: '/learner/courses',
      element: <SuspenseWrapper><ProtectedRoute><LearnerCourseCatalogPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => learnerLoaders.learnerCourseCatalogLoader(queryClient),
    },
    {
      path: '/learner/my-courses',
      element: <SuspenseWrapper><ProtectedRoute><MyCoursesPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => learnerLoaders.myCoursesLoader(queryClient),
    },
    {
      path: '/learner/course/:courseId',
      element: <SuspenseWrapper><ProtectedRoute><LearnerCourseDetailPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async (args) => learnerLoaders.learnerCourseDetailLoader(queryClient, args),
    },
    {
      path: '/learner/course/:courseId/learn',
      element: <SuspenseWrapper><ProtectedRoute><CoursePlayerPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async (args) => learnerLoaders.coursePlayerLoader(queryClient, args),
    },
    {
      path: '/learner/assignments',
      element: <SuspenseWrapper><ProtectedRoute><LearnerAssignmentsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => learnerLoaders.learnerAssignmentsLoader(queryClient),
    },
    {
      path: '/learner/notifications',
      element: <SuspenseWrapper><ProtectedRoute><LearnerNotificationsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => learnerLoaders.learnerNotificationsLoader(),
    },
    {
      path: '/learner/progress',
      element: <SuspenseWrapper><ProtectedRoute><ProgressPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => learnerLoaders.learnerProgressLoader(queryClient),
    },
    {
      path: '/learner/quizzes',
      element: <SuspenseWrapper><ProtectedRoute><QuizzesPage /></ProtectedRoute></SuspenseWrapper>,
    },
    {
      path: '/learner/schedule',
      element: <SuspenseWrapper><ProtectedRoute><MySchedulePage /></ProtectedRoute></SuspenseWrapper>,
    },
    {
      path: '/learner/saved',
      element: <SuspenseWrapper><ProtectedRoute><SavedCoursesPage /></ProtectedRoute></SuspenseWrapper>,
    },
    {
      path: '/learner/certificates',
      element: <SuspenseWrapper><ProtectedRoute><LearnerCertificatesPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => learnerLoaders.learnerCertificatesLoader(queryClient),
    },
    {
      path: '/learner/badges',
      element: <SuspenseWrapper><ProtectedRoute><LearnerBadgesPage /></ProtectedRoute></SuspenseWrapper>,
    },
    {
      path: '/learner/profile',
      element: <SuspenseWrapper><ProtectedRoute><LearnerProfilePage /></ProtectedRoute></SuspenseWrapper>,
    },
    {
      path: '/learner/settings',
      element: <SuspenseWrapper><ProtectedRoute><SubscriptionManagementPage /></ProtectedRoute></SuspenseWrapper>,
    },
    {
      path: '/learner/subscription',
      element: <SuspenseWrapper><ProtectedRoute><SubscriptionManagementPage /></ProtectedRoute></SuspenseWrapper>,
    },
    {
      path: '/learner/payments',
      element: <SuspenseWrapper><ProtectedRoute><PaymentHistoryPage /></ProtectedRoute></SuspenseWrapper>,
      // changes to be made in loader once payments service is ready
      // loader: async () => learnerLoaders.paymentHistoryLoader(queryClient),
    },
    {
      path: '/learner/messages',
      element: <SuspenseWrapper><ProtectedRoute><LearnerMessagesPage /></ProtectedRoute></SuspenseWrapper>,
    },

    // Checkout & Payments
    {
      path: '/checkout',
      element: <SuspenseWrapper><ProtectedRoute><CheckoutPaymentPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async ({ request }) => {
        const url = new URL(request.url);
        const courseId = url.searchParams.get('courseId') || url.searchParams.get('course');
        return learnerLoaders.checkoutLoader(queryClient, { courseId: courseId || undefined });
      },
    },
    {
      path: '/invoice',
      element: <SuspenseWrapper><ProtectedRoute><InvoiceReceiptPage /></ProtectedRoute></SuspenseWrapper>,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // INSTRUCTOR ROUTES - Protected, role-restricted to instructors
    // ═══════════════════════════════════════════════════════════════════════════
    {
      path: '/instructor',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorDashboard /></ProtectedRoute></SuspenseWrapper>,
      errorElement: <ErrorPage />,
      loader: async () => instructorLoaders.instructorDashboardLoader(queryClient),
    },
    {
      path: '/instructor/courses',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorCoursesPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorCoursesLoader(queryClient),
    },
    {
      path: '/instructor/course/create',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CourseCreationPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.courseCreationFormLoader(queryClient),
    },
    {
      path: '/instructor/course/:courseId/edit',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CourseCreationPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.courseCreationFormLoader(queryClient),
    },
    {
      path: '/instructor/course/:courseId/structure',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CourseStructurePage /></ProtectedRoute></SuspenseWrapper>,
      loader: async (args) => instructorLoaders.courseStructureLoader(queryClient, args),
    },
    {
      path: '/instructor/course/:courseId/upload',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><ContentUploadPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async (args) => instructorLoaders.courseStructureLoader(queryClient, args),
    },
    {
      path: '/instructor/course/:courseId/preview',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CoursePreviewPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async (args) => instructorLoaders.coursePreviewLoader(queryClient, args),
    },
    {
      path: '/instructor/course/:courseId/quiz/builder',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><QuizBuilderPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/question-bank',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><QuestionBankPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/assignments',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><AssignmentsHubPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/assignment/create',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><AssignmentCreationPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/grading',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><GradingPage /></ProtectedRoute></SuspenseWrapper>,
      // loader: async () => instructorLoaders.gradingLoader(queryClient),
    },
    {
      path: '/instructor/gradebook',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><GradebookPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.gradebookLoader(queryClient),
    },
    {
      path: '/instructor/sessions/schedule',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><SessionSchedulingPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/analytics',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorAnalyticsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorAnalyticsLoader(queryClient),
    },
    {
      path: '/instructor/notifications',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorNotificationsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/learners',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorLearnersPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorLearnersLoader(queryClient),
    },
    {
      path: '/instructor/progress',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><ProgressTrackingPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/profile',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorProfilePage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/sessions/recordings',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><RecordingsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/sessions/upcoming',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><UpcomingSessionsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/workshops',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><WorkshopsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/workshops/:workshopId',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><WorkshopDetailsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/instructor/messages',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorMessagesPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // MANAGER ROUTES - Protected, role-restricted to LMS managers
    // ═══════════════════════════════════════════════════════════════════════════
    {
      path: '/manager',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerDashboard /></ProtectedRoute></SuspenseWrapper>,
      errorElement: <ErrorPage />,
      loader: async () => managerLoaders.managerDashboardLoader(queryClient),
    },
    {
      path: '/manager/categories',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerCategoriesPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerCategoriesLoader(queryClient),
    },
    {
      path: '/manager/analytics',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerAnalyticsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerAnalyticsLoader(queryClient),
    },
    {
      path: '/manager/approvals',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><CourseApprovalPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.approvalQueueLoader(queryClient),
    },
    {
      path: '/manager/approvals/:requestId',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><CourseApprovalDetailPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async (args) => managerLoaders.approvalDetailLoader(queryClient, args as { params: { requestId?: string } }),
    },
    {
      path: '/manager/invite-user',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerInviteUserPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/reports',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerReportsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/users',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerUsersPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/roles',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerRolesPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/import',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerBulkImportPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/activity',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerActivityPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/courses',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerCoursesPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/create-course',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerCreateCoursePage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/courses/create',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><CourseCreationPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.courseCreationFormLoader(queryClient),
    },
    {
      path: '/manager/courses/:courseId',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><CoursePreviewPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async (args) => instructorLoaders.coursePreviewLoader(queryClient, args),
    },
    {
      path: '/manager/courses/:courseId/edit',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><CourseCreationPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.courseCreationFormLoader(queryClient),
    },
    {
      path: '/manager/courses/:courseId/structure',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><CourseStructurePage /></ProtectedRoute></SuspenseWrapper>,
      loader: async (args) => instructorLoaders.courseStructureLoader(queryClient, args),
    },
    {
      path: '/manager/courses/:courseId/upload',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ContentUploadPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async (args) => instructorLoaders.courseStructureLoader(queryClient, args),
    },
    {
      path: '/manager/courses/:courseId/preview',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><CoursePreviewPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async (args) => instructorLoaders.coursePreviewLoader(queryClient, args),
    },
    {
      path: '/manager/courses/:courseId/quiz/builder',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><QuizBuilderPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/manager/assignment/create',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><AssignmentCreationPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/manager/sessions/schedule',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><SessionSchedulingPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => instructorLoaders.instructorRouteLoader(queryClient),
    },
    {
      path: '/manager/instructors',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerInstructorsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/enrollments',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerEnrollmentsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/bulk-enroll',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerBulkEnrollPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/progress',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerProgressPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/certificates',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerCertificatesPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/quizzes',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerQuizzesPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/assignments',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerAssignmentsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/gradebook',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerGradebookPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/sessions',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerSessionsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/recordings',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerRecordingsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/schedule-new',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerScheduleNewPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/settings',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerSettingsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/notifications',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerNotificationsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/integrations',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerIntegrationsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/billing',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerBillingPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },
    {
      path: '/manager/profile',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerProfilePage /></ProtectedRoute></SuspenseWrapper>,
    },
    {
      path: '/manager/messages',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerMessagesPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => managerLoaders.managerRouteLoader(queryClient),
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // FINANCE ROUTES - Protected, role-restricted to finance personnel
    // ═══════════════════════════════════════════════════════════════════════════
    {
      path: '/finance',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceDashboard /></ProtectedRoute></SuspenseWrapper>,
      errorElement: <ErrorPage />,
      loader: async () => financeLoaders.financeDashboardLoader(queryClient),
    },
    {
      path: '/finance/payments',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinancePaymentsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financePaymentsLoader(queryClient),
    },
    {
      path: '/finance/invoices',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceInvoicesPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeInvoicesLoader(queryClient),
    },
    {
      path: '/finance/subscriptions',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceSubscriptionsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeSubscriptionsLoader(queryClient),
    },
    {
      path: '/finance/analytics',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceAnalyticsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/alerts',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceAlertsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/revenue-reports',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceRevenueReportsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/subscription-history',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceSubscriptionHistoryPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/churn',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceChurnPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/pricing',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinancePricingPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/export',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceExportPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/statements',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceStatementsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/custom-reports',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceCustomReportsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/gateway/mpesa',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><GatewayMpesaPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/gateway/mtn',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><GatewayMtnPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/gateway/airtel',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><GatewayAirtelPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/gateway/pesapal',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><GatewayPesapalPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => financeLoaders.financeRouteLoader(queryClient),
    },
    {
      path: '/finance/profile',
      element: <SuspenseWrapper><ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceProfilePage /></ProtectedRoute></SuspenseWrapper>,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SUPERADMIN ROUTES - Protected, role-restricted to system admins
    // ═══════════════════════════════════════════════════════════════════════════
    {
      path: '/superadmin',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><SuperadminDashboard /></ProtectedRoute></SuspenseWrapper>,
      errorElement: <ErrorPage />,
      loader: async () => superadminLoaders.superadminDashboardLoader(queryClient),
    },
    {
      path: '/superadmin/users',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><AllUsersPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/roles',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><RolesPermissionsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/audit-logs',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><AuditLogsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.auditLogsLoader(queryClient),
    },
    {
      path: '/superadmin/organizations',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><AllOrganizationsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/organizations/add',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><AddOrganizationPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/partnerships',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><PartnershipsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/courses',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><AllCoursesPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.allCoursesLoader(queryClient),
    },
    {
      path: '/superadmin/instructors',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><InstructorsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/certifications',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><CertificationsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/assessments',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><AssessmentsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/payments',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><PaymentsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/revenue',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><RevenuePage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/invoices',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><InvoicesPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/gateway-settings',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><GatewaySettingsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/settings',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><SystemSettingsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/integrations',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><IntegrationsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/data-migration',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><DataMigrationPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/security',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><SecurityPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/analytics',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><AnalyticsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/notifications',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><NotificationsPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/add-user',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><InviteUserPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.superadminRouteLoader(queryClient),
    },
    {
      path: '/superadmin/approvals',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><CourseApprovalPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async () => superadminLoaders.approvalQueueLoader(queryClient),
    },
    {
      path: '/superadmin/approvals/:requestId',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><CourseApprovalDetailPage /></ProtectedRoute></SuspenseWrapper>,
      loader: async (args) => superadminLoaders.approvalDetailLoader(queryClient, args as { params: { requestId?: string } }),
    },
    {
      path: '/superadmin/profile',
      element: <SuspenseWrapper><ProtectedRoute requiredRole="tasc_admin"><SuperadminProfilePage /></ProtectedRoute></SuspenseWrapper>,
    },
  ];

  return createBrowserRouter(routes);
};

export default createAppRouter;
