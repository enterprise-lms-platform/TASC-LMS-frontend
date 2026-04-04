/**
 * Tests: getErrorMessage utility (src/utils/config.ts)
 * No DOM rendering needed — pure logic.
 */

import { describe, it, expect } from 'vitest';
import axios from 'axios';
import { getErrorMessage } from '../utils/config';

// Helper to fabricate an AxiosError with a given response
function makeAxiosError(status: number, data: unknown) {
  const err = new axios.AxiosError('Request failed', 'ERR_BAD_RESPONSE');
  // @ts-expect-error — we're crafting a partial response for testing
  err.response = { status, data };
  return err;
}

describe('getErrorMessage', () => {
  it('returns fallback for non-Error values', () => {
    expect(getErrorMessage(null)).toBe('An unexpected error occurred. Please try again.');
    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred. Please try again.');
    expect(getErrorMessage(42)).toBe('An unexpected error occurred. Please try again.');
  });

  it('returns custom fallback when provided', () => {
    expect(getErrorMessage(null, 'Custom fallback')).toBe('Custom fallback');
  });

  it('extracts .detail from AxiosError response data', () => {
    const err = makeAxiosError(400, { detail: 'Invalid credentials.' });
    expect(getErrorMessage(err)).toBe('Invalid credentials.');
  });

  it('extracts .non_field_errors from AxiosError response data', () => {
    const err = makeAxiosError(400, { non_field_errors: ['Passwords do not match.'] });
    expect(getErrorMessage(err)).toBe('Passwords do not match.');
  });

  it('joins field validation errors', () => {
    const err = makeAxiosError(400, { email: ['Already in use.'], username: ['Too short.'] });
    const msg = getErrorMessage(err);
    expect(msg).toContain('email: Already in use.');
    expect(msg).toContain('username: Too short.');
  });

  it('returns string data directly', () => {
    const err = makeAxiosError(400, 'Plain string error');
    expect(getErrorMessage(err)).toBe('Plain string error');
  });

  it('returns status-based message when data is an HTML page', () => {
    const err = makeAxiosError(500, '<html>...</html>');
    expect(getErrorMessage(err)).toBe('Server error (500). Please try again later or contact support.');
  });

  it('returns status-based fallback when data is empty', () => {
    const err = makeAxiosError(403, null);
    expect(getErrorMessage(err)).toBe('Request failed with status 403. Please try again.');
  });

  it('returns error.message for plain Error instances', () => {
    expect(getErrorMessage(new Error('Network error'))).toBe('Network error');
  });
});
