/**
 * Public route definitions — no authentication required.
 * Imported by src/routes/router.tsx via createAppRouter().
 */
import { lazy, type ReactNode, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { type RouteObject } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import * as sharedLoaders from './loaders/sharedLoaders';

const SuspenseWrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>}>
    {children}
  </Suspense>
);

const LandingPage            = lazy(() => import('../pages/public/LandingPage'));
const CourseCataloguePage    = lazy(() => import('../pages/public/CourseCataloguePage'));
const CourseLandingPage      = lazy(() => import('../pages/public/CourseLandingPage'));
const ForBusinessPage        = lazy(() => import('../pages/public/ForBusinessPage'));
const LoginPage              = lazy(() => import('../pages/public/LoginPage'));
const RegistrationPage       = lazy(() => import('../pages/public/RegistrationPage'));
const EmailVerificationPage  = lazy(() => import('../pages/public/EmailVerificationPage'));
const PasswordResetPage      = lazy(() => import('../pages/public/PasswordReset'));
const SetPasswordPage        = lazy(() => import('../pages/public/SetPasswordPage'));
const PrivacyPolicyPage      = lazy(() => import('../pages/public/PrivacyPolicyPage'));
const CertificateValidationPage = lazy(() => import('../pages/public/CertificateValidationPage'));
const PesapalReturnPage      = lazy(() => import('../pages/learner/PesapalReturnPage'));

export const publicRoutes = (queryClient: QueryClient): RouteObject[] => [
  { path: '/', element: <SuspenseWrapper><LandingPage /></SuspenseWrapper> },
  { path: '/register', element: <SuspenseWrapper><RegistrationPage /></SuspenseWrapper> },
  { path: '/login', element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
  { path: '/courses', element: <SuspenseWrapper><CourseCataloguePage /></SuspenseWrapper>, loader: async () => sharedLoaders.publicCatalogLoader(queryClient) },
  { path: '/for-business', element: <SuspenseWrapper><ForBusinessPage /></SuspenseWrapper> },
  { path: '/course-details/:slug', element: <SuspenseWrapper><CourseLandingPage /></SuspenseWrapper> },
  { path: '/verify-email/:uidb64/:token', element: <SuspenseWrapper><EmailVerificationPage /></SuspenseWrapper> },
  { path: '/passwordreset', element: <SuspenseWrapper><PasswordResetPage /></SuspenseWrapper> },
  { path: '/reset-password/:uidb64/:token', element: <SuspenseWrapper><PasswordResetPage /></SuspenseWrapper> },
  { path: '/set-password/:uidb64/:token', element: <SuspenseWrapper><SetPasswordPage /></SuspenseWrapper> },
  { path: '/privacy-policy', element: <SuspenseWrapper><PrivacyPolicyPage /></SuspenseWrapper> },
  { path: '/verify-certificate', element: <SuspenseWrapper><CertificateValidationPage /></SuspenseWrapper> },
  // Pesapal return pages are public (no auth required — Pesapal redirects here)
  { path: '/payments/success',  element: <SuspenseWrapper><PesapalReturnPage /></SuspenseWrapper> },
  { path: '/payments/failed',   element: <SuspenseWrapper><PesapalReturnPage /></SuspenseWrapper> },
  { path: '/payments/pending',  element: <SuspenseWrapper><PesapalReturnPage /></SuspenseWrapper> },
];
