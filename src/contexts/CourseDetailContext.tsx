import { createContext, useContext } from 'react';
import type { PublicCourseDetail } from '../types/types';

export const CourseDetailContext = createContext<PublicCourseDetail | null>(null);

export const useCourseDetail = () => useContext(CourseDetailContext);
