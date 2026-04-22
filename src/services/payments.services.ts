
//  Payments API Service

import { apiClient } from '../utils/config';
import type {
  Invoice,
  InvoiceCreateRequest,
  Transaction,
  PaymentMethod,
  PaymentMethodCreateRequest,
  Subscription,
  UserSubscription,
  UserSubscriptionCreateRequest,
  MySubscriptionStatus,
} from '../types/types';

const BASE_PATH = '/api/v1/payments';

// INVOICES

export interface InvoiceParams {
  customer?: number;
  status?: string;
  limit?: number;
  page?: number;
  from_date?: string;           // YYYY-MM-DD
  to_date?: string;             // YYYY-MM-DD
}

export const invoiceApi = {

  //  List all invoices (finance team sees all, users see their own)
  getAll: (params?: InvoiceParams) =>
    apiClient.get<Invoice[]>(`${BASE_PATH}/invoices/`, { params }),


  //  Get invoice details by ID
  getById: (id: number) =>
    apiClient.get<Invoice>(`${BASE_PATH}/invoices/${id}/`),


  //  Create a new invoice (finance team only)
  create: (data: InvoiceCreateRequest) =>
    apiClient.post<Invoice>(`${BASE_PATH}/invoices/`, data),


  //  Update an invoice (finance team only)
  update: (id: number, data: Partial<Invoice>) =>
    apiClient.put<Invoice>(`${BASE_PATH}/invoices/${id}/`, data),


  //  Partially update an invoice (finance team only)
  partialUpdate: (id: number, data: Partial<Invoice>) =>
    apiClient.patch<Invoice>(`${BASE_PATH}/invoices/${id}/`, data),


  //  Delete an invoice
  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/invoices/${id}/`),


  //  Pay an invoice
  pay: (id: number) =>
    apiClient.post<Invoice>(`${BASE_PATH}/invoices/${id}/pay/`),

  //  Email a receipt for an invoice to the customer
  emailReceipt: (id: number) =>
    apiClient.post(`${BASE_PATH}/invoices/${id}/email-receipt/`),
};

// TRANSACTIONS

export interface TransactionParams {
  invoice?: number;
  status?: string;
  limit?: number;
  page?: number;
  page_size?: number;
  from_date?: string;           // YYYY-MM-DD
  to_date?: string;             // YYYY-MM-DD
}

export interface FinancePaymentParams {
  status?: string;
  payment_method?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface FinancePaymentRecord {
  id: string;
  user_email: string;
  amount: string;
  currency: string;
  status: string;
  payment_method: string;
  provider_order_id?: string | null;
  provider_payment_id?: string | null;
  description?: string;
  created_at: string;
  completed_at?: string | null;
  updated_at: string;
}

export const transactionApi = {

  // List all transactions (finance team sees all, users see their own)
  getAll: (params?: TransactionParams) =>
    apiClient.get<Transaction[]>(`${BASE_PATH}/transactions/`, { params }),


  // Get transaction details by ID
  getById: (id: number) =>
    apiClient.get<Transaction>(`${BASE_PATH}/transactions/${id}/`),

  // Export transactions as CSV blob
  exportCSV: (params?: { status?: string }) =>
    apiClient.get<Blob>(`${BASE_PATH}/transactions/export-csv/`, { params, responseType: 'blob' }),

  // Retry a failed payment
  retry: (id: number) =>
    apiClient.post<{ message: string; transaction_id: string; status: string }>(`${BASE_PATH}/transactions/${id}/retry/`),

  // Refund a completed Pesapal payment
  refund: (id: string | number, remarks?: string) =>
    apiClient.post<{ success: boolean; message: string }>(`${BASE_PATH}/pesapal/${id}/refund/`, { remarks }),
};

export const financePaymentApi = {
  getAll: (params?: FinancePaymentParams) =>
    apiClient.get<FinancePaymentRecord[]>(`${BASE_PATH}/finance/payments/`, { params }),
  getById: (id: string) =>
    apiClient.get<FinancePaymentRecord>(`${BASE_PATH}/finance/payments/${id}/`),
  refund: (id: string | number, remarks?: string) =>
    apiClient.post<{ success: boolean; message: string }>(`${BASE_PATH}/pesapal/${id}/refund/`, { remarks }),
};

// PAYMENT METHODS

export const paymentMethodApi = {

  //  List all saved payment methods for the authenticated user
  getAll: () =>
    apiClient.get<PaymentMethod[]>(`${BASE_PATH}/payment-methods/`),


  //  Get payment method details by ID
  getById: (id: number) =>
    apiClient.get<PaymentMethod>(`${BASE_PATH}/payment-methods/${id}/`),


  //  Add a new payment method
  create: (data: PaymentMethodCreateRequest) =>
    apiClient.post<PaymentMethod>(`${BASE_PATH}/payment-methods/`, data),


  //  Update a payment method
  update: (id: number, data: Partial<PaymentMethod>) =>
    apiClient.put<PaymentMethod>(`${BASE_PATH}/payment-methods/${id}/`, data),


  //  Partially update a payment method
  partialUpdate: (id: number, data: Partial<PaymentMethod>) =>
    apiClient.patch<PaymentMethod>(`${BASE_PATH}/payment-methods/${id}/`, data),


  //  Delete a saved payment method
  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/payment-methods/${id}/`),


  //  Set a payment method as default
  setDefault: (id: number) =>
    apiClient.post<PaymentMethod>(`${BASE_PATH}/payment-methods/${id}/set_default/`),
};

// SUBSCRIPTIONS (Plans)

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  duration_days: number;
  max_courses: number | null;
  max_users: number | null;
  trial_days: number;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlanCreate {
  name: string;
  description?: string;
  price: number;
  currency: string;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  features?: string[];
  duration_days: number;
  max_courses?: number | null;
  max_users?: number | null;
  trial_days?: number;
  status?: 'active' | 'inactive' | 'archived';
}

export const subscriptionApi = {

  // List subscription plans (TASC admins see all, others see active only)
  getAll: () =>
    apiClient.get<Subscription[]>(`${BASE_PATH}/subscriptions/`),

  // Get subscription plan details by ID
  getById: (id: number) =>
    apiClient.get<Subscription>(`${BASE_PATH}/subscriptions/${id}/`),

  // Get the current user's subscription status
  getMyStatus: () =>
    apiClient.get<MySubscriptionStatus>(`${BASE_PATH}/subscription/me/`),

  // Create a new subscription plan (TASC Admin only)
  create: (data: SubscriptionPlanCreate) =>
    apiClient.post<Subscription>(`${BASE_PATH}/subscriptions/`, data),

  // Update a subscription plan (TASC Admin only)
  update: (id: number, data: Partial<SubscriptionPlanCreate>) =>
    apiClient.put<Subscription>(`${BASE_PATH}/subscriptions/${id}/`, data),

  // Partially update a subscription plan (TASC Admin only)
  partialUpdate: (id: number, data: Partial<SubscriptionPlanCreate>) =>
    apiClient.patch<Subscription>(`${BASE_PATH}/subscriptions/${id}/`, data),

  // Delete a subscription plan (TASC Admin only)
  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/subscriptions/${id}/`),
};

// USER SUBSCRIPTIONS (Enrollments in subscription plans)

export interface UserSubscriptionParams {
  status?: string;
  user?: number;
}

export const userSubscriptionApi = {

  //  List user subscriptions (finance team sees all, users see their own)
  getAll: (params?: UserSubscriptionParams) =>
    apiClient.get<UserSubscription[]>(`${BASE_PATH}/user-subscriptions/`, {
      params,
    }),


  //  Get user subscription details by ID
  getById: (id: number) =>
    apiClient.get<UserSubscription>(`${BASE_PATH}/user-subscriptions/${id}/`),


  //  Subscribe to a subscription plan
  create: (data: UserSubscriptionCreateRequest) =>
    apiClient.post<UserSubscription>(`${BASE_PATH}/user-subscriptions/`, data),


  //  Update a user subscription
  update: (id: number, data: Partial<UserSubscription>) =>
    apiClient.put<UserSubscription>(`${BASE_PATH}/user-subscriptions/${id}/`, data),


  //  Partially update a user subscription
  partialUpdate: (id: number, data: Partial<UserSubscription>) =>
    apiClient.patch<UserSubscription>(`${BASE_PATH}/user-subscriptions/${id}/`, data),


  //  Delete a user subscription
  delete: (id: number) =>
    apiClient.delete(`${BASE_PATH}/user-subscriptions/${id}/`),


  //  Cancel an active subscription
  cancel: (id: number) =>
    apiClient.post<UserSubscription>(`${BASE_PATH}/user-subscriptions/${id}/cancel/`),


  //  Renew a subscription for another billing period
  renew: (id: number) =>
    apiClient.post<UserSubscription>(`${BASE_PATH}/user-subscriptions/${id}/renew/`),
};

export interface FinanceDashboardOverview {
  currency: string;
  kpis: {
    total_collected_revenue: string;
    collected_revenue_this_month: string;
    pending_invoices_count: number;
    pending_invoices_amount: string;
    active_subscribers: number;
  };
  revenue_trend: Array<{
    month: string;
    collected_revenue: string;
  }>;
  recent_payment_events: Array<{
    payment_id: string;
    created_at: string;
    completed_at: string | null;
    status: string;
    amount: string;
    currency: string;
    payment_method: string;
    provider_order_id: string | null;
    provider_payment_id: string | null;
    user_email: string | null;
    description: string;
  }>;
}

export const financeDashboardApi = {
  getOverview: () =>
    apiClient.get<FinanceDashboardOverview>(`${BASE_PATH}/finance/dashboard-overview/`),
};

// PESAPAL
export interface PesapalInitiateRequest {
  amount: string;
  currency?: string;
  description?: string;
}

export interface PesapalInitiateResponse {
  payment_id: string;
  redirect_url: string;
  order_tracking_id: string;
}

export interface PesapalPaymentStatusResponse {
  order_tracking_id: string;
  status: string;
  payment_method: string;
  amount: number;
  currency: string;
  confirmation_code: string;
  message: string;
}

export interface PesapalRecurringInitiateRequest {
  subscription_id: number;
  currency?: string;
}

export interface PesapalRecurringInitiateResponse {
  payment_id: string;
  redirect_url: string;
  order_tracking_id: string;
  subscription_id: number;
}

/** Same body as recurring initiate; hits standard one-time Pesapal order for plan checkout. */
export type PesapalSubscriptionOneTimeInitiateRequest = PesapalRecurringInitiateRequest;

export interface PesapalSubscriptionOneTimeInitiateResponse {
  payment_id: string;
  redirect_url: string;
  order_tracking_id: string;
  user_subscription_id?: number;
}

export const pesapalApi = {
  initiate: (data: PesapalInitiateRequest) =>
    apiClient.post<PesapalInitiateResponse>(`${BASE_PATH}/pesapal/initiate/`, data),
  initiateRecurring: (data: PesapalRecurringInitiateRequest) =>
    apiClient.post<PesapalRecurringInitiateResponse>(`${BASE_PATH}/pesapal/recurring/initiate/`, data),
  initiateSubscriptionOnetime: (data: PesapalSubscriptionOneTimeInitiateRequest) =>
    apiClient.post<PesapalSubscriptionOneTimeInitiateResponse>(
      `${BASE_PATH}/pesapal/initiate-subscription-onetime/`,
      data,
    ),
  getStatus: (paymentId: string) =>
    apiClient.get<PesapalPaymentStatusResponse>(`${BASE_PATH}/pesapal/${paymentId}/status/`),
  registerIPN: () =>
    apiClient.post<{ ipn_id: string; url: string; environment: string }>(
      `${BASE_PATH}/pesapal/ipn-admin/register/`,
    ),
};
