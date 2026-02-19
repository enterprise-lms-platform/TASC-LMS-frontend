import React, { useState, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useCurrentUser,
  useLogin,
  useRegister,
  useLogout,
  authKeys,
} from '../hooks/useAuthQueries';
import { getRefreshToken, clearTokens, getErrorMessage } from '../services/main.api';
import { AuthContext, type AuthContextType } from './AuthContextDefinition';
import type { LoginRequest, RegisterRequest, MfaChallengeResponse } from '../types/types';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();

  // TanStack query: fetch current user (runs when an access token exists)
  const {
    data: user = null,
    isLoading: isUserLoading,
    isFetching,
  } = useCurrentUser();

  // Mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = useCallback(
    async (credentials: LoginRequest): Promise<MfaChallengeResponse> => {
      setError(null);
      try {
        const result = await loginMutation.mutateAsync(credentials);
        return result;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw err;
      }
    },
    [loginMutation],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      setError(null);
      try {
        await registerMutation.mutateAsync(data);
        // User must verify email before login — don't set user here.
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw err;
      }
    },
    [registerMutation],
  );

  const logout = useCallback(async () => {
    setError(null);
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await logoutMutation.mutateAsync(refreshToken);
      } else {
        // No refresh token — just clear local state
        clearTokens();
        qc.setQueryData(authKeys.me(), null);
        qc.removeQueries({ queryKey: authKeys.all });
      }
    } catch {
      // Always clear local state even if the API call fails
      clearTokens();
      qc.setQueryData(authKeys.me(), null);
      qc.removeQueries({ queryKey: authKeys.all });
    }
  }, [logoutMutation, qc]);

  const refreshUser = useCallback(async () => {
    setError(null);
    try {
      await qc.invalidateQueries({ queryKey: authKeys.me() });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    }
  }, [qc]);

  const clearError = useCallback(() => setError(null), []);

  // Consider loading while the initial user fetch is in flight
  const isLoading =
    isUserLoading ||
    isFetching ||
    loginMutation.isPending ||
    registerMutation.isPending;

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
