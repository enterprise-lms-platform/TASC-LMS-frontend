import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Reusable logout hook for all dashboards
 * Handles logout API call, token clearing, and navigation to login
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate to login anyway - tokens are cleared even if API fails
      navigate('/login');
    }
  };

  return handleLogout;
};
