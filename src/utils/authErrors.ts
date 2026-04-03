/**
 * authErrors.ts
 *
 * Transforms raw backend error strings into human-readable, contextual
 * messages for authentication, profiles, and organizations.
 */

import { getErrorMessage } from './config';
import { genericMutationError } from './paymentErrors';

export function authError(error: unknown, action = 'complete authentication'): string {
  const raw = getErrorMessage(error);
  
  if (/No active account found with the given credentials/i.test(raw)) {
    return 'Invalid email or password. Please try again.';
  }
  if (/password.*weak|password.*common/i.test(raw)) {
    return 'The password you entered is too weak or common. Please choose a stronger one.';
  }
  if (/user with this email already exists/i.test(raw)) {
    return 'An account with this email address already exists. Please log in instead.';
  }
  if (/token.*expired|invalid.*token/i.test(raw)) {
    return 'Your login session or reset link has expired. Please try again.';
  }
  return genericMutationError(error, action);
}

export function profileError(error: unknown, action = 'update profile'): string {
  const raw = getErrorMessage(error);
  return genericMutationError(error, action);
}

export function orgError(error: unknown, action = 'manage organization'): string {
  const raw = getErrorMessage(error);
  
  if (/only.*admin|forbidden|permission/i.test(raw)) {
    return 'You do not have permission to modify organization settings.';
  }
  return genericMutationError(error, action);
}
