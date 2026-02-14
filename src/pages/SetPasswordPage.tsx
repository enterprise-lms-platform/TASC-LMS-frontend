import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { authApi, getErrorMessage } from '../services/main.api';
import { loginColors } from '../styles/loginTheme';

const SetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!uidb64 || !token) {
      setError('Invalid invitation link');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.setPassword(uidb64, token, {
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          p: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 500,
            width: '100%',
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
          }}
        >
          <Box sx={{ color: loginColors.status.success, fontSize: '4rem', mb: 2 }}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </Box>
          <Typography variant="h5" fontWeight={700} mb={1} color={loginColors.neutral[800]}>
            Password Set Successfully!
          </Typography>
          <Typography variant="body2" mb={3} color={loginColors.neutral[600]}>
            Your password has been set. Redirecting to login...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#ffffff',
      }}
    >
      {/* Left Panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box sx={{ fontSize: '3rem' }}>
            <FontAwesomeIcon icon={faGraduationCap} />
          </Box>
          <Typography variant="h3" fontWeight={700}>
            TASC LMS
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight={600} mb={2} textAlign="center">
          Welcome to TASC Learning Management System
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ maxWidth: 400, opacity: 0.9 }}>
          Set your password to get started with your account
        </Typography>
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          bgcolor: '#ffffff',
        }}
      >
        <Box sx={{ maxWidth: 500, width: '100%' }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" fontWeight={700} mb={1} color={loginColors.neutral[800]}>
              Set Your Password
            </Typography>
            <Typography variant="body2" mb={3} color={loginColors.neutral[600]}>
              Create a secure password for your account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box mb={2}>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: loginColors.neutral[700],
                  mb: 0.5,
                }}
              >
                New Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Enter your password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                size="small"
              />
            </Box>

            <Box mb={3}>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: loginColors.neutral[700],
                  mb: 0.5,
                }}
              >
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                size="small"
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                bgcolor: loginColors.primary[600],
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                '&:hover': { bgcolor: loginColors.primary[700] },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Set Password'
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SetPasswordPage;
