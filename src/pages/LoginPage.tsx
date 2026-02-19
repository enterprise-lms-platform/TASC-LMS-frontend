import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'  //this is a stubborn import
import { Link, useNavigate } from 'react-router-dom';
import { faBookOpen, faCertificate, faChalkboardTeacher, faEye, faEyeSlash, faGraduationCap, faSignIn, faShieldAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import {  loginStyles } from '../styles/loginTheme'

import { Box, Button, Divider, Stack, Typography, TextField, FormControlLabel, Checkbox, Alert } from "@mui/material"
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { authApi } from '../services/auth.services';
import { setTokens } from '../utils/config';
import { useQueryClient } from '@tanstack/react-query';
import { authKeys } from '../hooks/useAuthQueries';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  return (
    <Box sx={loginStyles.featureItem}>
      <Box sx={loginStyles.featureIcon}>{icon}</Box>
      <Box sx={loginStyles.featureText}>
        <Typography variant="body1" sx={loginStyles.featureTitle}>
          {title}
        </Typography>
        <Typography variant="body2" sx={loginStyles.featureText}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCodes, setMfaCodes] = useState(['', '', '', '', '', '']);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // MFA state
  const [showMFA, setShowMFA] = useState(false);
  const [challengeId, setChallengeId] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  const handleGoogleSuccess = async (credential: string) => {
    setGoogleLoading(true);
    setApiError('');
    try {
      const { data } = await authApi.googleLogin({ id_token: credential });
      setTokens(data.access, data.refresh);
      // Set user data directly in cache to trigger auth state update & redirect
      queryClient.setQueryData(authKeys.me(), data.user);
    } catch (err: unknown) {
      let errorMessage = 'Google sign-in failed';
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { detail?: string; error?: string } }; message?: string };
        errorMessage = error.response?.data?.detail || error.response?.data?.error || error.message || errorMessage;
      }
      setApiError(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const roleRoutes: Record<string, string> = {
        learner: '/learner',
        instructor: '/instructor',
        lms_manager: '/manager',
        finance: '/finance',
        tasc_admin: '/superadmin',
      };
      const redirectTo = roleRoutes[user.role] || '/learner';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const isValidEmail = (emailAddress: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setEmailError('');
    setPasswordError('');
    setApiError('');

    let isValid = true;

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    }

    if (isValid) {
      setIsLoading(true);
      try {
        const mfaResponse = await login({ email, password });
        if (mfaResponse.mfa_required) {
          setChallengeId(mfaResponse.challenge_id);
          setShowMFA(true);
          setResendTimer(30);
          setResendCount(1);
          setApiError('');
        }
      } catch (err: unknown) {
        let errorMessage = 'Login failed';
        if (err && typeof err === 'object' && 'response' in err) {
          const error = err as { response?: { data?: { detail?: string } }; message?: string };
          errorMessage = error.response?.data?.detail || error.message || 'Login failed';
        }

        if (errorMessage.toLowerCase().includes('email') &&
            (errorMessage.toLowerCase().includes('verify') || errorMessage.toLowerCase().includes('not verified'))) {
          setApiError('Please verify your email address before logging in. Check your inbox for the verification link.');
        } else if (errorMessage.toLowerCase().includes('credential')) {
          setApiError('Invalid email or password. Please try again.');
        } else {
          setApiError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOtp = useCallback(async (codes: string[]) => {
    const otp = codes.join('');
    if (otp.length !== 6) return;

    setOtpLoading(true);
    setApiError('');
    try {
      const { data } = await authApi.verifyOtp({ challenge_id: challengeId, otp });
      setTokens(data.access, data.refresh);
      // Set user data directly in cache to trigger auth state update & redirect
      queryClient.setQueryData(authKeys.me(), data.user);
    } catch (err: unknown) {
      let errorMessage = 'Verification failed';
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { detail?: string } }; message?: string };
        errorMessage = error.response?.data?.detail || error.message || errorMessage;
      }
      setApiError(errorMessage);
      // Clear codes on error so user can re-enter
      setMfaCodes(['', '', '', '', '', '']);
      const firstInput = document.getElementById('mfa-input-0') as HTMLInputElement;
      firstInput?.focus();
    } finally {
      setOtpLoading(false);
    }
  }, [challengeId, queryClient]);

  const handleResendOtp = async () => {
    if (resendTimer > 0 || resendCount >= 3) return;
    setApiError('');
    try {
      await authApi.resendOtp(challengeId);
      setResendCount((prev) => prev + 1);
      setResendTimer(30);
    } catch (err: unknown) {
      let errorMessage = 'Failed to resend code';
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { detail?: string } }; message?: string };
        errorMessage = error.response?.data?.detail || error.message || errorMessage;
      }
      setApiError(errorMessage);
    }
  };

  const handleBackToLogin = () => {
    setShowMFA(false);
    setChallengeId('');
    setMfaCodes(['', '', '', '', '', '']);
    setApiError('');
    setResendCount(0);
    setResendTimer(0);
  };

  const handleMFAInputChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newCodes = [...mfaCodes];
      newCodes[index] = value;
      setMfaCodes(newCodes);

      // Auto-focus to next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`mfa-input-${index + 1}`) as HTMLInputElement;
        nextInput?.focus();
      }

      // Auto-submit when all 6 digits entered
      if (value && index === 5) {
        handleVerifyOtp(newCodes);
      }
    }
  };

  const handleMFAKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && !mfaCodes[index] && index > 0) {
      const prevInput = document.getElementById(`mfa-input-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  return (
    <>
      <Box sx={loginStyles.loginContainer}>
        {/* Left Panel - Branding & Info */}
        <Box sx={loginStyles.leftPanel}>
          <Stack sx={loginStyles.leftPanelContent}>
            <Box sx={loginStyles.logoContainer}>
              <Box sx={loginStyles.logoIcon}>
                <FontAwesomeIcon icon={faGraduationCap} />
              </Box>
              <Typography sx={loginStyles.logoText}>
                TASC LMS
              </Typography>
            </Box>
            <Typography sx={loginStyles.tagline}>
              Empower Your Learning Journey
            </Typography>
            <Stack sx={loginStyles.featureContainer}>
              <FeatureItem
                icon={<FontAwesomeIcon icon={faBookOpen} />}
                title="Comprehensive Course Library"
                description="Access hundreds of courses across multiple disciplines"
              />
              <FeatureItem
                icon={<FontAwesomeIcon icon={faChalkboardTeacher} />}
                title="Expert Instructors"
                description="Learn from industry professionals and certified experts"
              />
              <FeatureItem
                icon={<FontAwesomeIcon icon={faCertificate} />}
                title="Verified Certifications"
                description="Earn recognized certificates upon course completion"
              />
            </Stack>
          </Stack>

          <Typography sx={loginStyles.copyright}>
            © 2025 TASC Learning Management System. All rights reserved.
          </Typography>
        </Box>

        {/* Right Panel - Login Form */}
        <Box sx={loginStyles.rightPanel}>
          <Box sx={loginStyles.formContainer}>
            {!showMFA ? (
              <>
                <Stack sx={loginStyles.formHeader}>
                  <Typography sx={loginStyles.formTitle}>Welcome Back</Typography>
                  <Typography sx={loginStyles.formSubtitle}>Sign in to your TASC LMS account</Typography>
                </Stack>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* API Error Alert */}
                  {apiError && (
                    <Alert severity="error" onClose={() => setApiError('')}>
                      {apiError}
                    </Alert>
                  )}
                  
                  {/* Email Field */}
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46', mb: 0.5 }}>
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={!!emailError}
                      helperText={emailError}
                      size="small"
                      sx={loginStyles.inputField}
                    />
                  </Box>

                  {/* Password Field */}
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#3f3f46', mb: 0.5 }}>
                      Password
                    </Typography>
                    <Box sx={{ position: 'relative' }}>
                      <TextField
                        fullWidth
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                        size="small"
                        sx={loginStyles.inputField}
                      />
                      <Button
                        type="button"
                        onClick={handlePasswordToggle}
                        sx={{
                          position: 'absolute',
                          right: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          minWidth: 'auto',
                          padding: '4px 8px',
                          color: '#71717a',
                          '&:hover': { backgroundColor: 'transparent' },
                        }}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </Button>
                    </Box>
                  </Box>

                  {/* Remember Me & Forgot Password */}
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1.5, sm: 0 }, mt: 0.5 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          size="small"
                          sx={{ color: '#a1a1aa', '&.Mui-checked': { color: '#ffa424' } }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.875rem', color: '#52525b' }}>Remember me</Typography>}
                    />
                    <Button
                      component={Link}
                      to="/passwordreset"
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#ffa424',
                        textDecoration: 'none',
                        textTransform: 'none',
                        '&:hover': { textDecoration: 'underline', color: '#f97316' },
                      }}
                    >
                      Forgot password?
                    </Button>
                  </Box>

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={loginStyles.primaryButton}
                  >
                    <FontAwesomeIcon icon={isLoading ? faSpinner : faSignIn} style={{ marginRight: '8px' }} />
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  {/* Divider */}
                  <Divider sx={loginStyles.divider}>Or continue with</Divider>

                  {/* Social Login Buttons */}
                  <Stack sx={loginStyles.socialBtnContainer}>
                    {googleLoading ? (
                      <Button variant="outlined" disabled sx={[loginStyles.socialButton, loginStyles.googleButton]}>
                        <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: 8 }} />
                        Signing in with Google...
                      </Button>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                          onSuccess={(credentialResponse) => {
                            if (credentialResponse.credential) {
                              handleGoogleSuccess(credentialResponse.credential);
                            } else {
                              setApiError('Google sign-in failed: no credential received. Please try again.');
                            }
                          }}
                          onError={() => setApiError('Google sign-in failed. Please try again.')}
                          theme="outline"
                          size="large"
                          text="signin_with"
                          shape="rectangular"
                          width={400}
                        />
                      </Box>
                    )}
                  </Stack>
                </Box>

                {/* Sign Up Link */}
                <Box sx={loginStyles.signupSection}>
                  Don't have an account?
                  <Button
                    component={Link}
                    to="/register"
                    sx={{
                      color: '#ffa424',
                      textDecoration: 'none',
                      fontWeight: 600,
                      textTransform: 'none',
                      ml: 0.5,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Sign up now
                  </Button>
                </Box>
              </>
            ) : (
              <>
                {/* MFA Section */}
                <Stack sx={loginStyles.formHeader}>
                  <Typography sx={loginStyles.formTitle}>Verify Your Identity</Typography>
                  <Typography sx={loginStyles.formSubtitle}>
                    We've sent a 6-digit code to <b>{email}</b>
                  </Typography>
                </Stack>

                {apiError && (
                  <Alert severity="error" onClose={() => setApiError('')} sx={{ mb: 2 }}>
                    {apiError}
                  </Alert>
                )}

                <Box sx={loginStyles.mfaSection}>
                  <Box sx={loginStyles.mfaHeader}>
                    <FontAwesomeIcon icon={faShieldAlt} style={{ color: '#ffa424', fontSize: '1.25rem' }} />
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#3f3f46', ml: 1 }}>
                      Two-Factor Authentication
                    </Typography>
                  </Box>

                  <Typography sx={{ fontSize: '0.875rem', color: '#52525b', mb: 2, mt: 2 }}>
                    Enter the 6-digit verification code sent to your email.
                  </Typography>

                  <Box sx={loginStyles.mfaInputContainer}>
                    {mfaCodes.map((code, index) => (
                      <TextField
                        key={index}
                        id={`mfa-input-${index}`}
                        type="text"
                        inputProps={{ maxLength: 1, pattern: '[0-9]', inputMode: 'numeric' }}
                        value={code}
                        onChange={(e) => handleMFAInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleMFAKeyDown(index, e)}
                        disabled={otpLoading}
                        sx={loginStyles.mfaInput}
                      />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1.5, sm: 0 }, mt: 2 }}>
                    {resendCount >= 3 ? (
                      <Typography sx={{ fontSize: '0.875rem', color: '#71717a' }}>
                        Maximum resends reached
                      </Typography>
                    ) : resendTimer > 0 ? (
                      <Typography sx={{ fontSize: '0.875rem', color: '#71717a' }}>
                        Resend code in <b>{resendTimer}s</b>
                      </Typography>
                    ) : (
                      <Button
                        onClick={handleResendOtp}
                        sx={{
                          color: '#ffa424',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          textTransform: 'none',
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': { textDecoration: 'underline', background: 'transparent' },
                        }}
                      >
                        Resend code
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      disabled={otpLoading || mfaCodes.join('').length !== 6}
                      onClick={() => handleVerifyOtp(mfaCodes)}
                      sx={loginStyles.primaryButton}
                    >
                      {otpLoading ? (
                        <><FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: 8 }} /> Verifying...</>
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  </Box>
                </Box>

                <Button
                  onClick={handleBackToLogin}
                  sx={{
                    mt: 3,
                    color: '#71717a',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: '#3f3f46', background: 'transparent' },
                  }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 8 }} />
                  Back to login
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage