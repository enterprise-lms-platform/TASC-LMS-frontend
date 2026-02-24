import { Route, Routes } from "react-router-dom";

import ProtectedRoute from '../components/ProtectedRoute';
import LandingPage from "../pages/LandingPage";
import RegistrationPage from "../pages/RegistrationPage";
import LoginPage from "../pages/LoginPage";
import EmailVerificationPage from '../pages/EmailVerificationPage';
import LearnerDashboard from '../pages/LearnerDashboard';
import LearnerCourseCatalogPage from '../pages/LearnerCourseCatalogPage';
import MyCoursesPage from '../pages/MyCoursesPage';
import LearnerNotificationsPage from '../pages/LearnerNotificationsPage';
import MySchedulePage from '../pages/MySchedulePage';
import SavedCoursesPage from '../pages/SavedCoursesPage';
import ProgressPage from '../pages/ProgressPage';
import QuizzesPage from '../pages/QuizzesPage';
import LearnerAssignmentsPage from '../pages/LearnerAssignmentsPage';
import LearnerProfilePage from '../pages/LearnerProfilePage';
import CoursePlayerPage from '../pages/CoursePlayerPage';
import LearnerCourseDetailPage from '../pages/LearnerCourseDetailPage';
import CheckoutPaymentPage from '../pages/CheckoutPaymentPage';
import InvoiceReceiptPage from '../pages/InvoiceReceiptPage';
import SubscriptionManagementPage from '../pages/SubscriptionManagementPage';
import PaymentHistoryPage from '../pages/PaymentHistoryPage';
import ManagerDashboard from '../pages/ManagerDashboard';
import SuperadminDashboard from '../pages/SuperadminDashboard';
import FinanceDashboard from '../pages/FinanceDashboard';
import FinanceAnalyticsPage from '../pages/FinanceAnalyticsPage';
import CourseCataloguePage from '../pages/CourseCataloguePage';
import ForBusinessPage from '../pages/ForBusinessPage';
import CourseLandingPage from '../pages/CourseLandingPage';
import PasswordResetPage from '../pages/PasswordReset';
import InstructorDashboard from '../pages/InstructorDashboard';
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
import InstructorCoursesPage from '../pages/InstructorCoursesPage';
import UpcomingSessionsPage from '../pages/UpcomingSessionsPage';
import RecordingsPage from '../pages/RecordingsPage';
import InstructorLearnersPage from '../pages/InstructorLearnersPage';
import ProgressTrackingPage from '../pages/ProgressTrackingPage';
import InstructorProfilePage from '../pages/InstructorProfilePage';
import WorkshopsPage from '../pages/WorkshopsPage';
import WorkshopDetailsPage from '../pages/WorkshopDetailsPage';
import InviteUserPage from '../pages/InviteUserPage';
import SetPasswordPage from '../pages/SetPasswordPage';
import {
  AllUsersPage, RolesPermissionsPage, AuditLogsPage,
  AllOrganizationsPage, AddOrganizationPage, PartnershipsPage,
  AllCoursesPage, InstructorsPage, CertificationsPage, AssessmentsPage,
  PaymentsPage, RevenuePage, InvoicesPage, GatewaySettingsPage,
  SystemSettingsPage, IntegrationsPage, DataMigrationPage, SecurityPage,
  AnalyticsPage, NotificationsPage,
} from '../pages/superadmin';

export default function AppRoutes() {
  return (
    <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<CourseCataloguePage />} />
          <Route path="/for-business" element={<ForBusinessPage />} />
          <Route path="/course-details" element={<CourseLandingPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email/:uidb64/:token" element={<EmailVerificationPage />} />
          <Route path="/passwordreset" element={<PasswordResetPage />} />
          <Route path="/reset-password/:uidb64/:token" element={<PasswordResetPage />} />
          <Route path="/set-password/:uidb64/:token" element={<SetPasswordPage />} />
          
          {/* Protected Learner Routes */}
          <Route path="/learner" element={<ProtectedRoute><LearnerDashboard /></ProtectedRoute>} />
          <Route path="/learner/my-courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
          <Route path="/learner/notifications" element={<ProtectedRoute><LearnerNotificationsPage /></ProtectedRoute>} />
          <Route path="/learner/schedule" element={<ProtectedRoute><MySchedulePage /></ProtectedRoute>} />
          <Route path="/learner/saved" element={<ProtectedRoute><SavedCoursesPage /></ProtectedRoute>} />
          <Route path="/learner/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="/learner/quizzes" element={<ProtectedRoute><QuizzesPage /></ProtectedRoute>} />
          <Route path="/learner/assignments" element={<ProtectedRoute><LearnerAssignmentsPage /></ProtectedRoute>} />
          <Route path="/learner/courses" element={<ProtectedRoute><LearnerCourseCatalogPage /></ProtectedRoute>} />
          <Route path="/learner/course/:courseId" element={<ProtectedRoute><LearnerCourseDetailPage /></ProtectedRoute>} />
          <Route path="/learner/course/:courseId/learn" element={<ProtectedRoute><CoursePlayerPage /></ProtectedRoute>} />
          <Route path="/learner/subscription" element={<ProtectedRoute><SubscriptionManagementPage /></ProtectedRoute>} />
          <Route path="/learner/payments" element={<ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>} />
          <Route path="/learner/profile" element={<ProtectedRoute><LearnerProfilePage /></ProtectedRoute>} />
          <Route path="/learner/settings" element={<ProtectedRoute><SubscriptionManagementPage /></ProtectedRoute>} />
          
          {/* Protected Checkout & Invoice */}
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPaymentPage /></ProtectedRoute>} />
          <Route path="/invoice" element={<ProtectedRoute><InvoiceReceiptPage /></ProtectedRoute>} />
          
          {/* Protected Instructor Routes */}
          <Route path="/instructor" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/course/create" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CourseCreationPage /></ProtectedRoute>} />
          <Route path="/instructor/course/:courseId/edit" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CourseCreationPage /></ProtectedRoute>} />
          <Route path="/instructor/course/:courseId/structure" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CourseStructurePage /></ProtectedRoute>} />
          <Route path="/instructor/course/:courseId/upload" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><ContentUploadPage /></ProtectedRoute>} />
          <Route path="/instructor/course/:courseId/preview" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CoursePreviewPage /></ProtectedRoute>} />
          <Route path="/instructor/course/:courseId/quiz/builder" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><QuizBuilderPage /></ProtectedRoute>} />
          <Route path="/instructor/question-bank" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><QuestionBankPage /></ProtectedRoute>} />
          <Route path="/instructor/assignment/create" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><AssignmentCreationPage /></ProtectedRoute>} />
          <Route path="/instructor/grading" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><GradingPage /></ProtectedRoute>} />
          <Route path="/instructor/gradebook" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><GradebookPage /></ProtectedRoute>} />
          <Route path="/instructor/sessions/schedule" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><SessionSchedulingPage /></ProtectedRoute>} />
          <Route path="/instructor/analytics" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorAnalyticsPage /></ProtectedRoute>} />
          <Route path="/instructor/notifications" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorNotificationsPage /></ProtectedRoute>} />
          <Route path="/instructor/courses" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorCoursesPage /></ProtectedRoute>} />
          <Route path="/instructor/sessions/upcoming" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><UpcomingSessionsPage /></ProtectedRoute>} />
          <Route path="/instructor/sessions/recordings" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><RecordingsPage /></ProtectedRoute>} />
          <Route path="/instructor/learners" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorLearnersPage /></ProtectedRoute>} />
          <Route path="/instructor/progress" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><ProgressTrackingPage /></ProtectedRoute>} />
          <Route path="/instructor/profile" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorProfilePage /></ProtectedRoute>} />
          <Route path="/instructor/workshops" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><WorkshopsPage /></ProtectedRoute>} />
          <Route path="/instructor/workshops/:workshopId" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><WorkshopDetailsPage /></ProtectedRoute>} />
          
          {/* Protected Manager Routes */}
          <Route path="/manager" element={<ProtectedRoute allowedRoles={['lms_manager', 'tasc_admin']}><ManagerDashboard /></ProtectedRoute>} />
          
          {/* Protected Admin Routes */}
          <Route path="/superadmin" element={<ProtectedRoute requiredRole="tasc_admin"><SuperadminDashboard /></ProtectedRoute>} />
          <Route path="/superadmin/add-user" element={<ProtectedRoute requiredRole="tasc_admin"><InviteUserPage /></ProtectedRoute>} />
          <Route path="/superadmin/analytics" element={<ProtectedRoute requiredRole="tasc_admin"><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/superadmin/notifications" element={<ProtectedRoute requiredRole="tasc_admin"><NotificationsPage /></ProtectedRoute>} />
          <Route path="/superadmin/users" element={<ProtectedRoute requiredRole="tasc_admin"><AllUsersPage /></ProtectedRoute>} />
          <Route path="/superadmin/roles" element={<ProtectedRoute requiredRole="tasc_admin"><RolesPermissionsPage /></ProtectedRoute>} />
          <Route path="/superadmin/audit-logs" element={<ProtectedRoute requiredRole="tasc_admin"><AuditLogsPage /></ProtectedRoute>} />
          <Route path="/superadmin/organizations" element={<ProtectedRoute requiredRole="tasc_admin"><AllOrganizationsPage /></ProtectedRoute>} />
          <Route path="/superadmin/organizations/add" element={<ProtectedRoute requiredRole="tasc_admin"><AddOrganizationPage /></ProtectedRoute>} />
          <Route path="/superadmin/partnerships" element={<ProtectedRoute requiredRole="tasc_admin"><PartnershipsPage /></ProtectedRoute>} />
          <Route path="/superadmin/courses" element={<ProtectedRoute requiredRole="tasc_admin"><AllCoursesPage /></ProtectedRoute>} />
          <Route path="/superadmin/instructors" element={<ProtectedRoute requiredRole="tasc_admin"><InstructorsPage /></ProtectedRoute>} />
          <Route path="/superadmin/certifications" element={<ProtectedRoute requiredRole="tasc_admin"><CertificationsPage /></ProtectedRoute>} />
          <Route path="/superadmin/assessments" element={<ProtectedRoute requiredRole="tasc_admin"><AssessmentsPage /></ProtectedRoute>} />
          <Route path="/superadmin/payments" element={<ProtectedRoute requiredRole="tasc_admin"><PaymentsPage /></ProtectedRoute>} />
          <Route path="/superadmin/revenue" element={<ProtectedRoute requiredRole="tasc_admin"><RevenuePage /></ProtectedRoute>} />
          <Route path="/superadmin/invoices" element={<ProtectedRoute requiredRole="tasc_admin"><InvoicesPage /></ProtectedRoute>} />
          <Route path="/superadmin/gateway-settings" element={<ProtectedRoute requiredRole="tasc_admin"><GatewaySettingsPage /></ProtectedRoute>} />
          <Route path="/superadmin/settings" element={<ProtectedRoute requiredRole="tasc_admin"><SystemSettingsPage /></ProtectedRoute>} />
          <Route path="/superadmin/integrations" element={<ProtectedRoute requiredRole="tasc_admin"><IntegrationsPage /></ProtectedRoute>} />
          <Route path="/superadmin/data-migration" element={<ProtectedRoute requiredRole="tasc_admin"><DataMigrationPage /></ProtectedRoute>} />
          <Route path="/superadmin/security" element={<ProtectedRoute requiredRole="tasc_admin"><SecurityPage /></ProtectedRoute>} />
          
          {/* Protected Finance Routes */}
          <Route path="/finance" element={<ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceDashboard /></ProtectedRoute>} />
          <Route path="/finance/analytics" element={<ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceAnalyticsPage /></ProtectedRoute>} />
        </Routes>
  );
}