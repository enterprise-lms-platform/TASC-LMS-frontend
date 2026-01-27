import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import VerificationPage from './pages/VerificationPage';
import LearnerDashboard from './pages/LearnerDashboard';
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
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/superadmin" element={<SuperadminDashboard />} />
        <Route path="/finance" element={<FinanceDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App