//useCatalogue.ts custom hook for all catalogue related queries and mutations (categories, tags, courses, sessions)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  categoryApi,
  tagApi,
  courseApi,
  moduleApi,
  sessionApi,
  courseApprovalApi,
  questionCategoryApi,
  bankQuestionApi,
  type CourseListParams,
  type ModuleListParams,
  type SessionListParams,
  type ApprovalListParams,
  type QuestionCategoryCreatePayload,
  type BankQuestionCreatePayload,
} from '../services/catalogue.services';
import { queryKeys } from './queryKeys';
import type {
  AssignmentConfigCreateUpdate,
  CategoryCreateRequest,
  CourseCreateRequest,
  QuizSettings,
  ModuleCreateRequest,
  SessionCreateRequest,
  CourseList,
  Module,
  Session,
  PaginatedResponse,
  CourseApprovalActionRequest,
  BankQuestionListParams,
} from '../types/types';

// ── Categories ──

export const useCategories = (params?: { parent?: number }) =>
  useQuery({
    queryKey: queryKeys.categories.all(params),
    queryFn: () => categoryApi.getAll(params).then((r) => {
      const data = r.data;
      // Backend returns paginated { count, next, previous, results }
      if (Array.isArray(data)) {
        return {
          count: data.length,
          next: null,
          previous: null,
          results: data,
        };
      }
      return data;
    }),
  });

export const useCategory = (id: number) =>
  useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoryApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryCreateRequest) =>
      categoryApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoryCreateRequest> }) =>
      categoryApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({
        queryKey: queryKeys.categories.detail(variables.id),
      });
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoryApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// ── Tags ──

export const useTags = () =>
  useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: () => tagApi.getAll().then((r) => {
      const data = r.data;
      return Array.isArray(data) ? data : (data as any).results ?? [];
    }),
  });

export const useTag = (id: number) =>
  useQuery({
    queryKey: queryKeys.tags.detail(id),
    queryFn: () => tagApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

// ── Courses ──

export const useCourses = (params?: CourseListParams) =>
  useQuery({
    queryKey: queryKeys.courses.all(params),
    queryFn: () => courseApi.getAll(params).then((r) => r.data),
  });

export const useCourse = (id: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => courseApi.getById(id).then((r) => r.data),
    enabled: options?.enabled ?? !!id,
  });

export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseCreateRequest) =>
      courseApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CourseCreateRequest }) =>
      courseApi.update(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({
        queryKey: queryKeys.courses.detail(variables.id),
      });
    },
  });
};

export const usePartialUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CourseCreateRequest> }) =>
      courseApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({
        queryKey: queryKeys.courses.detail(variables.id),
      });
    },
  });
};

export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => courseApi.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['courses'] });

      const allQueries = qc.getQueriesData<PaginatedResponse<CourseList>>({
        queryKey: ['courses'],
        exact: false,
      });

      allQueries.forEach(([key, data]) => {
        if (data?.results) {
          qc.setQueryData(key, {
            ...data,
            results: data.results.filter((c) => c.id !== id),
            count: data.count - 1,
          });
        }
      });

      return { allQueries };
    },
    onError: (_err, _id, context) => {
      context?.allQueries.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// ── Modules ──

export const useModules = (params?: ModuleListParams) =>
  useQuery({
    queryKey: queryKeys.modules.all(params),
    queryFn: () => moduleApi.getAll(params).then((r) => r.data.results),
    enabled: !!params?.course,
  });

export const useCreateModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ModuleCreateRequest) =>
      moduleApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['modules'] });
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const usePartialUpdateModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Module> }) =>
      moduleApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['modules'] });
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({
        queryKey: queryKeys.modules.detail(variables.id),
      });
    },
  });
};

export const useDeleteModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => moduleApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['modules'] });
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// ── Sessions ──

export const useSessions = (params?: SessionListParams) =>
  useQuery({
    queryKey: queryKeys.sessions.all(params),
    queryFn: () => sessionApi.getAll(params).then((r) => r.data.results),
  });

export const useSession = (id: number) =>
  useQuery({
    queryKey: queryKeys.sessions.detail(id),
    queryFn: () => sessionApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SessionCreateRequest) =>
      sessionApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sessions'] });
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useUpdateSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SessionCreateRequest }) =>
      sessionApi.update(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['sessions'] });
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({
        queryKey: queryKeys.sessions.detail(variables.id),
      });
    },
  });
};

export const usePartialUpdateSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SessionCreateRequest> }) =>
      sessionApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['sessions'] });
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({
        queryKey: queryKeys.sessions.detail(variables.id),
      });
    },
  });
};

export const useDeleteSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sessionApi.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['sessions'] });
      const allQueries = qc.getQueriesData<Session[]>({
        queryKey: ['sessions'],
        exact: false,
      });
      allQueries.forEach(([key, data]) => {
        if (Array.isArray(data)) {
          qc.setQueryData(key, data.filter((s) => s.id !== id));
        }
      });
      return { allQueries };
    },
    onError: (_err, _id, context) => {
      context?.allQueries.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['sessions'] });
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// ── Course Approval Requests ──

export const useApprovalRequests = (params?: ApprovalListParams) =>
  useQuery({
    queryKey: queryKeys.approvalRequests.all(params),
    queryFn: () => courseApprovalApi.getAll(params).then((r) => r.data),
  });

export const useApprovalRequest = (id: number) =>
  useQuery({
    queryKey: queryKeys.approvalRequests.detail(id),
    queryFn: () => courseApprovalApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useSubmitCourseForApproval = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId: number) =>
      courseApi.submitForApproval(courseId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({ queryKey: ['approval-requests'] });
    },
  });
};

export const useRequestCourseDeletion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId: number) =>
      courseApi.requestDeletion(courseId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({ queryKey: ['approval-requests'] });
    },
  });
};

export const useApproveCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: CourseApprovalActionRequest }) =>
      courseApprovalApi.approve(id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({ queryKey: ['approval-requests'] });
    },
  });
};

export const useRejectCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CourseApprovalActionRequest }) =>
      courseApprovalApi.reject(id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({ queryKey: ['approval-requests'] });
    },
  });
};

// ── Quiz (session_type='quiz') ──

export const useQuizDetail = (sessionId: number | null | undefined) =>
  useQuery({
    queryKey: queryKeys.quiz.detail(sessionId ?? 0),
    queryFn: () => sessionApi.getQuiz(sessionId!).then((r) => r.data),
    enabled: !!sessionId && sessionId > 0,
  });

export const usePatchQuiz = (sessionId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { settings: QuizSettings }) =>
      sessionApi.patchQuiz(sessionId, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.quiz.detail(sessionId) });
    },
  });
};

export const usePutQuizQuestions = (sessionId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      questions: Array<{
        id?: number;
        order?: number;
        question_type: string;
        question_text: string;
        points?: number;
        answer_payload?: Record<string, unknown>;
      }>;
    }) => sessionApi.putQuizQuestions(sessionId, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.quiz.detail(sessionId) });
    },
  });
};

// ── Assignment config (session_type='assignment') ──

export const useAssignmentConfig = (sessionId: number | null | undefined) =>
  useQuery({
    queryKey: queryKeys.assignment.detail(sessionId ?? 0),
    queryFn: () => sessionApi.getAssignment(sessionId!).then((r) => r.data),
    enabled: !!sessionId && sessionId > 0,
  });

export const usePutAssignmentConfig = (sessionId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignmentConfigCreateUpdate) =>
      sessionApi.putAssignment(sessionId, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.assignment.detail(sessionId) });
      qc.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) });
    },
  });
};

export const usePatchAssignmentConfig = (sessionId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AssignmentConfigCreateUpdate>) =>
      sessionApi.patchAssignment(sessionId, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.assignment.detail(sessionId) });
      qc.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) });
    },
  });
};

// ── Question Bank (instructor-owned) ──

export const useQuestionCategories = (params?: { page?: number; page_size?: number }) =>
  useQuery({
    queryKey: queryKeys.questionCategories.all(params),
    queryFn: () =>
      questionCategoryApi.list(params).then((r) => r.data.results ?? r.data),
  });

export const useCreateQuestionCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: QuestionCategoryCreatePayload) =>
      questionCategoryApi.create(payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['question-categories'] });
    },
  });
};

export const usePatchQuestionCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<QuestionCategoryCreatePayload>;
    }) => questionCategoryApi.patch(id, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['question-categories'] });
    },
  });
};

export const useDeleteQuestionCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => questionCategoryApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['question-categories'] });
      qc.invalidateQueries({ queryKey: ['bank-questions'] });
    },
  });
};

export const useBankQuestions = (params?: BankQuestionListParams) =>
  useQuery({
    queryKey: queryKeys.bankQuestions.list(params),
    queryFn: () => bankQuestionApi.list(params).then((r) => {
      const data = r.data;
      return Array.isArray(data) ? data : (data as any).results ?? [];
    }),
  });

export const useBankQuestion = (id: number | null | undefined) =>
  useQuery({
    queryKey: queryKeys.bankQuestions.detail(id ?? 0),
    queryFn: () => bankQuestionApi.get(id!).then((r) => r.data),
    enabled: !!id && id > 0,
  });

export const useCreateBankQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BankQuestionCreatePayload) =>
      bankQuestionApi.create(payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bank-questions'] });
    },
  });
};

export const usePatchBankQuestion = (id?: number | null) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<BankQuestionCreatePayload>) =>
      bankQuestionApi.patch(id!, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bank-questions'] });
      if (id) {
        qc.invalidateQueries({ queryKey: queryKeys.bankQuestions.detail(id) });
      }
    },
  });
};

export const useDeleteBankQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bankQuestionApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bank-questions'] });
    },
  });
};

export interface AddQuestionsFromBankVariables {
  sessionId: number;
  bank_question_ids: number[];
}

export const useAddQuestionsFromBank = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, bank_question_ids }: AddQuestionsFromBankVariables) =>
      sessionApi.addQuestionsFromBank(sessionId, { bank_question_ids }).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.quiz.detail(variables.sessionId) });
      qc.invalidateQueries({ queryKey: ['bank-questions'] });
    },
  });
};
