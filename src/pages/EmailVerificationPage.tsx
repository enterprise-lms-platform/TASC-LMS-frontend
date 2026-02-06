import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Button, CircularProgress, Typography, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { loginStyles, loginColors } from '../styles/loginTheme';
import { authApi, getErrorMessage } from '../lib/api';

const EmailVerificationPage: React.FC = () => {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!uidb64 || !token) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email and try again.');
        return;
      }

      try {
        const response = await authApi.verifyEmail(uidb64, token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully! You can now log in.');
      } catch (err) {
        setStatus('error');
        setMessage(getErrorMessage(err));
      }
    };

    verifyEmail();
  }, [uidb64, token]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <Box sx={loginStyles.loginContainer}>
      {/* Left Panel */}
      <Box sx={loginStyles.leftPanel}>
        <Stack sx={loginStyles.leftPanelContent}>
          <Box sx={loginStyles.logoContainer}>
            <Box sx={loginStyles.logoIcon}>
              <FontAwesomeIcon icon={faGraduationCap} />
            </Box>
            <Typography sx={loginStyles.logoText}>TASC LMS</Typography>
          </Box>
          <Typography sx={loginStyles.tagline}>Verify Your Email Address</Typography>
        </Stack>
        <Typography sx={loginStyles.copyright}>
          &copy; 2025 TASC Learning Management System. All rights reserved.
        </Typography>
      </Box>

      {/* Right Panel */}
      <Box sx={loginStyles.rightPanel}>
        <Box sx={loginStyles.formContainer} style={{ textAlign: 'center' }}>
          {status === 'loading' && (
            <>
              <CircularProgress size={60} sx={{ color: loginColors.primary[600], mb: 3 }} />
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 2, color: loginColors.neutral[800] }}>
                Verifying Your Email...
              </Typography>
              <Typography sx={{ color: loginColors.neutral[600] }}>
                Please wait while we verify your email address.
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <Box sx={{ color: loginColors.status.success, fontSize: '4rem', mb: 3 }}>
                <FontAwesomeIcon icon={faCheckCircle} />
              </Box>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 2, color: loginColors.neutral[800] }}>
                Email Verified Successfully!
              </Typography>
              <Typography sx={{ color: loginColors.neutral[600], mb: 4 }}>
                {message}
              </Typography>
              <Button onClick={handleGoToLogin} variant="contained" sx={loginStyles.primaryButton}>
                Go to Login
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <Box sx={{ color: loginColors.status.error, fontSize: '4rem', mb: 3 }}>
                <FontAwesomeIcon icon={faExclamationCircle} />
              </Box>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 2, color: loginColors.neutral[800] }}>
                Verification Failed
              </Typography>
              <Typography sx={{ color: loginColors.neutral[600], mb: 4 }}>
                {message}
              </Typography>
              <Stack spacing={2} sx={{ width: '100%' }}>
                <Button onClick={handleGoToLogin} variant="contained" sx={loginStyles.primaryButton}>
                  Go to Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  sx={{
                    borderColor: loginColors.neutral[300],
                    color: loginColors.neutral[600],
                    '&:hover': { borderColor: loginColors.neutral[400], bgcolor: loginColors.neutral[50] },
                  }}
                >
                  Register Again
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EmailVerificationPage;
