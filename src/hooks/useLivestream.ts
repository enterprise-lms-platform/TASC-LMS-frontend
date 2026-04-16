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
  type LivestreamAttendance,
} from '../services/livestream.services';
import { livestreamError } from '../utils/livestreamErrors';
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
    onError: (error) => livestreamError(error, 'update session'),
  });
};

export const useDeleteLivestreamSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => livestreamApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['livestreams'] });
    },
    onError: (error) => livestreamError(error, 'delete session'),
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

export const useCheckInAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      livestreamAttendanceApi.checkIn(sessionId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['livestreams'] });
      qc.invalidateQueries({ queryKey: queryKeys.livestreamAttendance.all() });
    },
  });
};

export const useUpdateAttendanceStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LivestreamAttendance['status'] }) =>
      livestreamAttendanceApi.updateStatus(id, status).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.livestreamAttendance.all() });
    },
  });
};

export const useUpdateRecordingUrl = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, recording_url }: { id: string; recording_url: string }) =>
      livestreamApi.updateRecordingUrl(id, recording_url).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.livestreams.detail(variables.id) });
      qc.invalidateQueries({ queryKey: ['livestreams'] });
    },
  });
};
