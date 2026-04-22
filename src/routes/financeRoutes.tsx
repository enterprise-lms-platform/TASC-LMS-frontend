/**
 * Finance route definitions.
 * All routes require allowedRoles: ['finance', 'tasc_admin'].
 */
import { lazy, type ReactNode, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { type RouteObject } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorPage from '../pages/ErrorPage';
import * as financeLoaders from './loaders/financeLoaders';

const SW = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>}>
    {children}
  </Suspense>
);
const PR = ({ children }: { children: React.ReactElement }) => (
  <ProtectedRoute allowedRoles={['finance', 'tasc_admin']}>{children}</ProtectedRoute>
);

const FinanceDashboard              = lazy(() => import('../pages/finance/FinanceDashboard'));
const FinanceAnalyticsPage          = lazy(() => import('../pages/finance/FinanceAnalyticsPage'));
const FinanceAlertsPage             = lazy(() => import('../pages/finance/FinanceAlertsPage'));
const FinancePaymentsPage           = lazy(() => import('../pages/finance/FinancePaymentsPage'));
const FinancePaymentDetailPage      = lazy(() => import('../pages/finance/FinancePaymentDetailPage'));
const FinanceInvoicesPage           = lazy(() => import('../pages/finance/FinanceInvoicesPage'));
const FinanceRevenueReportsPage     = lazy(() => import('../pages/finance/FinanceRevenueReportsPage'));
const FinanceSubscriptionsPage      = lazy(() => import('../pages/finance/FinanceSubscriptionsPage'));
const FinanceSubscriptionHistoryPage = lazy(() => import('../pages/finance/FinanceSubscriptionHistoryPage'));
const FinanceChurnPage              = lazy(() => import('../pages/finance/FinanceChurnPage'));
const FinancePricingPage            = lazy(() => import('../pages/finance/FinancePricingPage'));
const FinanceExportPage             = lazy(() => import('../pages/finance/FinanceExportPage'));
const FinanceStatementsPage         = lazy(() => import('../pages/finance/FinanceStatementsPage'));
const FinanceCustomReportsPage      = lazy(() => import('../pages/finance/FinanceCustomReportsPage'));
const GatewayMpesaPage             = lazy(() => import('../pages/finance/GatewayMpesaPage'));
const GatewayMtnPage               = lazy(() => import('../pages/finance/GatewayMtnPage'));
const GatewayAirtelPage            = lazy(() => import('../pages/finance/GatewayAirtelPage'));
const GatewayPesapalPage           = lazy(() => import('../pages/finance/GatewayPesapalPage'));
const FinanceProfilePage           = lazy(() => import('../pages/finance/FinanceProfilePage'));

export const financeRoutes = (queryClient: QueryClient): RouteObject[] => [
  { path: '/finance', element: <SW><PR><FinanceDashboard /></PR></SW>, errorElement: <ErrorPage />, loader: async () => financeLoaders.financeDashboardLoader(queryClient) },
  { path: '/finance/payments', element: <SW><PR><FinancePaymentsPage /></PR></SW>, loader: async () => financeLoaders.financePaymentsLoader(queryClient) },
  { path: '/finance/payments/:paymentId', element: <SW><PR><FinancePaymentDetailPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/invoices', element: <SW><PR><FinanceInvoicesPage /></PR></SW>, loader: async () => financeLoaders.financeInvoicesLoader(queryClient) },
  { path: '/finance/subscriptions', element: <SW><PR><FinanceSubscriptionsPage /></PR></SW>, loader: async () => financeLoaders.financeSubscriptionsLoader(queryClient) },
  { path: '/finance/analytics', element: <SW><PR><FinanceAnalyticsPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/alerts', element: <SW><PR><FinanceAlertsPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/revenue-reports', element: <SW><PR><FinanceRevenueReportsPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/subscription-history', element: <SW><PR><FinanceSubscriptionHistoryPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/churn', element: <SW><PR><FinanceChurnPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/pricing', element: <SW><PR><FinancePricingPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/export', element: <SW><PR><FinanceExportPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/statements', element: <SW><PR><FinanceStatementsPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/custom-reports', element: <SW><PR><FinanceCustomReportsPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/gateway/mpesa', element: <SW><PR><GatewayMpesaPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/gateway/mtn', element: <SW><PR><GatewayMtnPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/gateway/airtel', element: <SW><PR><GatewayAirtelPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/gateway/pesapal', element: <SW><PR><GatewayPesapalPage /></PR></SW>, loader: async () => financeLoaders.financeRouteLoader(queryClient) },
  { path: '/finance/profile', element: <SW><PR><FinanceProfilePage /></PR></SW> },
];
