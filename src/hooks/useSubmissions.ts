import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  submissionApi,
  type SubmissionParams,
} from '../services/learning.services';
import { queryKeys } from './queryKeys';
import type {
  SubmissionCreateRequest,
  SubmissionUpdateRequest,
  GradeSubmissionRequest,
} from '../types/types';
import { submissionError, gradingError } from '../utils/submissionErrors';

/**
 * useSubmissions - Hook for submission list (instructor grading view)
 */
export const useSubmissions = (params?: SubmissionParams) =>
  useQuery({
    queryKey: queryKeys.submissions.all(params),
    queryFn: () => submissionApi.getAll(params).then((r) => r.data),
  });

/**
 * useSubmission - Hook for single submission details
 */
export const useSubmission = (id: number) =>
  useQuery({
    queryKey: queryKeys.submissions.detail(id),
    queryFn: () => submissionApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

/**
 * useCreateSubmission - Hook to create a new submission (learner)
 */
export const useCreateSubmission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SubmissionCreateRequest) =>
      submissionApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.submissions.all() });
    },
    onError: (error) => submissionError(error, 'create submission'),
  });
};

/**
 * useUpdateSubmission - Hook to update an existing submission (learner)
 */
export const useUpdateSubmission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubmissionUpdateRequest }) =>
      submissionApi.update(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.submissions.all() });
      qc.invalidateQueries({
        queryKey: queryKeys.submissions.detail(variables.id),
      });
    },
    onError: (error) => submissionError(error, 'update submission'),
  });
};

/**
 * useGradeSubmission - Hook to grade a submission (instructor)
 */
export const useGradeSubmission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GradeSubmissionRequest }) =>
      submissionApi.grade(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.submissions.all() });
      qc.invalidateQueries({
        queryKey: queryKeys.submissions.detail(variables.id),
      });
    },
    onError: (error) => gradingError(error, 'grade submission'),
  });
};

/**
 * useDeleteSubmission - Hook to delete a submission (usually drafts only)
 */
export const useDeleteSubmission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => submissionApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.submissions.all() });
    },
    onError: (error) => submissionError(error, 'delete submission'),
  });
};
