/**
 * learningErrors.ts
 *
 * Transforms raw backend error strings into human-readable, contextual
 * messages for learning operations (enrollments, progress, certificates, discussions).
 */

import { getErrorMessage } from './config';
import { genericMutationError } from './paymentErrors';

export function enrollmentError(error: unknown, action = 'update enrollment'): string {
  const raw = getErrorMessage(error);
  
  if (/User is already enrolled/i.test(raw)) {
    return 'You are already enrolled in this course.';
  }
  if (/Course is not available/i.test(raw)) {
    return 'This course is currently unavailable for enrollment.';
  }
  return genericMutationError(error, action);
}

export function progressError(error: unknown, action = 'update progress'): string {
  return genericMutationError(error, action);
}

export function certificateError(error: unknown): string {
  const raw = getErrorMessage(error);
  
  if (/No certificates found/i.test(raw) || /Certificate not found/i.test(raw)) {
    return 'The requested certificate could not be found.';
  }
  return genericMutationError(error, 'generate your certificate');
}

export function discussionError(error: unknown, action = 'update this discussion'): string {
  const raw = getErrorMessage(error);
  
  if (/Only instructors and admins can pin/i.test(raw)) {
    return 'You do not have permission to pin discussions. Only instructors and admins can do this.';
  }
  if (/Only instructors and admins can lock/i.test(raw)) {
    return 'You do not have permission to lock discussions. Only instructors and admins can do this.';
  }
  if (/forbidden|permission/i.test(raw)) {
    return `You do not have permission to ${action}.`;
  }
  return genericMutationError(error, action);
}
