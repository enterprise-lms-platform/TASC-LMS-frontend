import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { AxiosError } from 'axios';

import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  LogoutResponse,
  User,
  EmailVerificationResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  PasswordResetConfirmRequest,
  ChangePasswordRequest,
  InviteUserRequest,
  InviteUserResponse,
  SetPasswordFromInviteRequest,
  SetPasswordFromInviteResponse,
  ApiErrorResponse,
} from '../types/api';

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const API_VERSION = '/api/v1';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add access token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        // No refresh token, clear storage and reject
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        processQueue(new Error('No refresh token available'), null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<RefreshTokenResponse>(
          `${API_BASE_URL}${API_VERSION}/auth/refresh/`,
          { refresh: refreshToken }
        );
        const { access } = response.data;
        localStorage.setItem(ACCESS_TOKEN_KEY, access);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }
        processQueue(null, access);
        isRefreshing = false;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear storage and reject
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        processQueue(refreshError as Error, null);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Token management functions
export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Auth API functions
export const authApi = {
  // Register new user
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register/', data);
    return response.data;
  },

  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login/', data);
    const { access, refresh } = response.data;
    setTokens(access, refresh);
    return response.data;
  },

  // Logout
  logout: async (): Promise<LogoutResponse> => {
    const refresh = getRefreshToken();
    if (!refresh) {
      throw new Error('No refresh token found');
    }
    const response = await apiClient.post<LogoutResponse>('/auth/logout/', { refresh });
    clearTokens();
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refresh: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh/', { refresh });
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me/');
    return response.data;
  },

  // Verify email
  verifyEmail: async (uidb64: string, token: string): Promise<EmailVerificationResponse> => {
    const response = await apiClient.get<EmailVerificationResponse>(
      `/auth/verify-email/${uidb64}/${token}/`
    );
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (data: PasswordResetRequest): Promise<PasswordResetResponse> => {
    const response = await apiClient.post<PasswordResetResponse>(
      '/auth/password-reset/',
      data
    );
    return response.data;
  },

  // Confirm password reset
  confirmPasswordReset: async (
    data: PasswordResetConfirmRequest
  ): Promise<PasswordResetResponse> => {
    const response = await apiClient.post<PasswordResetResponse>(
      `/auth/password-reset-confirm/${data.uidb64}/${data.token}/`,
      {
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      }
    );
    return response.data;
  },

  // Change password (for authenticated users)
  changePassword: async (data: ChangePasswordRequest): Promise<PasswordResetResponse> => {
    const response = await apiClient.post<PasswordResetResponse>(
      '/auth/change-password/',
      data
    );
    return response.data;
  },

  // Google OAuth login
  googleLogin: async (idToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/google/login/', {
      id_token: idToken,
    });
    const { access, refresh } = response.data;
    setTokens(access, refresh);
    return response.data;
  },

  // Invite user (admin only)
  inviteUser: async (data: InviteUserRequest): Promise<InviteUserResponse> => {
    const response = await apiClient.post<InviteUserResponse>(
      '/admin/users/invite/',
      data
    );
    return response.data;
  },

  // Set password from invite
  setPasswordFromInvite: async (
    uidb64: string,
    token: string,
    data: SetPasswordFromInviteRequest
  ): Promise<SetPasswordFromInviteResponse> => {
    const response = await apiClient.post<SetPasswordFromInviteResponse>(
      `/auth/set-password/${uidb64}/${token}/`,
      data
    );
    return response.data;
  },
};

// Helper function to extract error message from API error
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse;
    if (data?.detail) {
      return data.detail;
    }
    // Handle validation errors (field: ["error1", "error2"])
    if (data && typeof data === 'object') {
      const firstError = Object.values(data).find((value) => Array.isArray(value) && value.length > 0);
      if (firstError && Array.isArray(firstError)) {
        return firstError[0];
      }
      const firstStringError = Object.values(data).find((value) => typeof value === 'string');
      if (firstStringError && typeof firstStringError === 'string') {
        return firstStringError;
      }
    }
  }
  return 'An unexpected error occurred. Please try again.';
};

export default apiClient;
