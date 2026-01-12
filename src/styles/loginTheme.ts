// styles/loginTheme.ts
// Orange theme configuration for login page

export const loginColors = {
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
  },
  social: {
    google: '#ea4335',
    microsoft: '#00a4ef',
    linkedin: '#0077b5',
  }
};

export const loginSpacing = {
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
export const fontSizing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '0.875 rem',
  5: '1rem',
  6: '1.25rem',
  7: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
}

export const loginStyles = {
  // Container styles
  loginContainer: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: { xs: 'column', lg: 'row' },
  },

  // Left panel (branding)
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, rgba(255, 164, 36, 0.1) 0%, rgba(255, 183, 77, 0.05) 100%)',
    display: { xs: 'none', lg: 'flex' },
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
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
    gap: 2,
    marginBottom: loginSpacing[8]
  },

  logoIcon: {
    fontSize: '3rem',
    color: loginColors.primary[600],
  },

  logoText: {
    fontSize: '2rem',
    fontWeight: 700,
    color: loginColors.neutral[800],
  },
  // login features flex container
  featureContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: loginSpacing[6],
    marginBottom: loginSpacing[16]
  },
  // panel card custom styling
  featureTitle: {
    fontSize: fontSizing[4],
    fontWeight: 600,
    color: loginColors.neutral[800],
    marginBottom: loginSpacing[1],
},

  // Tagline
  tagline: {
    fontSize: '1.25rem',
    color: loginColors.neutral[700],
    marginBottom: loginSpacing[6],
    fontWeight: 600,
  },

  // Feature items
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: loginSpacing[4],
    padding: loginSpacing[4],
    backgroundColor: 'white',
    borderRadius: loginSpacing[4],
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    border: `1px solid ${loginColors.neutral[200]}`,
    mb: 3,
  },

  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: loginColors.primary[500],
    color: 'white',
    borderRadius: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    flexShrink: 0,
  },

  featureText: {
    color: loginColors.neutral[500],
    fontSize: fontSizing[4]
  },

  // Right panel (form)
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: { xs: 2, sm: 4, lg: 4 },
    backgroundColor: 'white',
  },

  formContainer: {
    width: '100%',
    maxWidth: '400px',
  },

  formHeader: {
    textAlign: 'center',
    marginBottom: loginSpacing[8]
  },

  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: loginColors.neutral[800],
    mb: 1,
  },

  formSubtitle: {
    color: loginColors.neutral[500],
    fontSize: '1rem',
  },

  // Form inputs
  inputField: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      fontSize: '1rem',
      '&:hover fieldset': {
        borderColor: loginColors.primary[500],
      },
      '&.Mui-focused fieldset': {
        borderColor: loginColors.primary[500],
        boxShadow: `0 0 0 3px rgba(255, 183, 77, 0.1)`,
      },
    },
    '& .MuiOutlinedInput-input::placeholder': {
      color: loginColors.neutral[400],
      opacity: 1,
    },
    '& .MuiFormHelperText-root.Mui-error': {
      color: loginColors.status.error,
      marginTop: '4px',
      fontSize: '0.75rem',
    },
  },

  // 
  socialBtnContainer:{
    display: 'flex',
    flexDirection: 'column',
    gap: loginSpacing[3]
  },
  // Buttons
  primaryButton: {
    backgroundColor: loginColors.primary[600],
    color: 'white',
    fontWeight: 600,
    padding: '12px 24px',
    textTransform: 'none' as const,
    fontSize: '1rem',
    borderRadius: 1,
    '&:hover': {
      backgroundColor: '#e59420',
    },
    '&:disabled': {
      backgroundColor: loginColors.neutral[300],
    },
  },

  socialButton: {
    borderColor: loginColors.neutral[300],
    color: loginColors.neutral[700],
    fontWeight: 500,
    textTransform: 'none' as const,
    padding: '10px 16px',
    justifyContent: 'center',
    // putting icon and text in the center with gap
    gap: 2,
    '&:hover': {
      backgroundColor: loginColors.neutral[50],
      transform: 'translateY(-1px)',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
  },

  googleButton: {
    borderColor: loginColors.social.google,
    '&:hover': {
      backgroundColor: 'rgba(234, 67, 53, 0.04)',
    },
  },

  microsoftButton: {
    borderColor: loginColors.social.microsoft,
    '&:hover': {
      backgroundColor: 'rgba(0, 164, 239, 0.04)',
    },
  },

  linkedinButton: {
    borderColor: loginColors.social.linkedin,
    '&:hover': {
      backgroundColor: 'rgba(0, 119, 181, 0.04)',
    },
  },

  // Links
  link: {
    color: loginColors.primary[600],
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
      color: loginColors.accent[500],
    },
  },

  // MFA Section
  mfaSection: {
    mt: 2,
    padding: 2,
    backgroundColor: loginColors.neutral[50],
    borderRadius: 1,
    border: `1px solid ${loginColors.neutral[200]}`,
  },

  mfaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 2,
  },

  mfaInputContainer: {
    display: 'flex',
    gap: { xs: 1, sm: 2 },
    justifyContent: 'center',
    my: 2,
  },

  mfaInput: {
    width: { xs: 40, sm: 45 },
    height: { xs: 50, sm: 55 },
    '& .MuiOutlinedInput-root': {
      textAlign: 'center',
      fontSize: '1.25rem',
      fontWeight: 600,
      '&:hover fieldset': {
        borderColor: loginColors.primary[500],
      },
      '&.Mui-focused fieldset': {
        borderColor: loginColors.primary[500],
        boxShadow: `0 0 0 3px rgba(255, 183, 77, 0.1)`,
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px',
      textAlign: 'center',
    },
  },

  // Divider
  divider: {
    my: 3,
    color: loginColors.neutral[400],
    fontSize: '0.875rem',
    '&::before, &::after': {
      borderColor: loginColors.neutral[300],
    },
  },

  // Copyright
  copyright: {
    fontSize: '0.875rem',
    color: loginColors.neutral[500],
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    textAlign: 'center',
  },

  // Sign up section
  signupSection: {
    textAlign: 'center',
    mt: 4,
    pt: 3,
    borderTop: `1px solid ${loginColors.neutral[200]}`,
    color: loginColors.neutral[600],
    fontSize: '0.875rem',
  },

  // Remember/Forgot row
  rememberForgot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mt: 1,
  },

  // Responsive breakpoints
  responsive: {
    hideOnMobile: {
      display: { xs: 'none', lg: 'flex' },
    },
    mobileContainer: {
      flexDirection: { xs: 'column', lg: 'row' },
    },
  },
};

// MUI Theme overrides for login page
export const loginThemeOverrides = {
  palette: {
    primary: {
      main: loginColors.primary[600],
      light: loginColors.primary[500],
      dark: '#e59420',
    },
    secondary: {
      main: loginColors.accent[500],
    },
    error: {
      main: loginColors.status.error,
    },
    success: {
      main: loginColors.status.success,
    },
    warning: {
      main: loginColors.status.warning,
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: loginColors.neutral[400],
          '&.Mui-checked': {
            color: loginColors.primary[600],
          },
        },
      },
    },
  },
};