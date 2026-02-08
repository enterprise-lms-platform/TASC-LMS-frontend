import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from "./pages/LandingPage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from './pages/EmailVerificationPage';
import LearnerDashboard from './pages/LearnerDashboard';
import LearnerCourseCatalogPage from './pages/LearnerCourseCatalogPage';
import LearnerCourseDetailPage from './pages/LearnerCourseDetailPage';
import CheckoutPaymentPage from './pages/CheckoutPaymentPage';
import InvoiceReceiptPage from './pages/InvoiceReceiptPage';
import SubscriptionManagementPage from './pages/SubscriptionManagementPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import ManagerDashboard from './pages/ManagerDashboard';
import SuperadminDashboard from './pages/SuperadminDashboard';
import FinanceDashboard from './pages/FinanceDashboard';
import CourseCataloguePage from './pages/CourseCataloguePage';
import ForBusinessPage from './pages/ForBusinessPage';
import CourseLandingPage from './pages/CourseLandingPage';
import PasswordResetPage from './pages/PasswordReset';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseCreationPage from './pages/CourseCreationPage';
import CourseStructurePage from './pages/CourseStructurePage';
import ContentUploadPage from './pages/ContentUploadPage';
import CoursePreviewPage from './pages/CoursePreviewPage';
import QuizBuilderPage from './pages/QuizBuilderPage';
import QuestionBankPage from './pages/QuestionBankPage';
import AssignmentCreationPage from './pages/AssignmentCreationPage';
import GradingPage from './pages/GradingPage';
import SessionSchedulingPage from './pages/SessionSchedulingPage';
import InviteUserPage from './pages/InviteUserPage';
import SetPasswordPage from './pages/SetPasswordPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
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
          <Route path="/set-password/:uidb64/:token" element={<SetPasswordPage />} />
          
          {/* Protected Learner Routes */}
          <Route path="/learner" element={<ProtectedRoute><LearnerDashboard /></ProtectedRoute>} />
          <Route path="/learner/courses" element={<ProtectedRoute><LearnerCourseCatalogPage /></ProtectedRoute>} />
          <Route path="/learner/course/:courseId" element={<ProtectedRoute><LearnerCourseDetailPage /></ProtectedRoute>} />
          <Route path="/learner/subscription" element={<ProtectedRoute><SubscriptionManagementPage /></ProtectedRoute>} />
          <Route path="/learner/payments" element={<ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>} />
          <Route path="/learner/profile" element={<ProtectedRoute><SubscriptionManagementPage /></ProtectedRoute>} />
          <Route path="/learner/settings" element={<ProtectedRoute><SubscriptionManagementPage /></ProtectedRoute>} />
          
          {/* Protected Checkout & Invoice */}
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPaymentPage /></ProtectedRoute>} />
          <Route path="/invoice" element={<ProtectedRoute><InvoiceReceiptPage /></ProtectedRoute>} />
          
          {/* Protected Instructor Routes */}
          <Route path="/instructor" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/course/create" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CourseCreationPage /></ProtectedRoute>} />
          <Route path="/instructor/course/:courseId/structure" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CourseStructurePage /></ProtectedRoute>} />
          <Route path="/instructor/course/:courseId/upload" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><ContentUploadPage /></ProtectedRoute>} />
          <Route path="/instructor/course/:courseId/preview" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><CoursePreviewPage /></ProtectedRoute>} />
          <Route path="/instructor/course/:courseId/quiz/builder" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><QuizBuilderPage /></ProtectedRoute>} />
          <Route path="/instructor/question-bank" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><QuestionBankPage /></ProtectedRoute>} />
          <Route path="/instructor/assignment/create" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><AssignmentCreationPage /></ProtectedRoute>} />
          <Route path="/instructor/grading" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><GradingPage /></ProtectedRoute>} />
          <Route path="/instructor/sessions/schedule" element={<ProtectedRoute allowedRoles={['instructor', 'tasc_admin']}><SessionSchedulingPage /></ProtectedRoute>} />
          
          {/* Protected Manager Routes */}
          <Route path="/manager" element={<ProtectedRoute allowedRoles={['lms_manager', 'org_admin', 'tasc_admin']}><ManagerDashboard /></ProtectedRoute>} />
          
          {/* Protected Admin Routes */}
          <Route path="/superadmin" element={<ProtectedRoute requiredRole="tasc_admin"><SuperadminDashboard /></ProtectedRoute>} />
          <Route path="/superadmin/add-user" element={<ProtectedRoute requiredRole="tasc_admin"><InviteUserPage /></ProtectedRoute>} />
          
          {/* Protected Finance Routes */}
          <Route path="/finance" element={<ProtectedRoute allowedRoles={['finance', 'tasc_admin']}><FinanceDashboard /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App