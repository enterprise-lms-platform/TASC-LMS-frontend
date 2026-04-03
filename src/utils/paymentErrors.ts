/**
 * paymentErrors.ts
 *
 * Transforms raw backend error strings into human-readable, contextual
 * messages for payment, subscription, and invoice operations.
 *
 * Strategy:
 *  1. Extract the raw message from the Axios error via getErrorMessage()
 *  2. Match against known backend error strings (substring match, case-insensitive)
 *  3. Inject entity context (status, name, number) already available from the
 *     TanStack Query cache or from mutation variables
 *  4. Fall through to the raw message if nothing matches — never show a blank error
 */

import { getErrorMessage } from './config';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Capitalise the first letter of a string. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Format a raw status string for display: "pending_review" → "Pending Review" */
export const fmtStatus = (status?: string | null): string => {
  if (!status) return 'Unknown';
  return status
    .split(/[_\s]/)
    .map(cap)
    .join(' ');
};

// ─── Subscription errors ─────────────────────────────────────────────────────

export interface SubscriptionContext {
  /** Human-readable plan name, e.g. "Professional Plan" */
  planName?: string | null;
  /** Current subscription status, e.g. "active", "cancelled", "expired" */
  status?: string | null;
}

/**
 * Maps a backend error from useCancelUserSubscription into a rich message.
 */
export function cancelSubscriptionError(error: unknown, ctx?: SubscriptionContext): string {
  const raw = getErrorMessage(error);
  const status = fmtStatus(ctx?.status);
  const plan = ctx?.planName ?? 'this subscription';

  if (/only active subscriptions can be cancelled/i.test(raw)) {
    return `${cap(plan)} is currently ${status} and cannot be cancelled. Only Active subscriptions can be cancelled.`;
  }
  if (/already.*cancelled/i.test(raw) || /subscription.*not.*active/i.test(raw)) {
    return `${cap(plan)} has already been cancelled.`;
  }
  if (/not found/i.test(raw)) {
    return 'Subscription not found. It may have already been removed.';
  }
  if (/forbidden|permission/i.test(raw)) {
    return 'You do not have permission to cancel this subscription.';
  }
  return raw;
}

/**
 * Maps a backend error from useRenewUserSubscription into a rich message.
 */
export function renewSubscriptionError(error: unknown, ctx?: SubscriptionContext): string {
  const raw = getErrorMessage(error);
  const status = fmtStatus(ctx?.status);
  const plan = ctx?.planName ?? 'this subscription';

  if (/only cancelled or expired subscriptions can be renewed/i.test(raw)) {
    return `${cap(plan)} is currently ${status} and cannot be renewed. Only Cancelled or Expired subscriptions can be renewed.`;
  }
  if (/already.*active/i.test(raw)) {
    return `${cap(plan)} is already Active — no renewal is needed.`;
  }
  if (/not found/i.test(raw)) {
    return 'Subscription not found. It may have already been removed.';
  }
  return raw;
}

/**
 * Maps a backend error from duplicate / conflict subscription creation.
 */
export function createSubscriptionError(error: unknown, ctx?: SubscriptionContext): string {
  const raw = getErrorMessage(error);
  const plan = ctx?.planName ?? 'a subscription';

  if (/active subscription already exists/i.test(raw)) {
    return `You already have an active ${plan}. Go to Subscription Management to manage it.`;
  }
  if (/forbidden|permission/i.test(raw)) {
    return 'You do not have permission to create a subscription.';
  }
  return raw;
}

/**
 * Maps errors from usePesapalInitiateSubscription / usePesapalInitiatePayment.
 */
export function initiatePaymentError(error: unknown, ctx?: { planName?: string | null; currency?: string }): string {
  const raw = getErrorMessage(error);
  const plan = ctx?.planName ?? 'the selected plan';

  if (/active subscription already exists/i.test(raw)) {
    return `You already have an active subscription for ${plan}. Go to Subscription Management to manage it.`;
  }
  if (/no subscription.*found|subscription.*not found/i.test(raw)) {
    return `Could not find ${plan}. Please go back and select a plan.`;
  }
  if (/pesapal.*failed|order.*submission.*failed/i.test(raw)) {
    return 'The payment gateway could not process your request. Please try again or contact support.';
  }
  if (/network|ECONNREFUSED|timeout/i.test(raw)) {
    return 'Could not reach the payment gateway. Check your connection and try again.';
  }
  if (/500|server error/i.test(raw)) {
    return 'A server error occurred while initiating payment. Please try again in a moment.';
  }
  return raw;
}

// ─── Invoice errors ──────────────────────────────────────────────────────────

export interface InvoiceContext {
  /** e.g. "INV-2024-001" */
  invoiceNumber?: string | null;
  /** e.g. "paid", "pending", "overdue", "draft", "cancelled" */
  status?: string | null;
}

/**
 * Maps a backend error from usePayInvoice into a rich message.
 */
export function payInvoiceError(error: unknown, ctx?: InvoiceContext): string {
  const raw = getErrorMessage(error);
  const ref = ctx?.invoiceNumber ? `Invoice ${ctx.invoiceNumber}` : 'This invoice';
  const status = fmtStatus(ctx?.status);

  if (/invoice can only be paid if status is pending/i.test(raw)) {
    return `${ref} has status "${status}" and cannot be paid. Only Pending invoices can be paid.`;
  }
  if (/not found/i.test(raw)) {
    return `${ref} was not found. It may have been deleted.`;
  }
  if (/forbidden|permission/i.test(raw)) {
    return `You do not have permission to pay ${ref.toLowerCase()}.`;
  }
  return raw;
}

/**
 * Maps a backend error from useCreateInvoice.
 */
export function createInvoiceError(error: unknown): string {
  const raw = getErrorMessage(error);

  if (/only finance.*can create/i.test(raw)) {
    return 'Only Finance team members can create invoices. Contact your Finance team to raise an invoice.';
  }
  return raw;
}

/**
 * Maps a backend error from useUpdateInvoice / usePartialUpdateInvoice.
 */
export function updateInvoiceError(error: unknown, ctx?: InvoiceContext): string {
  const raw = getErrorMessage(error);
  const ref = ctx?.invoiceNumber ? `Invoice ${ctx.invoiceNumber}` : 'This invoice';
  const status = fmtStatus(ctx?.status);

  if (/only finance.*can update/i.test(raw)) {
    return 'Only Finance team members can update invoices.';
  }
  if (/cannot.*edit|immutable|read.?only/i.test(raw)) {
    return `${ref} has status "${status}" and can no longer be edited.`;
  }
  return raw;
}

// ─── Payment method errors ───────────────────────────────────────────────────

export function addPaymentMethodError(error: unknown, ctx?: { methodType?: string }): string {
  const raw = getErrorMessage(error);
  const method = ctx?.methodType ?? 'payment method';

  if (/already.*exists|duplicate/i.test(raw)) {
    return `A ${method} with these details already exists on your account.`;
  }
  if (/invalid.*phone|phone.*format/i.test(raw)) {
    return 'The phone number you entered is invalid. Use the format +254 7XX XXX XXX.';
  }
  if (/invalid.*card|card.*number/i.test(raw)) {
    return 'The card number you entered is invalid. Please check and try again.';
  }
  return raw;
}

export function setDefaultPaymentMethodError(error: unknown): string {
  const raw = getErrorMessage(error);

  if (/not found/i.test(raw)) {
    return 'This payment method was not found. It may have been removed.';
  }
  if (/forbidden|permission/i.test(raw)) {
    return 'You do not have permission to change the default payment method.';
  }
  return raw;
}

// ─── Generic network/server fallbacks ────────────────────────────────────────

/**
 * A catch-all for any mutation that doesn't have a specific mapper yet.
 * Provides nicer messages for common HTTP-level failures.
 */
export function genericMutationError(error: unknown, action = 'complete this action'): string {
  const raw = getErrorMessage(error);

  // Already a user-friendly message from our extractor — return as-is unless
  // it's one of the raw DRF defaults we want to improve.
  if (/request failed with status 0/i.test(raw) || /network error/i.test(raw)) {
    return `Could not reach the server. Check your connection and try again.`;
  }
  if (/request failed with status 503/i.test(raw)) {
    return 'The server is temporarily unavailable. Please try again in a moment.';
  }
  if (/request failed with status 429/i.test(raw)) {
    return 'Too many requests. Please wait a moment before trying again.';
  }
  if (!raw || raw === 'An unexpected error occurred. Please try again.') {
    return `Failed to ${action}. Please try again or contact support if the problem persists.`;
  }
  return raw;
}
