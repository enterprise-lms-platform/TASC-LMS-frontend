/**
 * Superadmin route definitions.
 * All routes require requiredRole: 'tasc_admin'.
 */
import { lazy, type ReactNode, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { type RouteObject } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorPage from '../pages/ErrorPage';
import * as superadminLoaders from './loaders/superadminLoaders';

const SW = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>}>
    {children}
  </Suspense>
);
const PR = ({ children }: { children: React.ReactElement }) => (
  <ProtectedRoute requiredRole="tasc_admin">{children}</ProtectedRoute>
);

const SuperadminDashboard      = lazy(() => import('../pages/SuperadminDashboard'));
const AllUsersPage             = lazy(() => import('../pages/superadmin/AllUsersPage'));
const RolesPermissionsPage     = lazy(() => import('../pages/superadmin/RolesPermissionsPage'));
const AuditLogsPage            = lazy(() => import('../pages/superadmin/AuditLogsPage'));
const AllOrganizationsPage     = lazy(() => import('../pages/superadmin/AllOrganizationsPage'));
const AddOrganizationPage      = lazy(() => import('../pages/superadmin/AddOrganizationPage'));
const PartnershipsPage         = lazy(() => import('../pages/superadmin/PartnershipsPage'));
const AllCoursesPage           = lazy(() => import('../pages/superadmin/AllCoursesPage'));
const InstructorsPage          = lazy(() => import('../pages/superadmin/InstructorsPage'));
const CertificationsPage       = lazy(() => import('../pages/superadmin/CertificationsPage'));
const AssessmentsPage          = lazy(() => import('../pages/superadmin/AssessmentsPage'));
const PaymentsPage             = lazy(() => import('../pages/superadmin/PaymentsPage'));
const RevenuePage              = lazy(() => import('../pages/superadmin/RevenuePage'));
const InvoicesPage             = lazy(() => import('../pages/superadmin/InvoicesPage'));
const GatewaySettingsPage      = lazy(() => import('../pages/superadmin/GatewaySettingsPage'));
const SystemSettingsPage       = lazy(() => import('../pages/superadmin/SystemSettingsPage'));
const IntegrationsPage         = lazy(() => import('../pages/superadmin/IntegrationsPage'));
const DataMigrationPage        = lazy(() => import('../pages/superadmin/DataMigrationPage'));
const SecurityPage             = lazy(() => import('../pages/superadmin/SecurityPage'));
const AnalyticsPage            = lazy(() => import('../pages/superadmin/AnalyticsPage'));
const NotificationsPage        = lazy(() => import('../pages/superadmin/NotificationsPage'));
const InviteUserPage           = lazy(() => import('../pages/superadmin/InviteUserPage'));
const SuperadminProfilePage    = lazy(() => import('../pages/superadmin/SuperadminProfilePage'));
const SuperadminMessagesPage   = lazy(() => import('../pages/superadmin/SuperadminMessagesPage'));
const CourseApprovalPage       = lazy(() => import('../pages/manager/CourseApprovalPage'));
const CourseApprovalDetailPage = lazy(() => import('../pages/manager/CourseApprovalDetailPage'));
const SuperadminReviewsPage    = lazy(() => import('../pages/superadmin/SuperadminReviewsPage'));

export const superadminRoutes = (queryClient: QueryClient): RouteObject[] => [
  { path: '/superadmin', element: <SW><PR><SuperadminDashboard /></PR></SW>, errorElement: <ErrorPage />, loader: async () => superadminLoaders.superadminDashboardLoader(queryClient) },
  { path: '/superadmin/users', element: <SW><PR><AllUsersPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/roles', element: <SW><PR><RolesPermissionsPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/audit-logs', element: <SW><PR><AuditLogsPage /></PR></SW>, loader: async () => superadminLoaders.auditLogsLoader(queryClient) },
  { path: '/superadmin/organizations', element: <SW><PR><AllOrganizationsPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/organizations/add', element: <SW><PR><AddOrganizationPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/partnerships', element: <SW><PR><PartnershipsPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/courses', element: <SW><PR><AllCoursesPage /></PR></SW>, loader: async () => superadminLoaders.allCoursesLoader(queryClient) },
  { path: '/superadmin/instructors', element: <SW><PR><InstructorsPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/certifications', element: <SW><PR><CertificationsPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/assessments', element: <SW><PR><AssessmentsPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/payments', element: <SW><PR><PaymentsPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/revenue', element: <SW><PR><RevenuePage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/invoices', element: <SW><PR><InvoicesPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/gateway-settings', element: <SW><PR><GatewaySettingsPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/settings', element: <SW><PR><SystemSettingsPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/integrations', element: <SW><PR><IntegrationsPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/data-migration', element: <SW><PR><DataMigrationPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/security', element: <SW><PR><SecurityPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/analytics', element: <SW><PR><AnalyticsPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/notifications', element: <SW><PR><NotificationsPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/add-user', element: <SW><PR><InviteUserPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/approvals', element: <SW><PR><CourseApprovalPage /></PR></SW>, loader: async () => superadminLoaders.approvalQueueLoader(queryClient) },
  { path: '/superadmin/approvals/:requestId', element: <SW><PR><CourseApprovalDetailPage /></PR></SW>, loader: async (args: any) => superadminLoaders.approvalDetailLoader(queryClient, args) },
  { path: '/superadmin/reviews', element: <SW><PR><SuperadminReviewsPage /></PR></SW>, loader: async () => superadminLoaders.superadminRouteLoader(queryClient) },
  { path: '/superadmin/messages', element: <SW><PR><SuperadminMessagesPage /></PR></SW> },
  { path: '/superadmin/profile', element: <SW><PR><SuperadminProfilePage /></PR></SW> },
];
