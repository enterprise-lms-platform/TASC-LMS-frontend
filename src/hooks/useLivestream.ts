/**
 * useLivestream.ts — React Query hooks for the livestream API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  livestreamApi,
  livestreamAttendanceApi,
  type LivestreamListParams,
  type LivestreamSessionCreateRequest,
  type LivestreamActionRequest,
  type LivestreamAttendanceParams,
} from '../services/livestream.services';
import { queryKeys } from './queryKeys';

// ── Sessions ──

export const useLivestreamSessions = (params?: LivestreamListParams) =>
  useQuery({
    queryKey: queryKeys.livestreams.all(params),
    queryFn: () => livestreamApi.getAll(params).then((r) => r.data),
  });

export const useLivestreamSession = (id: string) =>
  useQuery({
    queryKey: queryKeys.livestreams.detail(id),
    queryFn: () => livestreamApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateLivestreamSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LivestreamSessionCreateRequest) =>
      livestreamApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['livestreams'] });
    },
  });
};

export const useUpdateLivestreamSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LivestreamSessionCreateRequest> }) =>
      livestreamApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['livestreams'] });
      qc.invalidateQueries({
        queryKey: queryKeys.livestreams.detail(variables.id),
      });
    },
  });
};

export const useDeleteLivestreamSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => livestreamApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['livestreams'] });
    },
  });
};

export const useLivestreamAction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LivestreamActionRequest }) =>
      livestreamApi.action(id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['livestreams'] });
    },
  });
};

// ── Attendance ──

export const useLivestreamAttendance = (params?: LivestreamAttendanceParams) =>
  useQuery({
    queryKey: queryKeys.livestreamAttendance.all(params),
    queryFn: () => livestreamAttendanceApi.getAll(params).then((r) => r.data),
    enabled: !!params?.session,
  });
