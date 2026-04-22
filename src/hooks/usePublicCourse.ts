import { useQuery } from '@tanstack/react-query';
import { publicCourseApi } from '../services/public.services';
import { courseReviewApi } from '../services/catalogue.services';
import { queryKeys } from './queryKeys';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz';
  isPreview?: boolean;
}

export interface ModuleWithLessons {
  id: string;
  title: string;
  lessons: Lesson[];
  totalDuration: string;
}

export interface CourseReview {
  id: string;
  reviewerName: string;
  reviewerInitials: string;
  reviewerAvatar?: string;
  rating: number;
  date: string;
  content: string;
}

export interface RatingDistribution {
  stars: number;
  percentage: number;
}

export const usePublicCourse = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.public.courses.detail(slug),
    queryFn: () => publicCourseApi.getBySlug(slug).then((r) => r.data),
    enabled: !!slug,
  });
};

export const useCourseReviews = (courseId: number) => {
  return useQuery({
    queryKey: ['course-reviews', 'summary', courseId],
    queryFn: () => courseReviewApi.getSummary(courseId).then((r) => r.data),
    enabled: !!courseId && courseId > 0,
  });
};
