import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  auditLogApi,
  superadminReviewApi, superadminDemoRequestApi,
  systemSettingsApi, smtpApi,
  securityPolicyApi, terminateSessionsApi,
  superadminAssessmentsApi,
  type ReviewStatus,
} from '../services/superadmin.services';
import { queryKeys } from './queryKeys';
import type { AuditLogFilters } from '../types/types';

export const useAuditLogs = (filters?: AuditLogFilters) =>
  useQuery({
    queryKey: queryKeys.auditLogs.all(filters),
    queryFn: () => auditLogApi.getAll(filters).then((r) => r.data),
  });

// ── Review moderation ─────────────────────────────────────────────────────────

export const useSuperadminReviews = (params?: { status?: ReviewStatus; page?: number; page_size?: number }) =>
  useQuery({
    queryKey: queryKeys.superadminReviews.all(params),
    queryFn: () => superadminReviewApi.getAll(params).then((r) => r.data),
  });

export const useApproveReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => superadminReviewApi.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['superadmin-reviews'] }),
  });
};

export const useRejectReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => superadminReviewApi.reject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['superadmin-reviews'] }),
  });
};

export const useFeatureReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_featured }: { id: number; is_featured: boolean }) =>
      superadminReviewApi.feature(id, is_featured),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['superadmin-reviews'] }),
  });
};

// ── Demo requests ─────────────────────────────────────────────────────────────

export const useSuperadminDemoRequests = (params?: { status?: 'new' | 'contacted' | 'closed' }) =>
  useQuery({
    queryKey: queryKeys.superadminDemoRequests.all(params),
    queryFn: () => superadminDemoRequestApi.getAll(params).then((r) => r.data),
  });

export const useUpdateDemoRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status?: 'new' | 'contacted' | 'closed'; notes?: string } }) =>
      superadminDemoRequestApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['superadmin-demo-requests'] }),
  });
};

// ── System settings ───────────────────────────────────────────────────────────

export const useSystemSettings = () =>
  useQuery({
    queryKey: queryKeys.systemSettings.current,
    queryFn: () => systemSettingsApi.get().then((r) => r.data),
  });

export const useSaveSystemSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: systemSettingsApi.patch,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.systemSettings.current }),
  });
};

export const useSaveSmtp = () =>
  useMutation({ mutationFn: smtpApi.patch });

export const useSendTestEmail = () =>
  useMutation({ mutationFn: (recipient?: string) => smtpApi.testEmail(recipient) });

// ── Security policy ───────────────────────────────────────────────────────────

export const useSecurityPolicy = () =>
  useQuery({
    queryKey: queryKeys.securityPolicy.current,
    queryFn: () => securityPolicyApi.get().then((r) => r.data),
  });

export const useSaveSecurityPolicy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: securityPolicyApi.patch,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.securityPolicy.current }),
  });
};

export const useTerminateSessions = () =>
  useMutation({ mutationFn: terminateSessionsApi.terminate });

// ── Assessments ───────────────────────────────────────────────────────────────

export const useSuperadminAssessments = (params?: { type?: 'quiz' | 'assignment'; page?: number; page_size?: number }) =>
  useQuery({
    queryKey: queryKeys.superadminAssessments.all(params),
    queryFn: () => superadminAssessmentsApi.getAll(params).then((r) => r.data),
  });

export const useSuperadminAssessmentStats = () =>
  useQuery({
    queryKey: queryKeys.superadminAssessments.stats,
    queryFn: () => superadminAssessmentsApi.getStats().then((r) => r.data),
  });
