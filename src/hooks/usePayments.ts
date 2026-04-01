// hooks/usePayments.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  invoiceApi,
  transactionApi,
  paymentMethodApi,
  subscriptionApi,
  userSubscriptionApi,
  pesapalApi,
  type InvoiceParams,
  type TransactionParams,
  type UserSubscriptionParams,
  type PesapalInitiateRequest,
} from '../services/payments.services';
import { reportsApi, type ReportListParams } from '../services/reports.services';
import { queryKeys } from './queryKeys';
import type {
  InvoiceCreateRequest,
  Invoice,
  PaymentMethodCreateRequest,
  PaymentMethod,
  UserSubscriptionCreateRequest,
  UserSubscription,
} from '../types/types';

// ── Invoices ──

export const useInvoices = (params?: InvoiceParams) =>
  useQuery({
    queryKey: queryKeys.invoices.all(params),
    queryFn: () => invoiceApi.getAll(params).then((r) => {
      const data = r.data;
      return Array.isArray(data) ? data : (data as any).results ?? [];
    }),
  });

export const useInvoice = (id: number) =>
  useQuery({
    queryKey: queryKeys.invoices.detail(id),
    queryFn: () => invoiceApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InvoiceCreateRequest) =>
      invoiceApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useUpdateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Invoice> }) =>
      invoiceApi.update(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({
        queryKey: queryKeys.invoices.detail(variables.id),
      });
    },
  });
};

export const usePartialUpdateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Invoice> }) =>
      invoiceApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({
        queryKey: queryKeys.invoices.detail(variables.id),
      });
    },
  });
};

export const useDeleteInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => invoiceApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const usePayInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => invoiceApi.pay(id).then((r) => r.data),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: queryKeys.invoices.detail(id) });
      qc.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

// ── Transactions (read-only) ──

export const useTransactions = (params?: TransactionParams) =>
  useQuery({
    queryKey: queryKeys.transactions.all(params),
    queryFn: () => transactionApi.getAll(params).then((r) => {
      const data = r.data;
      return Array.isArray(data) ? data : (data as any).results ?? [];
    }),
  });

export const useTransaction = (id: number) =>
  useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: () => transactionApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

// ── Payment Methods ──

export const usePaymentMethods = () =>
  useQuery({
    queryKey: queryKeys.paymentMethods.all,
    queryFn: () => paymentMethodApi.getAll().then((r) => {
      const data = r.data;
      return Array.isArray(data) ? data : (data as any).results ?? [];
    }),
  });

export const usePaymentMethod = (id: number) =>
  useQuery({
    queryKey: queryKeys.paymentMethods.detail(id),
    queryFn: () => paymentMethodApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreatePaymentMethod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PaymentMethodCreateRequest) =>
      paymentMethodApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

export const useUpdatePaymentMethod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PaymentMethod> }) =>
      paymentMethodApi.update(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['payment-methods'] });
      qc.invalidateQueries({
        queryKey: queryKeys.paymentMethods.detail(variables.id),
      });
    },
  });
};

export const usePartialUpdatePaymentMethod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PaymentMethod> }) =>
      paymentMethodApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['payment-methods'] });
      qc.invalidateQueries({
        queryKey: queryKeys.paymentMethods.detail(variables.id),
      });
    },
  });
};

export const useDeletePaymentMethod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => paymentMethodApi.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['payment-methods'] });
      const previous = qc.getQueryData<PaymentMethod[]>(queryKeys.paymentMethods.all);
      if (previous) {
        qc.setQueryData(
          queryKeys.paymentMethods.all,
          previous.filter((pm) => pm.id !== id),
        );
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        qc.setQueryData(queryKeys.paymentMethods.all, context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

export const useSetDefaultPaymentMethod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      paymentMethodApi.setDefault(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

// ── Subscriptions (plans — read-only) ──

export const useSubscriptions = () =>
  useQuery({
    queryKey: queryKeys.subscriptions.all,
    queryFn: () => subscriptionApi.getAll().then((r) => {
      const data = r.data;
      return Array.isArray(data) ? data : (data as any).results ?? [];
    }),
  });

export const useSubscription = (id: number) =>
  useQuery({
    queryKey: queryKeys.subscriptions.detail(id),
    queryFn: () => subscriptionApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useMySubscription = () =>
  useQuery({
    queryKey: queryKeys.subscriptions.myStatus,
    queryFn: () => subscriptionApi.getMyStatus().then((r) => r.data),
  });

export const usePesapalInitiatePayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PesapalInitiateRequest) =>
      pesapalApi.initiate(data).then((r) => r.data),
    onSuccess: () => {
      // Ensure source-of-truth subscription status gets refreshed after provider return flow.
      qc.invalidateQueries({ queryKey: queryKeys.subscriptions.myStatus });
      qc.invalidateQueries({ queryKey: ['user-subscriptions'] });
    },
  });
};

export const usePesapalPaymentStatus = (paymentId?: string) =>
  useQuery({
    queryKey: ['pesapal', 'payment-status', paymentId],
    queryFn: () => pesapalApi.getStatus(paymentId as string).then((r) => r.data),
    enabled: !!paymentId,
    refetchOnWindowFocus: false,
  });

// ── User Subscriptions ──

export const useUserSubscriptions = (params?: UserSubscriptionParams) =>
  useQuery({
    queryKey: queryKeys.userSubscriptions.all(params),
    queryFn: () => userSubscriptionApi.getAll(params).then((r) => {
      const data = r.data;
      return Array.isArray(data) ? data : (data as any).results ?? [];
    }),
  });

export const useUserSubscription = (id: number) =>
  useQuery({
    queryKey: queryKeys.userSubscriptions.detail(id),
    queryFn: () => userSubscriptionApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateUserSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UserSubscriptionCreateRequest) =>
      userSubscriptionApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-subscriptions'] });
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useUpdateUserSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserSubscription> }) =>
      userSubscriptionApi.update(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['user-subscriptions'] });
      qc.invalidateQueries({
        queryKey: queryKeys.userSubscriptions.detail(variables.id),
      });
    },
  });
};

export const usePartialUpdateUserSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserSubscription> }) =>
      userSubscriptionApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['user-subscriptions'] });
      qc.invalidateQueries({
        queryKey: queryKeys.userSubscriptions.detail(variables.id),
      });
    },
  });
};

export const useDeleteUserSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userSubscriptionApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-subscriptions'] });
    },
  });
};

export const useCancelUserSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      userSubscriptionApi.cancel(id).then((r) => r.data),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['user-subscriptions'] });
      qc.invalidateQueries({
        queryKey: queryKeys.userSubscriptions.detail(id),
      });
    },
  });
};

export const useRenewUserSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      userSubscriptionApi.renew(id).then((r) => r.data),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['user-subscriptions'] });
      qc.invalidateQueries({
        queryKey: queryKeys.userSubscriptions.detail(id),
      });
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

// ── Reports ──

export const useReportTypes = () =>
  useQuery({
    queryKey: ['reports', 'types'],
    queryFn: () => reportsApi.getTypes().then((r) => r.data),
  });

export const useReports = (params?: ReportListParams) =>
  useQuery({
    queryKey: ['reports', 'list', params],
    queryFn: () => reportsApi.getAll(params).then((r) => {
      const data = r.data;
      return Array.isArray(data) ? data : (data as any).results ?? [];
    }),
  });

export const useCreateReport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof reportsApi.generate>[0]) =>
      reportsApi.generate(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports', 'list'] });
    },
  });
};
