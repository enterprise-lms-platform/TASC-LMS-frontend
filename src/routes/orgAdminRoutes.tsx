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

export const orgAdminRoutes = (_queryClient: QueryClient): RouteObject[] => [
  { path: '/org-admin', element: <SW><PR><OrgAdminDashboardPage /></PR></SW> },
  { path: '/org-admin/members', element: <SW><PR><MembersPage /></PR></SW> },
  { path: '/org-admin/invite', element: <SW><PR><InviteMemberPage /></PR></SW> },
  { path: '/org-admin/import', element: <SW><PR><ImportMembersPage /></PR></SW> },
];

