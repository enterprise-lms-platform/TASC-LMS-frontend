import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import VerificationPage from './pages/VerificationPage';
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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CourseCataloguePage />} />
        <Route path="/for-business" element={<ForBusinessPage />} />
        <Route path="/course-details" element={<CourseLandingPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/passwordreset" element={<PasswordResetPage />} />
        <Route path="/learner" element={<LearnerDashboard />} />
        <Route path="/learner/courses" element={<LearnerCourseCatalogPage />} />
        <Route path="/learner/course/:courseId" element={<LearnerCourseDetailPage />} />
        <Route path="/learner/subscription" element={<SubscriptionManagementPage />} />
        <Route path="/learner/payments" element={<PaymentHistoryPage />} />
        <Route path="/learner/profile" element={<SubscriptionManagementPage />} />
        <Route path="/learner/settings" element={<SubscriptionManagementPage />} />
        <Route path="/checkout" element={<CheckoutPaymentPage />} />
        <Route path="/invoice" element={<InvoiceReceiptPage />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/superadmin" element={<SuperadminDashboard />} />
        <Route path="/finance" element={<FinanceDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App