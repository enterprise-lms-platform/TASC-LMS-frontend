import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faShieldAlt,
  faUserShield,
  faMobileAlt,
  faMobileScreen,
  faEnvelope,
  faQrcode,
  faRedo,
  faArrowRight,
  faArrowLeft,
  faTimes,
  faCheckCircle,
  faThLarge,
  faCog,
  faSignInAlt,
  faSyncAlt,
  faKey,
  faExclamationTriangle,
  faExclamationCircle,
  faInfoCircle,
  faCheck,
  faPrint,
  faDownload,
  faCopy,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { Box, Button, Stack, Typography, TextField, Paper } from '@mui/material';
import { verificationStyles, verificationColors } from '../styles/verificationTheme';
import { useState } from 'react';

interface BenefitItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ icon, title, description }) => {
  return (
    <Box sx={verificationStyles.benefitItem}>
      <Box sx={verificationStyles.benefitIcon}>{icon}</Box>
      <Box sx={verificationStyles.benefitText}>
        <Typography sx={verificationStyles.benefitTitle}>{title}</Typography>
        <Typography>{description}</Typography>
      </Box>
    </Box>
  );
};

interface MethodCardProps {
  method: string;
  icon: React.ReactNode;
  name: string;
  description: string;
  badge: string;
  isRecommended?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

// Method cards component
const MethodCard: React.FC<MethodCardProps> = ({
  icon,
  name,
  description,
  badge,
  isRecommended,
  isSelected,
  onClick,
}) => {
  return (
    <Paper
      sx={{
        ...verificationStyles.methodCard,
        ...(isSelected && {
          borderColor: verificationColors.primary[600],
          backgroundColor: 'rgba(255, 164, 36, 0.05)',
        }),
      }}
      onClick={onClick}
      component="div"
      elevation={0}
    >
      <Box sx={verificationStyles.methodIcon}>{icon}</Box>
      <Typography sx={verificationStyles.methodName}>{name}</Typography>
      <Typography sx={verificationStyles.methodDescription}>{description}</Typography>
      <Box
        sx={[
          verificationStyles.methodBadge,
          isRecommended ? verificationStyles.badgeRecommended : verificationStyles.badgeBasic,
        ]}
      >
        {badge}
      </Box>
    </Paper>
  );
};

interface InstructionStepProps {
  number: number;
  title: string;
  description: string;
}

const InstructionStep: React.FC<InstructionStepProps> = ({ number, title, description }) => {
  return (
    <Box sx={verificationStyles.instructionStep}>
      <Box sx={verificationStyles.stepNumber}>{number}</Box>
      <Box sx={verificationStyles.stepContent}>
        <Typography sx={verificationStyles.stepTitle}>{title}</Typography>
        <Typography sx={verificationStyles.stepText}>{description}</Typography>
      </Box>
    </Box>
  );
};

type VerificationState = 'methodSelection' | 'authenticatorSetup' | 'smsSetup' | 'emailSetup' | 'backupCodes' | 'success' | 'loginVerification';

const VerificationPage = () => {
  const [currentState, setCurrentState] = useState<VerificationState>('methodSelection');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [otpCodes, setOtpCodes] = useState(['', '', '', '', '', '']);
  const [loginOtpCodes, setLoginOtpCodes] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const [userEmail, setUserEmail] = useState('john.doe@example.com');
  const [codeSentViaEmail, setCodeSentViaEmail] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(event.target.value);
  };

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    if (!selectedMethod) return;

    switch (selectedMethod) {
      case 'authenticator':
        setCurrentState('authenticatorSetup');
        break;
      case 'sms':
        setCurrentState('smsSetup');
        break;
      case 'email':
        setCurrentState('emailSetup');
        startEmailResendTimer();
        break;
    }
  };

  const startEmailResendTimer = () => {
    // Email resend timer functionality - ready for future email verification integration
  };

  // for the OTP Page
  const handleOtpChange = (index: number, value: string, isLogin: boolean = false) => {
    if (!/^[0-9]?$/.test(value)) return;

    const codes = isLogin ? [...loginOtpCodes] : [...otpCodes];
    codes[index] = value;

    if (isLogin) {
      setLoginOtpCodes(codes);
    } else {
      setOtpCodes(codes);
    }

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${isLogin ? 'login-' : ''}${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleVerifyAuthenticator = () => {
    const otp = otpCodes.join('');

    if (otp.length !== 6) {
      setOtpError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentState('backupCodes');
    }, 1500);
  };

  const handleVerifyLogin = () => {
    const otp = loginOtpCodes.join('');

    if (otp.length !== 6) {
      setOtpError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Login successful! Redirecting to dashboard...');
    }, 1500);
  };

  const renderState = () => {
    switch (currentState) {
      case 'methodSelection':
        return (
          <>
            <Box sx={verificationStyles.stateHeader}>
              <Typography sx={verificationStyles.stateTitle}>Choose Your Verification Method</Typography>
              <Typography sx={verificationStyles.stateSubtitle}>
                Select how you want to verify your identity when signing in
              </Typography>
            </Box>

            <Box sx={verificationStyles.methodSelection}>
              <MethodCard
                method="authenticator"
                icon={<FontAwesomeIcon icon={faMobileAlt} />}
                name="Authenticator App"
                description="Use apps like Google Authenticator, Microsoft Authenticator, or Authy"
                badge="Recommended"
                isRecommended
                isSelected={selectedMethod === 'authenticator'}
                onClick={() => handleMethodSelect('authenticator')}
              />
              <MethodCard
                method="sms"
                icon={<FontAwesomeIcon icon={faMobileScreen} />}
                name="SMS Text Message"
                description="Receive verification codes via text message to your phone"
                badge="Basic"
                isSelected={selectedMethod === 'sms'}
                onClick={() => handleMethodSelect('sms')}
              />
              <MethodCard
                method="email"
                icon={<FontAwesomeIcon icon={faEnvelope} />}
                name="Email Verification"
                description="Receive verification codes via email to your registered address"
                badge="Basic"
                isSelected={selectedMethod === 'email'}
                onClick={() => handleMethodSelect('email')}
              />
            </Box>

            <Paper
              sx={[
                verificationStyles.infoBox,
                verificationStyles.infoBoxWarning,
              ]}
              elevation={0}
            >
              <Box sx={verificationStyles.infoTitle}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ color: verificationColors.status.info }} />
                <span>Which method should I choose?</span>
              </Box>
              <Typography sx={verificationStyles.infoText}>
                <strong>Authenticator App</strong> is the most secure option. <strong>SMS/Email</strong> are good
                alternatives if you don't want to install an app. You can change your method anytime in account settings.
              </Typography>
            </Paper>

            <Stack sx={verificationStyles.buttonGroup}>
              <Button variant="outlined" startIcon={<FontAwesomeIcon icon={faTimes} />} sx={verificationStyles.secondaryButton}>
                Skip for Now
              </Button>
              <Button
                variant="contained"
                disabled={!selectedMethod}
                endIcon={<FontAwesomeIcon icon={faArrowRight} />}
                onClick={handleContinue}
                sx={verificationStyles.primaryButton}
              >
                Continue
              </Button>
            </Stack>
          </>
        );
      // Authenticator setup page
      case 'authenticatorSetup':
        return (
          <>
            <Box sx={verificationStyles.stateHeader}>
              <Typography sx={verificationStyles.stateTitle}>Set Up Authenticator App</Typography>
              <Typography sx={verificationStyles.stateSubtitle}>Follow these steps to link your authenticator app</Typography>
            </Box>

            <Box sx={verificationStyles.qrSection}>
              <Box sx={verificationStyles.qrContainer}>
                <Box sx={verificationStyles.qrCode}>
                  <FontAwesomeIcon icon={faQrcode} style={{ fontSize: '48px', marginBottom: '8px' }} />
                  <div>QR Code Placeholder</div>
                </Box>
                <Button sx={verificationStyles.qrRefresh} size="small">
                  <FontAwesomeIcon icon={faRedo} />
                </Button>
              </Box>

              <Box sx={verificationStyles.secretKey}>
                JBSWY3DPEHPK3PXP
                <Button sx={verificationStyles.copySecretBtn} size="small">
                  <FontAwesomeIcon icon={faCopy} /> Copy
                </Button>
              </Box>

              <Paper
                sx={[verificationStyles.infoBox, verificationStyles.infoBoxWarning]}
                elevation={0}
              >
                <Box sx={verificationStyles.infoTitle}>
                  <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: verificationColors.status.warning }} />
                  <span>Keep this secret key safe!</span>
                </Box>
                <Typography sx={verificationStyles.infoText}>
                  This key is used to set up your authenticator app. Store it securely in case you need to set up a new device.
                </Typography>
              </Paper>
            </Box>

            <Box sx={verificationStyles.setupInstructions}>
              <InstructionStep
                number={1}
                title="Install an Authenticator App"
                description="Download Google Authenticator, Microsoft Authenticator, Authy, or any TOTP-compatible app on your phone."
              />
              <InstructionStep
                number={2}
                title="Add a New Account"
                description='Open the app and tap "Add Account" or the + button. Choose "Scan QR Code" or "Enter Setup Key".'
              />
              <InstructionStep
                number={3}
                title="Scan or Enter Key"
                description="Scan the QR code above or manually enter the secret key: JBSWY3DPEHPK3PXP"
              />
              <InstructionStep
                number={4}
                title="Enter Verification Code"
                description="Enter the 6-digit code from your authenticator app below to verify setup."
              />
            </Box>

            <Box sx={verificationStyles.otpContainer}>
              {otpCodes.map((code, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputProps={{ maxLength: 1, pattern: '[0-9]', inputMode: 'numeric' }}
                  value={code}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  size="small"
                  sx={verificationStyles.otpInput}
                />
              ))}
            </Box>

            {otpError && (
              <Paper
                sx={[verificationStyles.infoBox, verificationStyles.infoBoxError]}
                elevation={0}
              >
                <Box sx={verificationStyles.infoTitle}>
                  <FontAwesomeIcon icon={faExclamationCircle} style={{ color: verificationColors.status.error }} />
                  <span>Invalid Code</span>
                </Box>
                <Typography sx={verificationStyles.infoText}>{otpError}</Typography>
              </Paper>
            )}

            <Stack sx={verificationStyles.buttonGroup}>
              <Button
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={() => setCurrentState('methodSelection')}
                sx={verificationStyles.secondaryButton}
              >
                Back
              </Button>
              <Button
                variant="contained"
                disabled={isLoading}
                endIcon={<FontAwesomeIcon icon={isLoading ? faSpinner : faCheck} />}
                onClick={handleVerifyAuthenticator}
                sx={verificationStyles.primaryButton}
              >
                {isLoading ? 'Verifying...' : 'Verify & Enable'}
              </Button>
            </Stack>
          </>
        );

      // SMS Setup page
      case 'smsSetup':
        return (
          <>
            <Box sx={verificationStyles.stateHeader}>
              <Typography sx={verificationStyles.stateTitle}>Set Up SMS Verification</Typography>
              <Typography sx={verificationStyles.stateSubtitle}>Receive verification codes via text message</Typography>
            </Box>

            <Paper
              sx={[verificationStyles.infoBox, verificationStyles.infoBoxInfo]}
              elevation={0}
            >
              <Box sx={verificationStyles.infoTitle}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ color: verificationColors.status.info }} />
                <span>Phone Number Required</span>
              </Box>
              <Typography sx={verificationStyles.infoText}>
                We'll send a 6-digit verification code to your phone number. Standard message rates may apply.
              </Typography>
            </Paper>

            <Box sx={{ marginTop: '24px', marginBottom: '24px' }}>
              <Box sx={{ marginBottom: '16px' }}>
                <Typography sx={{ fontWeight: 500, marginBottom: '8px', fontSize: '0.875rem' }}>
                  Phone Number <span style={{ color: verificationColors.status.error }}>*</span>
                </Typography>
                <Box sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    style={{
                      flex: '0 0 100px',
                      padding: '12px',
                      border: `1px solid ${verificationColors.neutral[300]}`,
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      fontSize: '0.875rem',
                    }}
                  >
                    <option value="+1">+1 (US)</option>
                    <option value="+256">+256 (UG)</option>
                    <option value="+254">+254 (KE)</option>
                    <option value="+255">+255 (TZ)</option>
                    <option value="+44">+44 (UK)</option>
                  </select>
                  <TextField
                    fullWidth
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    variant="outlined"
                    size="small"
                    inputProps={{ inputMode: 'numeric' }}
                  />
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                startIcon={<FontAwesomeIcon icon={faEnvelope} />}
                onClick={() => {
                  if (phoneNumber.trim()) {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      setOtpCodes(['', '', '', '', '', '']);
                    }, 1000);
                  }
                }}
                disabled={!phoneNumber.trim() || isLoading}
                sx={verificationStyles.primaryButton}
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </Box>

            {otpCodes.some((code) => code) && (
              <>
                <Box sx={verificationStyles.otpContainer}>
                  {otpCodes.map((code, index) => (
                    <TextField
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputProps={{ maxLength: 1, pattern: '[0-9]', inputMode: 'numeric' }}
                      value={code}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      size="small"
                      sx={verificationStyles.otpInput}
                    />
                  ))}
                </Box>

                {otpError && (
                  <Paper
                    sx={[verificationStyles.infoBox, verificationStyles.infoBoxError]}
                    elevation={0}
                  >
                    <Box sx={verificationStyles.infoTitle}>
                      <FontAwesomeIcon icon={faExclamationCircle} style={{ color: verificationColors.status.error }} />
                      <span>Invalid Code</span>
                    </Box>
                    <Typography sx={verificationStyles.infoText}>{otpError}</Typography>
                  </Paper>
                )}
              </>
            )}

            <Stack sx={verificationStyles.buttonGroup}>
              <Button
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={() => setCurrentState('methodSelection')}
                sx={verificationStyles.secondaryButton}
              >
                Back
              </Button>
              <Button
                variant="contained"
                disabled={isLoading || otpCodes.join('').length !== 6}
                endIcon={<FontAwesomeIcon icon={isLoading ? faSpinner : faCheck} />}
                onClick={handleVerifyAuthenticator}
                sx={verificationStyles.primaryButton}
              >
                {isLoading ? 'Verifying...' : 'Verify & Enable'}
              </Button>
            </Stack>
          </>
        );

      // Email Setup page
      case 'emailSetup':
        return (
          <>
            <Box sx={verificationStyles.stateHeader}>
              <Typography sx={verificationStyles.stateTitle}>Set Up Email Verification</Typography>
              <Typography sx={verificationStyles.stateSubtitle}>Receive verification codes via email</Typography>
            </Box>

            <Paper
              sx={[verificationStyles.infoBox, verificationStyles.infoBoxInfo]}
              elevation={0}
            >
              <Box sx={verificationStyles.infoTitle}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ color: verificationColors.status.info }} />
                <span>Email Verification</span>
              </Box>
              <Typography sx={verificationStyles.infoText}>
                We'll send a 6-digit verification code to your email address.
              </Typography>
            </Paper>

            <Box sx={{ marginTop: '24px', marginBottom: '16px' }}>
              <TextField
                fullWidth
                label="Email Address"
                value={userEmail}
                onChange={handleEmailChange}
                variant="outlined"
                size="small"
                disabled={codeSentViaEmail}
              />
            </Box>

            {!codeSentViaEmail ? (
              <Box sx={{ marginBottom: '24px', textAlign: 'center' }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<FontAwesomeIcon icon={faEnvelope} />}
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      setCodeSentViaEmail(true);
                      setEmailResendTimer(60);
                      // Start countdown timer
                      const timer = setInterval(() => {
                        setEmailResendTimer((prev) => {
                          if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                          }
                          return prev - 1;
                        });
                      }, 1000);
                    }, 1000);
                  }}
                  disabled={isLoading}
                  sx={verificationStyles.primaryButton}
                >
                  {isLoading ? 'Sending...' : 'Send Verification Code to Email'}
                </Button>
              </Box>
            ) : (
              <>
                <Box sx={verificationStyles.otpContainer}>
                  {otpCodes.map((code, index) => (
                    <TextField
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputProps={{ maxLength: 1, pattern: '[0-9]', inputMode: 'numeric' }}
                      value={code}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      size="small"
                      sx={verificationStyles.otpInput}
                    />
                  ))}
                </Box>

                {otpError && (
                  <Paper
                    sx={[verificationStyles.infoBox, verificationStyles.infoBoxError]}
                    elevation={0}
                  >
                    <Box sx={verificationStyles.infoTitle}>
                      <FontAwesomeIcon icon={faExclamationCircle} style={{ color: verificationColors.status.error }} />
                      <span>Invalid Code</span>
                    </Box>
                    <Typography sx={verificationStyles.infoText}>{otpError}</Typography>
                  </Paper>
                )}

                <Box sx={verificationStyles.resendContainer}>
                  <Typography sx={{ fontSize: '0.875rem', marginBottom: '8px' }}>
                    Didn't receive the code?{' '}
                    <Button
                      sx={verificationStyles.linkButton}
                      disabled={emailResendTimer > 0}
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                          setIsLoading(false);
                          setOtpCodes(['', '', '', '', '', '']);
                          setEmailResendTimer(60);
                          // Start countdown timer again
                          const timer = setInterval(() => {
                            setEmailResendTimer((prev) => {
                              if (prev <= 1) {
                                clearInterval(timer);
                                return 0;
                              }
                              return prev - 1;
                            });
                          }, 1000);
                        }, 1000);
                      }}
                      size="small"
                    >
                      Resend code {emailResendTimer > 0 && `(${emailResendTimer}s)`}
                    </Button>
                  </Typography>
                </Box>
              </>
            )}

            <Stack sx={verificationStyles.buttonGroup}>
              <Button
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={() => {
                  setCurrentState('methodSelection');
                  setCodeSentViaEmail(false);
                  setEmailResendTimer(0);
                }}
                sx={verificationStyles.secondaryButton}
              >
                Back
              </Button>
              <Button
                variant="contained"
                disabled={isLoading || !codeSentViaEmail || otpCodes.join('').length !== 6}
                endIcon={<FontAwesomeIcon icon={isLoading ? faSpinner : faCheck} />}
                onClick={handleVerifyAuthenticator}
                sx={verificationStyles.primaryButton}
              >
                {isLoading ? 'Verifying...' : 'Verify & Enable'}
              </Button>
            </Stack>
          </>
        );

      // Otp codes still part of the authenticator option
      case 'backupCodes':
        return (
          <>
            <Box sx={verificationStyles.stateHeader}>
              <Typography sx={verificationStyles.stateTitle}>Save Your Backup Codes</Typography>
              <Typography sx={verificationStyles.stateSubtitle}>
                Keep these codes safe in case you lose access to your authentication method
              </Typography>
            </Box>

            <Paper
              sx={[verificationStyles.infoBox, verificationStyles.infoBoxWarning]}
              elevation={0}
            >
              <Box sx={verificationStyles.infoTitle}>
                <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: verificationColors.status.warning }} />
                <span>Important: Download or Print These Codes</span>
              </Box>
              <Typography sx={verificationStyles.infoText}>
                These backup codes are your last resort if you lose access to your authenticator app or phone. Each code can
                be used only once. Store them in a secure location.
              </Typography>
            </Paper>

            <Box sx={verificationStyles.backupCodes}>
              <Box sx={verificationStyles.backupHeader}>
                <Typography sx={verificationStyles.backupTitle}>Your Backup Codes</Typography>
                <Button sx={verificationStyles.linkButton} size="small">
                  <FontAwesomeIcon icon={faRedo} /> Regenerate
                </Button>
              </Box>

              <Box sx={verificationStyles.codesGrid}>
                {['A7B9C3D2', 'E5F8G1H4', 'J6K2L9M3', 'N8P4Q7R1', 'S5T0U2V6', 'W3X9Y8Z4', 'B2C5D8E1', 'F7G0H3J9'].map(
                  (code, index) => (
                    <Box key={index} sx={verificationStyles.codeItem}>
                      {code}
                    </Box>
                  )
                )}
              </Box>

              <Stack direction="row" gap={1} sx={{ marginTop: 2 }}>
                <Button variant="outlined" fullWidth startIcon={<FontAwesomeIcon icon={faPrint} />}>
                  Print
                </Button>
                <Button variant="outlined" fullWidth startIcon={<FontAwesomeIcon icon={faDownload} />}>
                  Download
                </Button>
                <Button variant="outlined" fullWidth startIcon={<FontAwesomeIcon icon={faCopy} />}>
                  Copy All
                </Button>
              </Stack>
            </Box>

            <Paper
              sx={[verificationStyles.infoBox]}
              elevation={0}
            >
              <Box sx={verificationStyles.infoTitle}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ color: verificationColors.status.info }} />
                <span>How to Use Backup Codes</span>
              </Box>
              <Typography sx={verificationStyles.infoText}>
                When prompted for MFA during login, select "Use a backup code" and enter one of these codes. Each code works
                only once, and used codes will be automatically removed from your list.
              </Typography>
            </Paper>

            <Stack sx={[verificationStyles.buttonGroup, verificationStyles.buttonGroupStacked]}>
              <Button
                variant="contained"
                startIcon={<FontAwesomeIcon icon={faCheckCircle} />}
                onClick={() => setCurrentState('success')}
                sx={verificationStyles.primaryButton}
              >
                Finish Setup
              </Button>
              <Button
                variant="outlined"
                onClick={() => setCurrentState('success')}
                sx={verificationStyles.secondaryButton}
              >
                I've Saved My Codes, Continue
              </Button>
            </Stack>
          </>
        );

      case 'success':
        return (
          <Box sx={verificationStyles.successState}>
            <Box sx={verificationStyles.successIcon}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </Box>
            <Typography sx={verificationStyles.successTitle}>Multi-Factor Authentication Enabled!</Typography>
            <Typography sx={verificationStyles.successText}>
              Your account is now protected with an extra layer of security. You'll be asked for a verification code during
              your next login.
            </Typography>

            <Stack sx={verificationStyles.buttonGroup}>
              <Button
                variant="contained"
                startIcon={<FontAwesomeIcon icon={faThLarge} />}
                sx={verificationStyles.primaryButton}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faCog} />}
                sx={verificationStyles.secondaryButton}
              >
                Manage MFA Settings
              </Button>
            </Stack>
          </Box>
        );

      case 'loginVerification':
        return (
          <Box sx={verificationStyles.verificationState}>
            <Box sx={verificationStyles.stateHeader}>
              <Typography sx={verificationStyles.stateTitle}>Two-Step Verification Required</Typography>
              <Typography sx={verificationStyles.stateSubtitle}>Enter the verification code from your authenticator app</Typography>
            </Box>

            <Typography sx={verificationStyles.verificationNote}>
              For security, we've sent a verification code to your authentication method.
            </Typography>

            <Box sx={verificationStyles.otpContainer}>
              {loginOtpCodes.map((code, index) => (
                <TextField
                  key={index}
                  id={`otp-login-${index}`}
                  type="text"
                  inputProps={{ maxLength: 1, pattern: '[0-9]', inputMode: 'numeric' }}
                  value={code}
                  onChange={(e) => handleOtpChange(index, e.target.value, true)}
                  size="small"
                  sx={verificationStyles.otpInput}
                />
              ))}
            </Box>


            {otpError && (
              <Paper
                sx={[verificationStyles.infoBox, verificationStyles.infoBoxError]}
                elevation={0}
              >
                <Box sx={verificationStyles.infoTitle}>
                  <FontAwesomeIcon icon={faExclamationCircle} style={{ color: verificationColors.status.error }} />
                  <span>Invalid Code</span>
                </Box>
                <Typography sx={verificationStyles.infoText}>The verification code is incorrect. Please try again.</Typography>
              </Paper>
            )}

            <Box sx={verificationStyles.resendContainer}>
              <Button sx={verificationStyles.linkButton}>
                <FontAwesomeIcon icon={faKey} /> Use a backup code instead
              </Button>
            </Box>

            <Stack sx={[verificationStyles.buttonGroup, verificationStyles.buttonGroupStacked]}>
              <Button
                variant="contained"
                disabled={isLoading}
                startIcon={<FontAwesomeIcon icon={isLoading ? faSpinner : faSignInAlt} />}
                onClick={handleVerifyLogin}
                sx={verificationStyles.primaryButton}
              >
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faSyncAlt} />}
                sx={verificationStyles.secondaryButton}
              >
                Try a Different Method
              </Button>
              <Button sx={verificationStyles.linkButton}>
                <FontAwesomeIcon icon={faTimes} /> Cancel and return to login
              </Button>
            </Stack>
          </Box>
        );

      default:
        return null;
    }
  };

  // Main render - final return
  return (
    <Box sx={verificationStyles.container}>
      {/* Left Panel - Security Info */}
      <Box sx={verificationStyles.leftPanel}>
        <Box sx={verificationStyles.leftPanelContent}>
          <Box sx={verificationStyles.logoContainer}>
            <Box sx={verificationStyles.logoIcon}>
              <FontAwesomeIcon icon={faGraduationCap} />
            </Box>
            <Typography sx={verificationStyles.logoText}>TASC LMS</Typography>
          </Box>

          <Typography sx={verificationStyles.tagline}>Enhanced Account Security</Typography>

          <Box sx={verificationStyles.benefitsContainer}>
            <BenefitItem
              icon={<FontAwesomeIcon icon={faShieldAlt} />}
              title="99.9% More Secure"
              description="MFA prevents 99.9% of automated attacks on your account"
            />
            <BenefitItem
              icon={<FontAwesomeIcon icon={faUserShield} />}
              title="Protect Sensitive Data"
              description="Keep your learning progress and certificates secure"
            />
            <BenefitItem
              icon={<FontAwesomeIcon icon={faMobileAlt} />}
              title="Easy to Use"
              description="Simple verification with your smartphone or email"
            />
          </Box>

          <Paper sx={verificationStyles.statistics} elevation={0}>
            <Typography sx={verificationStyles.statisticsTitle}>MFA Adoption Statistics</Typography>
            <Box sx={verificationStyles.statisticsGrid}>
              <Box sx={verificationStyles.statItem}>
                <Typography sx={verificationStyles.statValue}>87%</Typography>
                <Typography sx={verificationStyles.statLabel}>Users Enabled</Typography>
              </Box>
              <Box sx={verificationStyles.statItem}>
                <Typography sx={verificationStyles.statValue}>99.9%</Typography>
                <Typography sx={verificationStyles.statLabel}>Attack Prevention</Typography>
              </Box>
              <Box sx={verificationStyles.statItem}>
                <Typography sx={verificationStyles.statValue}>4.2s</Typography>
                <Typography sx={verificationStyles.statLabel}>Avg. Verify Time</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Typography sx={verificationStyles.copyright}>
          © 2025 TASC Learning Management System. All rights reserved.
        </Typography>
      </Box>

      {/* Right Panel */}
      <Box sx={verificationStyles.rightPanel}>
        <Box sx={verificationStyles.content}>{renderState()}</Box>
      </Box>
    </Box>
  );
};

export default VerificationPage;