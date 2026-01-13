// styles/verificationTheme.ts
// Verification/MFA setup page theme - Orange theme


export const verificationColors = {
  primary: {
    600: '#ffa424',
    500: '#ffb74d',
    400: '#ffcc80',
  },
  accent: {
    500: '#f97316',
    400: '#fb923c',
  },
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

export const verificationSpacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
};

export const verificationFont = {
  sizing: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xl2: '1.5rem',
    xl3: '1.875rem',
    xl4: '2.25rem'
}
}
export const verificationRadius = {
    sm: '0.25rem',
    base: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem'
};

export const verificationShadow = {
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
}

export const verificationStyles = {
  // Container
  container: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: { xs: 'column', lg: 'row' },
  },

  // Left panel
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, rgba(255, 164, 36, 0.1) 0%, rgba(255, 183, 77, 0.05) 100%)',
    display: { xs: 'none', lg: 'flex' },
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: verificationSpacing[4],
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      right: '-20%',
      width: '600px',
      height: '600px',
      background: 'linear-gradient(135deg, rgba(255, 164, 36, 0.15) 0%, rgba(255, 183, 77, 0.08) 100%)',
      borderRadius: '50%',
      zIndex: 0,
    },
  },

  leftPanelContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '500px',
    textAlign: 'center',
  },

  // Logo
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: verificationSpacing[4],
    marginBottom: verificationSpacing[8],
  },

  logoIcon: {
    fontSize: '2.25rem',
    color: verificationColors.primary[600],
  },

  logoText: {
    fontSize: verificationFont.sizing.xl3,
    fontWeight: 700,
    color: verificationColors.neutral[800],
  },

  // Security content
  tagline: {
    fontSize: verificationFont.sizing.xl,
    color: verificationColors.neutral[700],
    marginBottom: verificationSpacing[6],
    fontWeight: 600,
  },

  benefitsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: verificationSpacing[6],
    marginBottom: verificationSpacing[12],
  },

  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: verificationSpacing[4],
    padding: verificationSpacing[4],
    backgroundColor: 'white',
    borderRadius: verificationRadius.lg,
    boxShadow: verificationShadow.shadow.sm,
    border: `1px solid ${verificationColors.neutral[200]}`,
    textAlign: 'left',
  },

  benefitIcon: {
    width: 48,
    height: 48,
    backgroundColor: verificationColors.primary[500],
    color: 'white',
    borderRadius: verificationRadius.base,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: verificationFont.sizing.lg,
    flexShrink: 0,
  },

  benefitText: {
    color: verificationColors.neutral[500],
    fontSize: verificationFont.sizing.sm,
  },

  benefitTitle: {
    fontSize: verificationFont.sizing.base,
    fontWeight: 600,
    color: verificationColors.neutral[800],
    marginBottom: verificationSpacing[1],
  },

  // Statistics
  statistics: {
    background: 'white',
    padding: verificationSpacing[6],
    borderRadius: verificationRadius.lg,
    boxShadow: verificationShadow.shadow.sm,
    border: `1px solid ${verificationColors.neutral[200]}`,
    textAlign: 'center',
  },

  statisticsTitle: {
    fontWeight: 600,
    color: verificationColors.neutral[800],
    marginBottom: verificationSpacing[4],
  },

  statisticsGrid: {
    display: 'flex',
    justifyContent: 'space-around',
  },

  statItem: {
    display: 'flex',
    flexDirection: 'column',
  },

  statValue: {
    fontSize: verificationFont.sizing.xl2,
    fontWeight: 700,
    color: verificationColors.primary[600],
  },

  statLabel: {
    fontSize: verificationFont.sizing.xs,
    color: verificationColors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  copyright: {
    fontSize: '0.875rem',
    color: verificationColors.neutral[500],
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    textAlign: 'center',
  },

  // Right panel
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: { xs: 2, sm: 4, lg: 4 },
    backgroundColor: 'white',
    overflowY: 'auto',
  },

  content: {
    width: '100%',
    maxWidth: '500px',
  },
// 

  // State styles
  state: {
    display: 'none',
    animation: 'fadeIn 0.5s ease',
    '&.active': {
      display: 'block',
    },
  },

  // State header
  stateHeader: {
    textAlign: 'center',
    marginBottom: 4,
  },

  stateTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: verificationColors.neutral[800],
    marginBottom: 0.5,
  },

  stateSubtitle: {
    color: verificationColors.neutral[500],
    fontSize: '1rem',
  },

  // Method selection
  methodSelection: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(180px, 1fr))' },
    gap: verificationSpacing[4],
    margin: '2rem 0',
  },

  methodCard: {
    padding: verificationSpacing[6],
    border: `2px solid ${verificationColors.neutral[200]}`,
    borderRadius: 1,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '&:hover': {
      borderColor: verificationColors.primary[400],
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    '&.selected': {
      borderColor: verificationColors.primary[600],
      backgroundColor: `rgba(255, 164, 36, 0.05)`,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
  },

  methodIcon: {
    fontSize: verificationFont.sizing.xl3,
    color: verificationColors.primary[500],
    marginBottom: verificationSpacing[4],
    width: 64,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `rgba(255, 164, 36, 0.1)`,
    borderRadius: '50%',
  },

  methodName: {
    fontWeight: 600,
    color: verificationColors.neutral[800],
    marginBottom: verificationSpacing[2],
  },

  methodDescription: {
    fontSize: verificationFont.sizing.sm,
    color: verificationColors.neutral[500],
    marginBottom: verificationSpacing[4],
  },

  methodBadge: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.75rem',
    borderRadius: 999,
    fontWeight: 500,
    marginTop: 'auto',
  },

  badgeRecommended: {
    backgroundColor: `rgba(16, 185, 129, 0.1)`,
    color: verificationColors.status.success,
  },

  badgeBasic: {
    backgroundColor: `rgba(255, 164, 36, 0.1)`,
    color: verificationColors.primary[600],
  },

  // QR Section
  qrSection: {
    textAlign: 'center',
    margin: '2rem 0',
  },

  qrContainer: {
    display: 'inline-block',
    padding: 1,
    background: 'white',
    borderRadius: 1,
    border: `1px solid ${verificationColors.neutral[200]}`,
    marginBottom: 2,
    position: 'relative',
  },

  qrCode: {
    width: 200,
    height: 200,
    background: 'linear-gradient(45deg, #f4f4f5, #e4e4e7)',
    borderRadius: 0.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: verificationColors.neutral[500],
    fontSize: '0.875rem',
    flexDirection: 'column',
  },

  qrRefresh: {
    position: 'absolute',
    top: 0.5,
    right: 0.5,
    background: 'white',
    border: `1px solid ${verificationColors.neutral[300]}`,
    borderRadius: 0.5,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: verificationColors.neutral[600],
    transition: 'all 0.2s',
    '&:hover': {
      background: verificationColors.neutral[50],
      color: verificationColors.neutral[800],
    },
  },

  secretKey: {
    backgroundColor: verificationColors.neutral[50],
    border: `1px solid ${verificationColors.neutral[200]}`,
    borderRadius: 0.5,
    padding: 2,
    margin: '2rem 0',
    fontFamily: "'Monaco', 'Courier New', monospace",
    fontSize: '1.125rem',
    letterSpacing: '1px',
    textAlign: 'center',
    wordBreak: 'break-all',
    position: 'relative',
    color: verificationColors.neutral[800],
  },

  copySecretBtn: {
    position: 'absolute',
    top: 0.5,
    right: 0.5,
    background: verificationColors.primary[600],
    color: 'white',
    border: 'none',
    borderRadius: 0.25,
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
    '&:hover': {
      background: '#e59420',
    },
  },

  // Setup instructions
  setupInstructions: {
    backgroundColor: verificationColors.neutral[50],
    borderRadius: 0.5,
    padding: 3,
    margin: '2rem 0',
  },

  instructionStep: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 2,
    marginBottom: 2,
    paddingBottom: 2,
    borderBottom: `1px solid ${verificationColors.neutral[200]}`,
    '&:last-child': {
      borderBottom: 'none',
      marginBottom: 0,
      paddingBottom: 0,
    },
  },

  stepNumber: {
    width: 28,
    height: 28,
    backgroundColor: verificationColors.primary[500],
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '0.875rem',
    flexShrink: 0,
    marginTop: '2px',
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: verificationColors.neutral[800],
    marginBottom: 0.25,
  },

  stepText: {
    fontSize: '0.875rem',
    color: verificationColors.neutral[600],
  },

  // OTP Input
  otpContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: { xs: 0.5, sm: 1 },
    margin: '2rem 0',
  },

  otpInput: {
    width: { xs: 40, sm: 55 },
    height: { xs: 50, sm: 65 },
    textAlign: 'center',
    fontSize: { xs: '1.125rem', sm: '1.5rem' },
    fontWeight: 600,
    border: `2px solid ${verificationColors.neutral[300]}`,
    borderRadius: 0.5,
    background: 'white',
    transition: 'all 0.2s',
    '&:focus': {
      borderColor: verificationColors.primary[500],
      boxShadow: `0 0 0 3px rgba(255, 183, 77, 0.1)`,
      outline: 'none',
    },
    '&.filled': {
      borderColor: verificationColors.primary[500],
      backgroundColor: `rgba(255, 164, 36, 0.05)`,
    },
    '&.error': {
      borderColor: verificationColors.status.error,
      animation: 'shake 0.5s',
    },
  },

  // Backup codes
  backupCodes: {
    backgroundColor: verificationColors.neutral[50],
    border: `1px solid ${verificationColors.neutral[200]}`,
    borderRadius: 0.5,
    padding: 3,
    margin: '2rem 0',
  },

  backupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },

  backupTitle: {
    fontWeight: 600,
    color: verificationColors.neutral[800],
  },

  codesGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
    gap: 1,
    margin: '1rem 0',
    fontFamily: "'Monaco', 'Courier New', monospace",
  },

  codeItem: {
    padding: 1,
    background: 'white',
    border: `1px solid ${verificationColors.neutral[300]}`,
    borderRadius: 0.25,
    textAlign: 'center',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: verificationColors.neutral[800],
  },

  // Info boxes
  infoBox: {
    padding: 2,
    backgroundColor: verificationColors.neutral[50],
    borderRadius: 0.5,
    borderLeft: `4px solid ${verificationColors.status.info}`,
    margin: '2rem 0',
    textAlign: 'left',
  },

  infoBoxWarning: {
    borderLeftColor: verificationColors.status.warning,
    backgroundColor: `rgba(245, 158, 11, 0.05)`,
  },

  infoBoxSuccess: {
    borderLeftColor: verificationColors.status.success,
    backgroundColor: `rgba(16, 185, 129, 0.05)`,
  },

  infoBoxError: {
    borderLeftColor: verificationColors.status.error,
    backgroundColor: `rgba(239, 68, 68, 0.05)`,
  },

  infoTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    fontWeight: 600,
    color: verificationColors.neutral[700],
    marginBottom: 0.5,
  },

  infoIcon: {
    fontSize: '1.125rem',
  },

  infoText: {
    fontSize: '0.875rem',
    color: verificationColors.neutral[600],
  },

  // Buttons
  primaryButton: {
    backgroundColor: verificationColors.primary[600],
    color: 'white',
    fontWeight: 600,
    padding: '0.75rem 2rem',
    textTransform: 'none' as const,
    fontSize: '1rem',
    borderRadius: 0.5,
    '&:hover': {
      backgroundColor: '#e59420',
    },
    '&:disabled': {
      backgroundColor: verificationColors.neutral[300],
    },
  },

  secondaryButton: {
    backgroundColor: 'white',
    color: verificationColors.neutral[700],
    fontWeight: 600,
    padding: '0.75rem 2rem',
    textTransform: 'none' as const,
    fontSize: '1rem',
    borderRadius: 0.5,
    border: `1px solid ${verificationColors.neutral[300]}`,
    '&:hover': {
      backgroundColor: verificationColors.neutral[50],
    },
  },

  linkButton: {
    background: 'none',
    border: 'none',
    color: verificationColors.primary[600],
    textDecoration: 'none',
    fontWeight: 500,
    padding: 0,
    fontSize: '0.875rem',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  // Button group
  buttonGroup: {
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
    marginTop: 4,
  },

  buttonGroupStacked: {
    flexDirection: 'column',
    gap: 1,
  },

  // Success state
  successState: {
    textAlign: 'center',
    padding: '6rem 0',
  },

  successIcon: {
    fontSize: '2.25rem',
    color: verificationColors.status.success,
    marginBottom: 2,
  },

  successTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: verificationColors.neutral[800],
    marginBottom: 1,
  },

  successText: {
    color: verificationColors.neutral[500],
    marginBottom: 2,
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  // Verification state (Login)
  verificationState: {
    textAlign: 'center',
  },

  verificationNote: {
    fontSize: '0.875rem',
    color: verificationColors.neutral[500],
    marginBottom: 2,
  },

  resendContainer: {
    textAlign: 'center',
    margin: '2rem 0',
  },

  resendTimer: {
    fontWeight: 600,
    color: verificationColors.primary[600],
  },
};
