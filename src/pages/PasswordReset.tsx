import { Box, Stack, Typography, TextField, Button, Alert, CircularProgress } from "@mui/material"
import { passwordResetStyles } from "../styles/passwordReset"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock, faEnvelope, faGraduationCap, faShieldAlt, faCheckCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import type { ReactNode } from "react"
import { useState } from "react"
import { useNavigate, useSearchParams, useParams } from "react-router-dom"
import { authApi, getErrorMessage } from "../lib/api"
import { loginColors } from "../styles/loginTheme"


// tip item cards
const TipCard = ({ icon, heading, cardParagraph } : { icon: ReactNode, heading: string, cardParagraph:string }) => {
  return(
    <>
      <Box sx={passwordResetStyles.tipItem}>
            <Box sx={passwordResetStyles.tipIcon}>
                {icon}
            </Box>
            <Box>
                <Typography sx={passwordResetStyles.tipTextH4}>{heading}</Typography>
                <Typography sx={passwordResetStyles.tipTextP}>{cardParagraph}</Typography>
            </Box>
        </Box>
    </>
  )
}

// Stat cards
const StatCard = ({label, value} : {label:string, value: string}) =>{
  return(
    <>
      <Box sx={passwordResetStyles.statItem}>
        <Typography sx={passwordResetStyles.statLabel}>{label}</Typography>
        <Typography sx={passwordResetStyles.statValue}>{value}</Typography>
      </Box>
    </>
  )
} 

// Right Panel tabs
/* 
// Password Reset Form
const ResetForm = () => {
  return(
    <>
      <Box sx={passwordResetStyles.resetForm}>
        <Box sx={passwordResetStyles.formStep} className="active">

        </Box>
      </Box>
    </>
  )
}
*/
/* 
// Step 2: OTP Verification
const OTPVerification = () => {
  return(
    <>
    </>
  )
}

// Step 3:New Password

const NewPassword = () => {

}

// Success State

const SuccessTab = () => {

}
*/



function PasswordResetPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeParams = useParams<{ uidb64?: string; token?: string }>();
  const [step, setStep] = useState<'request' | 'confirm' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if we have uidb64 and token - prefer route params, fallback to query params for backward compatibility
  const uidb64 = routeParams.uidb64 || searchParams.get('uidb64');
  const token = routeParams.token || searchParams.get('token');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.requestPasswordReset({ email });
      setSuccess('Password reset link has been sent to your email. Please check your inbox.');
      setTimeout(() => setStep('success'), 1000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!uidb64 || !token) {
      setError('Invalid password reset link');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.confirmPasswordReset({
        uidb64,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess('Password has been reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Box sx={passwordResetStyles.resetContainer}>
      {/* Left Panel */}
      <Box sx={passwordResetStyles.resetLeft}>
        <Box sx={passwordResetStyles.logoContainer}>
          <Box sx={passwordResetStyles.logoIcon}>
            <FontAwesomeIcon icon={faGraduationCap} />
          </Box>
          <Box sx={passwordResetStyles.logoText}>TASC LMS</Box>
        </Box>

        <Typography sx={passwordResetStyles.securityTagline}>Secure Account Recovery</Typography>

        <Stack sx={passwordResetStyles.securityTips}>
          <TipCard 
            icon = {<FontAwesomeIcon icon={faShieldAlt} />}
            heading="Security First"
            cardParagraph="We verify your identity before allowing password changes"
          />
          <TipCard 
            icon = {<FontAwesomeIcon icon={faClock} />}
            heading="Quick Recovery"
            cardParagraph="Reset your password in minutes, not hours"
          />
          <TipCard 
            icon = {<FontAwesomeIcon icon={faEnvelope} />}
            heading="Email Verification"
            cardParagraph="We'll send a secure link to your registered email"
          />
        </Stack>

        <Stack sx={passwordResetStyles.securityStats}>
          <StatCard 
            label="Average Recovery Time"
            value="2.5 minutes"
          />
          <StatCard 
            label="Success Rate"
            value="98.7%"
          />
          <StatCard 
            label="Security Score"
            value="A+"
          />
        </Stack>

      <Box sx={passwordResetStyles.copyright}>
        &copy; 2025 TASC Learning Management System. All rights reserved.
      </Box>
      </Box>
      
      {/* Right Panel */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: '#ffffff' }}>
        <Box sx={{ maxWidth: 500, width: '100%' }}>
          {/* Request Reset Form */}
          {step === 'request' && !uidb64 && !token && (
            <Box component="form" onSubmit={handleRequestReset}>
              <Typography variant="h4" fontWeight={700} mb={1} color={loginColors.neutral[800]}>
                Reset Your Password
              </Typography>
              <Typography variant="body2" mb={3} color={loginColors.neutral[600]}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

              <Box mb={2}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: loginColors.neutral[700], mb: 0.5 }}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Send Reset Link'}
              </Button>

              <Button
                fullWidth
                sx={{ mt: 2, textTransform: 'none', color: loginColors.neutral[600] }}
                startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>
            </Box>
          )}

          {/* Confirm Reset Form */}
          {(uidb64 && token && step !== 'success') && (
            <Box component="form" onSubmit={handleConfirmReset}>
              <Typography variant="h4" fontWeight={700} mb={1} color={loginColors.neutral[800]}>
                Set New Password
              </Typography>
              <Typography variant="body2" mb={3} color={loginColors.neutral[600]}>
                Enter your new password below.
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

              <Box mb={2}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: loginColors.neutral[700], mb: 0.5 }}>
                  New Password
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  size="small"
                />
              </Box>

              <Box mb={2}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: loginColors.neutral[700], mb: 0.5 }}>
                  Confirm Password
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="Confirm new password"
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
                {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Reset Password'}
              </Button>
            </Box>
          )}

          {/* Success State */}
          {step === 'success' && (
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ color: loginColors.status.success, fontSize: '4rem', mb: 2 }}>
                <FontAwesomeIcon icon={faCheckCircle} />
              </Box>
              <Typography variant="h5" fontWeight={700} mb={1} color={loginColors.neutral[800]}>
                Check Your Email
              </Typography>
              <Typography variant="body2" mb={3} color={loginColors.neutral[600]}>
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                sx={{ textTransform: 'none', borderColor: loginColors.neutral[300], color: loginColors.neutral[600] }}
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>

    </>
  )
}

export default PasswordResetPage