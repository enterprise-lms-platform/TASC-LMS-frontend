/**
 * Tests: ProtectedRoute role-based access control
 *
 * MUI and react-router-dom are mocked to prevent transform hangs in jsdom.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// ---------------------------------------------------------------------------
// Stub heavy deps BEFORE importing the component under test
// ---------------------------------------------------------------------------

// Stub MUI — prevents Vitest hanging on the full MUI transform tree
vi.mock('@mui/material', () => ({
  Box: ({ children }: any) => <div>{children}</div>,
  CircularProgress: () => <div data-testid="spinner">Loading</div>,
  Typography: ({ children }: any) => <p>{children}</p>,
}));

// Stub react-router-dom — Navigate, useLocation, useAuth will be fakes
const mockNavigateFn = vi.fn();
vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
  useLocation: () => ({ pathname: '/test', search: '' }),
}));

// Mock AuthContext
const mockAuthState = {
  isAuthenticated: true,
  isLoading: false,
  user: { role: 'learner' } as { role: string } | null,
};
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockAuthState,
}));

// DEV_BYPASS_AUTH must be false for ProtectedRoute to run its real logic
vi.mock('../utils/config', () => ({
  DEV_BYPASS_AUTH: false,
}));

// ---------------------------------------------------------------------------
// Import component AFTER mocks are set up
// ---------------------------------------------------------------------------
import ProtectedRoute from '../components/ProtectedRoute';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const renderRoute = (props: Omit<React.ComponentProps<typeof ProtectedRoute>, 'children'>) =>
  render(
    <ProtectedRoute {...props}>
      <div data-testid="child">Protected Content</div>
    </ProtectedRoute>
  );

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockAuthState.isAuthenticated = true;
    mockAuthState.isLoading = false;
    mockAuthState.user = { role: 'learner' };
  });

  it('renders children when authenticated and no role required', () => {
    renderRoute({});
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders Navigate to /login when not authenticated', () => {
    mockAuthState.isAuthenticated = false;
    mockAuthState.user = null;
    renderRoute({});
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    const nav = screen.getByTestId('navigate');
    expect(nav.getAttribute('data-to')).toContain('/login');
  });

  it('shows loading spinner when isLoading=true', () => {
    mockAuthState.isLoading = true;
    renderRoute({});
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('grants access when user role matches requiredRole', () => {
    mockAuthState.user = { role: 'tasc_admin' };
    renderRoute({ requiredRole: 'tasc_admin' as any });
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('shows Access Denied when requiredRole does not match', () => {
    // learner trying tasc_admin page
    renderRoute({ requiredRole: 'tasc_admin' as any });
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });

  it('grants access when user role is in allowedRoles', () => {
    mockAuthState.user = { role: 'instructor' };
    renderRoute({ allowedRoles: ['instructor', 'tasc_admin'] as any });
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('shows Access Denied when role is NOT in allowedRoles', () => {
    // learner trying instructor-only page
    renderRoute({ allowedRoles: ['instructor', 'tasc_admin'] as any });
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });
});
