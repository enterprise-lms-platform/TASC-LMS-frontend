/**
 * TASC LMS API Configuration; base configuration for axios client and API constants
 */

import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types/types';

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api-staging.tasclms.com/api/schema.json',
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// Token management
export const TOKEN_STORAGE_KEYS = {
  ACCESS: 'tasc_access_token',
  REFRESH: 'tasc_refresh_token',
} as const;

// Get access token from storage
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS);
};


//Get refresh token from storage
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH);
};

//Set authentication tokens
export const setTokens = (access: string, refresh: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS, access);
  localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH, refresh);
};

// Clear authentication tokens
export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH);
};


// Queue system for handling concurrent 401 errors
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

// Helper function to extract error message from API error
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError;
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

// Create axios instance with default configuration
export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
  });

  // Request interceptor - add auth token
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // If error is 401 and we haven't retried yet
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
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            clearTokens();
            processQueue(new Error('No refresh token available'), null);
            isRefreshing = false;
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(error);
          }

          // Attempt to refresh the token
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/api/v1/auth/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = response.data;
          
          // Update stored token
          setTokens(access, refreshToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          processQueue(null, access);
          isRefreshing = false;
          return client(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clear tokens and redirect to login
          clearTokens();
          processQueue(refreshError as Error, null);
          isRefreshing = false;
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Export singleton instance
export const apiClient = createApiClient();