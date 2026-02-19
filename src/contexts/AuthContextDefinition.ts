import { createContext } from 'react';
import type { UserMe, LoginRequest, RegisterRequest, MfaChallengeResponse } from '../types/types';

export interface AuthContextType {
  user: UserMe | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<MfaChallengeResponse>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
