import { lazy, type ReactNode, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { type RouteObject } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import ProtectedRoute from '../components/ProtectedRoute';

const SW = ({ children }: { children: ReactNode }) => (
  <Suspense
    fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    }
  >
    {children}
  </Suspense>
);

const PR = ({ children }: { children: React.ReactElement }) => (
  <ProtectedRoute allowedRoles={['org_admin']}>{children}</ProtectedRoute>
);

const OrgAdminDashboardPage = lazy(() => import('../pages/orgadmin/OrgAdminDashboardPage'));
const MembersPage = lazy(() => import('../pages/orgadmin/MembersPage'));
const InviteMemberPage = lazy(() => import('../pages/orgadmin/InviteMemberPage'));
const ImportMembersPage = lazy(() => import('../pages/orgadmin/ImportMembersPage'));
const AnalyticsPage = lazy(() => import('../pages/orgadmin/AnalyticsPage'));
const ReportsPage = lazy(() => import('../pages/orgadmin/ReportsPage'));
const NotificationsPage = lazy(() => import('../pages/orgadmin/NotificationsPage'));
const MessagesPage = lazy(() => import('../pages/orgadmin/MessagesPage'));
const ActivityPage = lazy(() => import('../pages/orgadmin/ActivityPage'));
const CoursesPage = lazy(() => import('../pages/orgadmin/CoursesPage'));
const EnrollmentsPage = lazy(() => import('../pages/orgadmin/EnrollmentsPage'));
const BulkEnrollPage = lazy(() => import('../pages/orgadmin/BulkEnrollPage'));
const ProgressPage = lazy(() => import('../pages/orgadmin/ProgressPage'));
const CertificatesPage = lazy(() => import('../pages/orgadmin/CertificatesPage'));
const SettingsPage = lazy(() => import('../pages/orgadmin/SettingsPage'));
const ProfilePage = lazy(() => import('../pages/orgadmin/ProfilePage'));
const LeaveTestimonialPage = lazy(() => import('../pages/orgadmin/LeaveTestimonialPage'));

export const orgAdminRoutes = (_queryClient: QueryClient): RouteObject[] => [
  { path: '/org-admin', element: <SW><PR><OrgAdminDashboardPage /></PR></SW> },
  { path: '/org-admin/members', element: <SW><PR><MembersPage /></PR></SW> },
  { path: '/org-admin/invite', element: <SW><PR><InviteMemberPage /></PR></SW> },
  { path: '/org-admin/import', element: <SW><PR><ImportMembersPage /></PR></SW> },
  { path: '/org-admin/analytics', element: <SW><PR><AnalyticsPage /></PR></SW> },
  { path: '/org-admin/reports', element: <SW><PR><ReportsPage /></PR></SW> },
  { path: '/org-admin/notifications', element: <SW><PR><NotificationsPage /></PR></SW> },
  { path: '/org-admin/messages', element: <SW><PR><MessagesPage /></PR></SW> },
  { path: '/org-admin/activity', element: <SW><PR><ActivityPage /></PR></SW> },
  { path: '/org-admin/courses', element: <SW><PR><CoursesPage /></PR></SW> },
  { path: '/org-admin/enrollments', element: <SW><PR><EnrollmentsPage /></PR></SW> },
  { path: '/org-admin/bulk-enroll', element: <SW><PR><BulkEnrollPage /></PR></SW> },
  { path: '/org-admin/progress', element: <SW><PR><ProgressPage /></PR></SW> },
  { path: '/org-admin/certificates', element: <SW><PR><CertificatesPage /></PR></SW> },
  { path: '/org-admin/testimonial', element: <SW><PR><LeaveTestimonialPage /></PR></SW> },
  { path: '/org-admin/settings', element: <SW><PR><SettingsPage /></PR></SW> },
  { path: '/org-admin/profile', element: <SW><PR><ProfilePage /></PR></SW> },
];