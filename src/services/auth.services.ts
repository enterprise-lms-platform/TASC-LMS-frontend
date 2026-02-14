
  // Authentication API Service
  // Handles all authentication-related API calls


import { apiClient, getErrorMessage } from '../utils/config';
import type {
  LoginRequest,
  AuthTokens,
  RegisterRequest,
  RegisterResponse,
  ChangePasswordRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  SetPasswordRequest,
  GoogleLoginRequest,
  GoogleLoginResponse,
  GoogleStatusResponse,
  ProfileUpdateRequest,
  UserMe,
  InviteUserRequest,
} from '../types/types';

const BASE_PATH = '/api/v1/auth';
const ADMIN_PATH = '/api/v1/admin';

export const authApi = {
  
  //  Login with email and password
  login: (data: LoginRequest) =>
    apiClient.post<AuthTokens>(`${BASE_PATH}/login/`, data),

  
  //  Register a new user account
  register: (data: RegisterRequest) =>
    apiClient.post<RegisterResponse>(`${BASE_PATH}/register/`, data),

  
  //  Logout (blacklist refresh token)
  logout: (refreshToken: string) =>
    apiClient.post<{ detail: string }>(`${BASE_PATH}/logout/`, {
      refresh: refreshToken,
    }),

 
//Refresh access token
  refreshToken: (refreshToken: string) =>
    apiClient.post<{ access: string }>(`${BASE_PATH}/refresh/`, {
      refresh: refreshToken,
    }),


  //Get current authenticated user
  getCurrentUser: () =>
    apiClient.get<UserMe>(`${BASE_PATH}/me/`),

  //Update current user profile
  updateProfile: (data: ProfileUpdateRequest) =>
    apiClient.patch<UserMe>(`${BASE_PATH}/me/`, data),


//Change password for authenticated user
  changePassword: (data: ChangePasswordRequest) =>
    apiClient.post<{ detail: string }>(`${BASE_PATH}/change-password/`, data),

//Request password reset email
  requestPasswordReset: (data: PasswordResetRequest) =>
    apiClient.post<{ detail: string }>(`${BASE_PATH}/password-reset/`, data),

  // Confirm password reset with token
  confirmPasswordReset: (
    uidb64: string,
    token: string,
    data: PasswordResetConfirmRequest
  ) =>
    apiClient.post<{ detail: string }>(
      `${BASE_PATH}/password-reset-confirm/${uidb64}/${token}/`,
      data
    ),

    // Set password from invitation link
  setPassword: (
    uidb64: string,
    token: string,
    data: SetPasswordRequest
  ) =>
    apiClient.post<{ detail: string }>(
      `${BASE_PATH}/set-password/${uidb64}/${token}/`,
      data
    ),

    // Verify email address
  verifyEmail: (uidb64: string, token: string) =>
    apiClient.get<{ message: string }>(
      `${BASE_PATH}/verify-email/${uidb64}/${token}/`
    ),

    // Resend verification email
  resendVerification: (email: string) =>
    apiClient.post<{ detail: string }>(`${BASE_PATH}/resend-verification/`, {
      email,
    }),

  
    // Google OAuth login
  googleLogin: (data: GoogleLoginRequest) =>
    apiClient.post<GoogleLoginResponse>(`${BASE_PATH}/google/login/`, data),

  
    // Link Google account to existing user
  linkGoogleAccount: (idToken: string) =>
    apiClient.post<{ detail: string }>(`${BASE_PATH}/google/link/`, {
      id_token: idToken,
    }),

  
    // Unlink Google account
  unlinkGoogleAccount: () =>
    apiClient.post<{ detail: string }>(`${BASE_PATH}/google/unlink/`),

  
    // Get Google OAuth status
  getGoogleStatus: () =>
    apiClient.get<GoogleStatusResponse>(`${BASE_PATH}/google/status/`),
};

export const adminApi = {
  
    // Invite a user (Super Admin only)
  inviteUser: (data: InviteUserRequest) =>
    apiClient.post<{ detail: string; email: string }>(
      `${ADMIN_PATH}/users/invite/`,
      data
    ),
};

// Export error helper
export { getErrorMessage };