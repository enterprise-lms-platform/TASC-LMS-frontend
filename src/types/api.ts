// API Types based on SYSTEM_CONTEXT.md backend contract

// User Roles from backend
export type UserRole = 'learner' | 'instructor' | 'org_admin' | 'lms_manager' | 'finance' | 'tasc_admin';

// User object returned from /api/v1/auth/me/
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  name: string; // Full name
  username?: string;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
  phone_number?: string;
  country?: string;
  timezone?: string;
  profile_picture?: string;
  date_joined?: string;
}

// Auth API Requests
export interface RegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  country?: string;
  timezone?: string;
  accept_terms: boolean;
  marketing_opt_in?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface LogoutRequest {
  refresh: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  uidb64: string;
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

// Auth API Responses
export interface RegisterResponse {
  message: string;
  user_id: number;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export interface LogoutResponse {
  message: string;
}

export interface EmailVerificationResponse {
  message: string;
}

export interface PasswordResetResponse {
  message: string;
}

// API Error Response
export interface ApiErrorResponse {
  detail?: string;
  [key: string]: string[] | string | undefined;
}

// Pagination Response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
