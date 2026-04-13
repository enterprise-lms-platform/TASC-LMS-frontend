import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { managerMembersApi, managerSettingsApi, managerBillingApi, managerActivityApi, type ManagerMembersParams } from '../services/organization.services';
import { courseApi } from '../services/catalogue.services';
import { enrollmentApi, certificateApi, sessionProgressApi } from '../services/learning.services';
import { notificationApi } from '../services/notifications.services';
import { reportsApi, type ReportType, type Report, type ReportListParams } from '../services/reports.services';
import { adminApi } from '../services/auth.services';
import type { InviteUserRequest, Organization } from '../types/types';
import type { ActivityResponse, ManagerBillingUsage } from '../services/organization.services';
import type { CourseListParams } from '../services/catalogue.services';
import type { EnrollmentListParams, CertificateListParams, SessionProgressListParams } from '../services/learning.services';
import type { PaginatedResponse, Notification } from '../types/types';
import { queryKeys } from './queryKeys';

export const useOrgAdminMembers = (params?: ManagerMembersParams) =>
  useQuery({
    queryKey: queryKeys.orgAdminMembers.all(params),
    queryFn: () => managerMembersApi.getAll(params).then((r) => r.data),
  });

export const useOrgAdminDashboardMembers = () =>
  useQuery({
    queryKey: queryKeys.orgAdminMembers.dashboard,
    queryFn: () => managerMembersApi.getAll({ page_size: 200 }).then((r) => r.data),
  });

export const useInviteMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<InviteUserRequest, 'role' | 'organization'>) =>
      adminApi.inviteUser({ ...data, role: 'learner' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['org-admin-members'] }),
  });
};

export const useBulkImportMembers = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => managerMembersApi.bulkImport(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['org-admin-members'] }),
  });
};

export const useOrgSettings = () =>
  useQuery<Organization>({
    queryKey: queryKeys.orgAdmin.settings,
    queryFn: () => managerSettingsApi.get().then((r) => r.data),
  });

export const useOrgBillingUsage = () =>
  useQuery<ManagerBillingUsage>({
    queryKey: queryKeys.orgAdmin.billingUsage,
    queryFn: () => managerBillingApi.getUsage().then((r) => r.data),
  });

export const useOrgActivity = (range: 'today' | '7days' | '30days' = '7days') =>
  useQuery<ActivityResponse>({
    queryKey: queryKeys.orgAdmin.activity(range),
    queryFn: () => managerActivityApi.getActivity(range).then((r) => r.data),
  });

export const useOrgCourses = (params?: CourseListParams) =>
  useQuery({
    queryKey: queryKeys.orgAdmin.courses(params),
    queryFn: () => courseApi.getAll(params ?? {}).then((r) => r.data),
  });

export const useOrgEnrollments = (params?: EnrollmentListParams) =>
  useQuery({
    queryKey: queryKeys.orgAdmin.enrollments(params),
    queryFn: () => enrollmentApi.getAll(params ?? {}).then((r) => r.data),
  });

export const useOrgCertificates = (params?: CertificateListParams) =>
  useQuery({
    queryKey: queryKeys.orgAdmin.certificates(params),
    queryFn: () => certificateApi.getAll(params ?? {}).then((r) => r.data),
  });

export const useOrgNotifications = (params?: { page?: number; page_size?: number }) =>
  useQuery<PaginatedResponse<Notification>>({
    queryKey: queryKeys.orgAdmin.notifications(params),
    queryFn: () => notificationApi.getAll(params ?? {}).then((r) => r.data),
  });

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orgAdmin.notifications({}) }),
  });
};

export const useUpdateOrgSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Organization>) => managerSettingsApi.update(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orgAdmin.settings }),
  });
};

export const useOrgSessionProgress = (params?: SessionProgressListParams) =>
  useQuery({
    queryKey: ['org-admin', 'session-progress', params],
    queryFn: () => sessionProgressApi.getAll(params ?? {}).then((r) => r.data),
  });

export const useEnrollMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ user, course }: { user: number; course: number }) => enrollmentApi.create({ user, course }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orgAdmin.enrollments({}) }),
  });
};

export const useBulkEnrollMembers = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, memberIds }: { courseId: number; memberIds: number[] }) => {
      const results = { enrolled: 0, failed: 0 };
for (const memberId of memberIds) {
      try {
        await enrollmentApi.create({ user: memberId, course: courseId });
        results.enrolled++;
      } catch {
        results.failed++;
      }
    }
    return results;
  },
  onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orgAdmin.enrollments({}) }),
  });
};

export const useOrgReportTypes = () =>
  useQuery<ReportType[]>({
    queryKey: ['org-admin', 'report-types'],
    queryFn: () => reportsApi.getTypes().then((r) => r.data),
  });

export const useOrgReports = (params?: ReportListParams) => {
  const qc = useQueryClient();
  const query = useQuery<PaginatedResponse<Report>>({
    queryKey: ['org-admin', 'reports', params],
    queryFn: () => reportsApi.getAll(params ?? { page_size: 20 }).then((r) => r.data),
  });
  const generate = useMutation({
    mutationFn: (reportType: string) => reportsApi.generate({ report_type: reportType }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['org-admin', 'reports'] }),
  });
  return { ...query, generate };
};
