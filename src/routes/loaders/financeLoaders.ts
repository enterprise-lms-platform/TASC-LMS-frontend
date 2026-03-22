/**
 * Finance/Admin Route Loaders
 * Pre-fetches financial and admin-level data
 */

import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'react-router-dom';
import { queryKeys } from '../../hooks/queryKeys';
import { invoiceApi, transactionApi, subscriptionApi } from '../../services/payments.services';

const DEV_BYPASS_AUTH = import.meta.env.VITE_AUTH_BYPASS === 'true' && import.meta.env.DEV;

/**
 * Finance Dashboard Loader
 * Pre-fetches payment summaries and recent transactions
 */
export const financeDashboardLoader = async (queryClient: QueryClient) => {
  try {
    // Fetch recent transactions for overview
    const transactions = await queryClient.ensureQueryData({
      queryKey: queryKeys.transactions.all({ limit: 10 }),
      queryFn: () =>
        transactionApi.getAll({ limit: 10 }).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    // Fetch recent invoices
    const invoices = await queryClient.ensureQueryData({
      queryKey: queryKeys.invoices.all({ limit: 10 }),
      queryFn: () =>
        invoiceApi.getAll({ limit: 10 }).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { transactions, invoices };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    if (err.status === 403) return redirect('/learner');
    return { transactions: { results: [], count: 0 }, invoices: { results: [], count: 0 } };
  }
};

/**
 * Finance Payments Loader
 * Pre-fetches paginated payment history
 */
export const financePaymentsLoader = async (
  queryClient: QueryClient,
  params?: { page?: number; status?: string; from_date?: string; to_date?: string }
) => {
  try {
    const transactions = await queryClient.ensureQueryData({
      queryKey: queryKeys.transactions.all(params),
      queryFn: () => transactionApi.getAll(params).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { transactions };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    return { transactions: { results: [], count: 0 } };
  }
};

/**
 * Finance Invoices Loader
 * Pre-fetches invoices with filters
 */
export const financeInvoicesLoader = async (
  queryClient: QueryClient,
  params?: { page?: number; status?: string; from_date?: string; to_date?: string }
) => {
  try {
    const invoices = await queryClient.ensureQueryData({
      queryKey: queryKeys.invoices.all(params),
      queryFn: () => invoiceApi.getAll(params).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { invoices };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    return { invoices: { results: [], count: 0 } };
  }
};

/**
 * Finance Subscriptions Loader
 * Pre-fetches subscription data
 */
export const financeSubscriptionsLoader = async (
  queryClient: QueryClient
) => {
  try {
    const subscriptions = await queryClient.ensureQueryData({
      queryKey: queryKeys.subscriptions.all,
      queryFn: () => subscriptionApi.getAll().then((r) => r.data),
      staleTime: 10 * 60 * 1000,
    });

    return { subscriptions };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    return { subscriptions: [] };
  }
};

/**
 * Generic Finance Page Loader
 * Used for pages that need basic auth check
 */
export const financeRouteLoader = async (queryClient: QueryClient) => {
  try {
    // Check auth by attempting minimal fetch
    const transactions = await queryClient.ensureQueryData({
      queryKey: queryKeys.transactions.all({ limit: 1 }),
      queryFn: () => transactionApi.getAll({ limit: 1 }).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    });

    return { transactions };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401 && !DEV_BYPASS_AUTH) return redirect('/login');
    if (err.status === 403) return redirect('/learner');
    return {};
  }
};
