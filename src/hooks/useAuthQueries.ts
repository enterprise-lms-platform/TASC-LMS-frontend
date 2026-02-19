/**
 * TanStack Query hooks for authentication.
 * These wrap the existing auth services with proper caching,
 * loading states, and error handling.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, adminApi } from '../services/auth.services';
import { setTokens, clearTokens, getAccessToken } from '../utils/config';
import type {
  LoginRequest,
  VerifyOtpRequest,
  RegisterRequest,
  ChangePasswordRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  SetPasswordRequest,
  ProfileUpdateRequest,
  InviteUserRequest,
  UserMe,
} from '../types/types';

// ─── Query Keys ──────────────────────────────────────────────
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  googleStatus: () => [...authKeys.all, 'google-status'] as const,
};

// ─── Queries ─────────────────────────────────────────────────

/** Fetch the current authenticated user. Only runs when a token exists. */
export const useCurrentUser = () =>
  useQuery<UserMe>({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const { data } = await authApi.getCurrentUser();
      return data;
    },
    enabled: !!getAccessToken(),
  });

/** Google OAuth link status (only when authenticated). */
export const useGoogleStatus = () =>
  useQuery({
    queryKey: authKeys.googleStatus(),
    queryFn: async () => {
      const { data } = await authApi.getGoogleStatus();
      return data;
    },
    enabled: !!getAccessToken(),
  });

// ─── Mutations ───────────────────────────────────────────────

/** Login step 1 — returns MFA challenge (no tokens yet). */
export const useLogin = () =>
  useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const { data } = await authApi.login(credentials);
      return data;
    },
  });

/** Login step 2 — verify OTP, stores tokens and primes the user cache. */
export const useVerifyOtp = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: VerifyOtpRequest) => {
      const { data } = await authApi.verifyOtp(payload);
      return data;
    },
    onSuccess: (data) => {
      setTokens(data.access, data.refresh);
      if (data.user) {
        qc.setQueryData(authKeys.me(), data.user);
      }
    },
  });
};

/** Resend login OTP. */
export const useResendLoginOtp = () =>
  useMutation({
    mutationFn: async (challengeId: string) => {
      const { data } = await authApi.resendOtp(challengeId);
      return data;
    },
  });

/** Register — does NOT log the user in (email verification required). */
export const useRegister = () =>
  useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      const { data } = await authApi.register(payload);
      return data;
    },
  });

/** Logout — blacklists refresh token and clears local state. */
export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      await authApi.logout(refreshToken);
    },
    onSettled: () => {
      clearTokens();
      qc.setQueryData(authKeys.me(), null);
      qc.removeQueries({ queryKey: authKeys.all });
    },
  });
};

/** Update the current user's profile. */
export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProfileUpdateRequest) => {
      const { data } = await authApi.updateProfile(payload);
      return data;
    },
    onSuccess: (updatedUser) => {
      qc.setQueryData(authKeys.me(), updatedUser);
    },
  });
};

/** Change password (authenticated). */
export const useChangePassword = () =>
  useMutation({
    mutationFn: async (payload: ChangePasswordRequest) => {
      const { data } = await authApi.changePassword(payload);
      return data;
    },
  });

/** Request a password-reset email. */
export const useRequestPasswordReset = () =>
  useMutation({
    mutationFn: async (payload: PasswordResetRequest) => {
      const { data } = await authApi.requestPasswordReset(payload);
      return data;
    },
  });

/** Confirm a password reset (from the email link). */
export const useConfirmPasswordReset = () =>
  useMutation({
    mutationFn: async ({
      uidb64,
      token,
      ...payload
    }: PasswordResetConfirmRequest & { uidb64: string; token: string }) => {
      const { data } = await authApi.confirmPasswordReset(uidb64, token, payload);
      return data;
    },
  });

/** Set password from an invitation link. */
export const useSetPassword = () =>
  useMutation({
    mutationFn: async ({
      uidb64,
      token,
      ...payload
    }: SetPasswordRequest & { uidb64: string; token: string }) => {
      const { data } = await authApi.setPassword(uidb64, token, payload);
      return data;
    },
  });

/** Verify email address (from the email link). */
export const useVerifyEmail = () =>
  useMutation({
    mutationFn: async ({ uidb64, token }: { uidb64: string; token: string }) => {
      const { data } = await authApi.verifyEmail(uidb64, token);
      return data;
    },
  });

/** Resend email verification. */
export const useResendVerification = () =>
  useMutation({
    mutationFn: async (email: string) => {
      const { data } = await authApi.resendVerification(email);
      return data;
    },
  });

/** Invite a user (super admin). */
export const useInviteUser = () =>
  useMutation({
    mutationFn: async (payload: InviteUserRequest) => {
      const { data } = await adminApi.inviteUser(payload);
      return data;
    },
  });
