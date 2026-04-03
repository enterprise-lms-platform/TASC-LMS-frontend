/**
 * catalogueErrors.ts
 *
 * Transforms raw backend error strings into human-readable, contextual
 * messages for catalogue operations (courses, modules, sessions, quizzes, assignments).
 */

import { getErrorMessage } from './config';
import { genericMutationError } from './paymentErrors';

export interface CourseContext {
  courseTitle?: string | null;
}

export interface ModuleContext {
  moduleTitle?: string | null;
}

export interface SessionContext {
  sessionTitle?: string | null;
}

export function courseError(error: unknown, action = 'update this course', ctx?: CourseContext): string {
  const raw = getErrorMessage(error);
  const title = ctx?.courseTitle ? `"${ctx.courseTitle}"` : 'this course';

  if (/Only LMS Manager or TASC Admin can delete courses/i.test(raw)) {
    return `You do not have permission to delete ${title}. Only LMS Managers or TASC Admins can delete courses.`;
  }
  if (/A reason for rejection is required/i.test(raw)) {
    return 'Please provide a reason for rejecting this course.';
  }
  if (/forbidden|permission/i.test(raw)) {
    return `You do not have permission to ${action}.`;
  }
  return genericMutationError(error, action);
}

export function moduleError(error: unknown, action = 'update this module', ctx?: ModuleContext): string {
  const raw = getErrorMessage(error);
  
  if (/You can only create modules in your own courses/i.test(raw)) {
    return 'You cannot add modules to a course you do not own.';
  }
  if (/You can only reorder modules in your own courses/i.test(raw)) {
    return 'You do not have permission to reorder modules in this course.';
  }
  if (/do not belong to the specified course/i.test(raw)) {
    return 'One or more modules do not belong to this course.';
  }
  if (/forbidden|permission/i.test(raw)) {
    return `You do not have permission to ${action}.`;
  }
  return genericMutationError(error, action);
}

export function sessionError(error: unknown, action = 'update this session', ctx?: SessionContext): string {
  const raw = getErrorMessage(error);
  
  if (/You can only create sessions in your own courses/i.test(raw)) {
    return 'You cannot add sessions to a course you do not own.';
  }
  if (/Not allowed to access this session asset/i.test(raw)) {
    return 'You do not have permission to access files for this session.';
  }
  if (/forbidden|permission/i.test(raw)) {
    return `You do not have permission to ${action}.`;
  }
  return genericMutationError(error, action);
}

export function quizError(error: unknown, action = 'update this quiz'): string {
  const raw = getErrorMessage(error);

  if (/points must be/i.test(raw)) {
    return 'Question points must be 0 or greater.';
  }
  if (/Quiz not found/i.test(raw)) {
    return 'Could not find a quiz for this session. It may not have been created yet.';
  }
  return genericMutationError(error, action);
}

export function assignmentError(error: unknown, action = 'update this assignment'): string {
  const raw = getErrorMessage(error);

  if (/Assignment not found/i.test(raw)) {
    return 'Could not find an assignment for this session. It may not have been created yet.';
  }
  return genericMutationError(error, action);
}

export function questionBankError(error: unknown, action = 'update this question'): string {
  const raw = getErrorMessage(error);
  
  return genericMutationError(error, action);
}
