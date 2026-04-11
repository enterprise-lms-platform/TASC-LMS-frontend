import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { managerMembersApi, type ManagerMembersParams } from '../services/organization.services';
import { adminApi } from '../services/auth.services';
import type { InviteUserRequest } from '../types/types';
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
