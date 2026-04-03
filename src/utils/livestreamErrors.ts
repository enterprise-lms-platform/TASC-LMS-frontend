/**
 * livestreamErrors.ts
 *
 * Transforms raw backend error strings into human-readable, contextual
 * messages for livestream and virtual session operations.
 */

import { getErrorMessage } from './config';
import { genericMutationError } from './paymentErrors';

export function livestreamError(error: unknown, action = 'update livestream details'): string {
  const raw = getErrorMessage(error);

  if (/invalid.*url|invalid.*link/i.test(raw)) {
    return 'The meeting URL provided is invalid. Please ensure it is a valid Zoom, Teams, or Meet link.';
  }
  if (/past date|date.*in the past/i.test(raw)) {
    return 'The scheduled time cannot be in the past. Please select a future date and time.';
  }
  if (/forbidden|permission/i.test(raw)) {
    return 'You do not have permission to manage livestream links for this session.';
  }
  return genericMutationError(error, action);
}
