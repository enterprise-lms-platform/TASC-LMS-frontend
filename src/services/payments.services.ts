
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
} from '../types/types';

const BASE_PATH = '/api/v1/payments';

// INVOICES

export interface InvoiceParams {
  customer?: number;
  status?: string;
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
};

// TRANSACTIONS

export interface TransactionParams {
  invoice?: number;
  status?: string;
}

export const transactionApi = {
  
//  List all transactions (finance team sees all, users see their own)
  getAll: (params?: TransactionParams) =>
    apiClient.get<Transaction[]>(`${BASE_PATH}/transactions/`, { params }),

  
//  Get transaction details by ID
  getById: (id: number) =>
    apiClient.get<Transaction>(`${BASE_PATH}/transactions/${id}/`),
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

export const subscriptionApi = {
  
//  List all active subscription plans
  getAll: () =>
    apiClient.get<Subscription[]>(`${BASE_PATH}/subscriptions/`),

  
//  Get subscription plan details by ID
  getById: (id: number) =>
    apiClient.get<Subscription>(`${BASE_PATH}/subscriptions/${id}/`),
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