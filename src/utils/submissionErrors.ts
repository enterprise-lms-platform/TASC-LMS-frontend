/**
 * submissionErrors.ts
 *
 * Transforms raw backend error strings into human-readable, contextual
 * messages for assignment submissions and grading.
 */

import { getErrorMessage } from './config';
import { genericMutationError } from './paymentErrors';

export function submissionError(error: unknown, action = 'submit assignment'): string {
  const raw = getErrorMessage(error);
  
  if (/already submitted|duplicate submission/i.test(raw)) {
    return 'You have already submitted an entry for this assignment. If allowed, please edit your existing submission.';
  }
  if (/past due date|deadline passed/i.test(raw)) {
    return 'This assignment is past its due date and can no longer accept submissions.';
  }
  if (/file size|too large/i.test(raw)) {
    return 'The attached file is too large. Please reduce the size and try again.';
  }
  return genericMutationError(error, action);
}

export function gradingError(error: unknown, action = 'submit grade'): string {
  const raw = getErrorMessage(error);

  if (/score.*exceed/i.test(raw) || /points.*exceed/i.test(raw)) {
    return 'The assigned score cannot be higher than the maximum points allowed for this assignment.';
  }
  if (/forbidden|permission/i.test(raw)) {
    return 'You do not have permission to grade this submission.';
  }
  return genericMutationError(error, action);
}
