import { globalBorderRadius, globalColors, globalFonts, globalFontSizes, globalShadows, globalSpacing } from "./globaltheme";


export const resetColors = {
  primary: {
    600: globalColors.primary[600],
    500: globalColors.primary[500],
    400: globalColors.primary[400],
  },
  accent: {
    500: globalColors.accent[500],
    400: globalColors.accent[400],
  },
  neutral: {
    50: globalColors.neutral[50],
    100: globalColors.neutral[100],
    200: globalColors.neutral[200],
    300: globalColors.neutral[300],
    400: globalColors.neutral[400],
    500: globalColors.neutral[500],
    600: globalColors.neutral[600],
    700: globalColors.neutral[700],
    800: globalColors.neutral[800],
    900: globalColors.neutral[900],
  },
  status: {
    success: globalColors.status.success,
    warning: globalColors.status.warning,
    error: globalColors.status.error,
    info: globalColors.status.info,
  },
};

export const resetSpacing = {
  1: globalSpacing[0],
  2: globalSpacing[1],
  3: globalSpacing[2],
  4: globalSpacing[3],
  5: globalSpacing[4],
  6: globalSpacing[5],
  8: globalSpacing[6],
  10: globalSpacing[7],
  12: globalSpacing[8],
  16: globalSpacing[9],
};

export const resetFont = {
  sizing: {
    xs: globalFontSizes.xs,
    sm: globalFontSizes.sm,
    base: globalFontSizes.md,
    lg: globalFontSizes.lg,
    xl: globalFontSizes.xl,
    xl2: globalFontSizes['2xl'],
    xl3: globalFontSizes['3xl'],
    xl4: globalFontSizes['4xl']
}
}
export const resetRadius = {
    sm: globalBorderRadius.sm,
    base: globalBorderRadius.base,
    md: globalBorderRadius.md,
    lg: globalBorderRadius.lg,
    xl: globalBorderRadius.xl
};

export const resetShadow = {
  shadow: {
    sm: globalShadows.sm,
    base: globalShadows.base,
    md: globalShadows.md,
    lg: globalShadows.lg,
    xl: globalShadows.xl
  }
}
export const resetBreakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const passwordResetStyles = {
  resetContainer: {
    display: 'flex',
    minHeight: '100vh',
  },
  resetLeft: {
    flex: 1,
    background: 'linear-gradient(135deg, rgba(255, 164, 36, 0.1) 0%, rgba(255, 183, 77, 0.05) 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: resetSpacing[8],
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

  resetLeftContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '500px',
    textAlign: 'center',
  },

  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: resetSpacing[4],
    marginBottom: resetSpacing[8],
  },

  logoIcon: {
    fontSize: globalFontSizes["4xl"],
    color: resetColors.primary[600],
  },

  logoText: {
    fontSize: globalFontSizes["3xl"],
    fontWeight: 700,
    color: resetColors.neutral[800],
  },

  securityTagline: {
    fontSize: globalFontSizes.xl,
    color: resetColors.neutral[700],
    marginBottom: resetSpacing[6],
    fontWeight: 600,
  },

  securityTips: {
    display: 'flex',
    flexDirection: 'column',
    gap: resetSpacing[6],
    marginBottom: resetSpacing[12],
  },

  tipItem: {
    display: 'flex',
    alignItems: 'center',
    gap: resetSpacing[4],
    padding: resetSpacing[4],
    background: 'white',
    borderRadius: resetRadius.lg,
    boxShadow: resetShadow.shadow.sm,
    border: `1px solid ${resetColors.neutral[200]}`,
    textAlign: 'left',
  },

  tipIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: resetColors.primary[500],
    color: 'white',
    borderRadius: resetRadius.base,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: resetFont.sizing.lg,
    flexShrink: 0,
  },

  tipTextH4: {
    fontSize: resetFont.sizing.base,
    fontWeight: 600,
    color: resetColors.neutral[800],
    marginBottom: resetSpacing[1],
  },

  tipTextP: {
    fontSize: resetFont.sizing.sm,
    color: resetColors.neutral[500],
  },

  securityStats: {
    background: 'white',
    padding: resetSpacing[6],
    borderRadius: resetRadius.lg,
    boxShadow: resetShadow.shadow.sm,
    border: `1px solid ${resetColors.neutral[200]}`,
  },

  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${resetSpacing[3]} 0`,
    borderBottom: `1px solid ${resetColors.neutral[200]}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },

  statLabel: {
    fontSize: resetFont.sizing.sm,
    color: resetColors.neutral[600],
  },

  statValue: {
    fontWeight: 600,
    color: resetColors.neutral[800],
  },

  copyright: {
    fontSize: resetFont.sizing.sm,
    color: resetColors.neutral[500],
    position: 'absolute',
    bottom: resetSpacing[6],
    left: 0,
    right: 0,
    textAlign: 'center',
  },

  // Right Panel
  resetRight: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: resetSpacing[8],
    background: 'white',
    overflowY: 'auto',
  },

  resetFormContainer: {
    width: '100%',
    maxWidth: '450px',
  },

  // Form Header
  formHeader: {
    textAlign: 'center',
    marginBottom: resetSpacing[8],
  },

  formHeaderH1: {
    fontSize: resetFont.sizing.xl2,
    fontWeight: 700,
    color: resetColors.neutral[800],
    marginBottom: resetSpacing[2],
  },

  formHeaderP: {
    color: resetColors.neutral[500],
    fontSize: resetFont.sizing.base,
  },

  // Form
  resetForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: resetSpacing[6],
  },

  formStep: {
    display: 'none',
    animation: 'fadeIn 0.3s ease',
    '&.active': {
      display: 'block',
    },
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: resetSpacing[2],
    marginBottom: resetSpacing[4],
  },

  formLabel: {
    fontSize: resetFont.sizing.sm,
    fontWeight: 500,
    color: resetColors.neutral[700],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  required: {
    color: resetColors.status.error,
  },

  formInput: {
    padding: `${resetSpacing[3]} ${resetSpacing[4]}`,
    border: `1px solid ${resetColors.neutral[300]}`,
    borderRadius: resetRadius.base,
    fontSize: resetFont.sizing.base,
    transition: 'all 0.2s',
    fontFamily: globalFonts.fontFamily,   //pickeed this straight from globalFonts
    width: '100%',
    '&:focus': {
      outline: 'none',
      borderColor: resetColors.primary[500],
      boxShadow: '0 0 0 3px rgba(255, 183, 77, 0.1)',
    },
    '&.error': {
      borderColor: resetColors.status.error,
    },
  },

  passwordInputContainer: {
    position: 'relative',
  },

  passwordToggle: {
    position: 'absolute',
    right: resetSpacing[3],
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: resetColors.neutral[500],
    cursor: 'pointer',
    padding: resetSpacing[1],
    fontSize: resetFont.sizing.sm,
  },

  passwordStrength: {
    marginTop: resetSpacing[2],
  },

  strengthMeter: {
    height: '4px',
    backgroundColor: resetColors.neutral[200],
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: resetSpacing[2],
  },

  strengthFill: {
    height: '100%',
    width: '0%',
    transition: 'all 0.3s',
    borderRadius: '2px',
    '&.weak': {
      width: '33%',
      backgroundColor: resetColors.status.error,
    },
    '&.fair': {
      width: '66%',
      backgroundColor: resetColors.status.warning,
    },
    '&.strong': {
      width: '100%',
      backgroundColor: resetColors.status.success,
    },
  },

  strengthText: {
    fontSize: resetFont.sizing.xs,
    color: resetColors.neutral[500],
  },

  errorMessage: {
    color: resetColors.status.error,
    fontSize: resetFont.sizing.sm,
    marginTop: resetSpacing[1],
    display: 'none',
    '&.show': {
      display: 'block',
    },
  },

  successMessage: {
    color: resetColors.status.success,
    fontSize: resetFont.sizing.sm,
    marginTop: resetSpacing[1],
    display: 'none',
    '&.show': {
      display: 'block',
    },
  },

  // OTP
  otpContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: resetSpacing[3],
    margin: `${resetSpacing[4]} 0 ${resetSpacing[6]}`,
  },

  otpInput: {
    width: '50px',
    height: '60px',
    textAlign: 'center',
    fontSize: globalFontSizes.xl,
    fontWeight: 600,
    border: `2px solid ${resetColors.neutral[300]}`,
    borderRadius: resetRadius.base,
    background: 'white',
    transition: 'all 0.2s',
    '&:focus': {
      borderColor: resetColors.primary[500],
      boxShadow: '0 0 0 3px rgba(255, 183, 77, 0.1)',
      outline: 'none',
    },
    '&.filled': {
      borderColor: resetColors.primary[500],
      backgroundColor: 'rgba(255, 164, 36, 0.05)',
    },
  },

  // Info Boxes
  infoBox: {
    padding: resetSpacing[4],
    backgroundColor: resetColors.neutral[50],
    borderRadius: resetRadius.base,
    borderLeft: `4px solid ${resetColors.primary[500]}`,
    marginBottom: resetSpacing[4],
    '&.warning': {
      borderLeftColor: resetColors.status.warning,
      backgroundColor: 'rgba(245, 158, 11, 0.05)',
    },
    '&.success': {
      borderLeftColor: resetColors.status.success,
      backgroundColor: 'rgba(16, 185, 129, 0.05)',
    },
  },

  infoTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: resetSpacing[2],
    fontWeight: 600,
    color: resetColors.neutral[700],
    marginBottom: resetSpacing[2],
  },

  infoIcon: {
    fontSize: resetFont.sizing.lg,
  },

  infoText: {
    fontSize: resetFont.sizing.sm,
    color: resetColors.neutral[600],
  },

  // Buttons
  btn: {
    padding: `${resetSpacing[3]} ${resetSpacing[6]}`,
    borderRadius: resetRadius.base,
    fontSize: resetFont.sizing.base,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: resetSpacing[2],
    fontFamily: globalFonts.fontFamily,
  },

  btnPrimary: {
    backgroundColor: resetColors.primary[600],
    color: 'white',
    width: '100%',
    padding: resetSpacing[4],
    '&:hover': {
      backgroundColor: '#e59420',
    },
    '&:disabled': {
      backgroundColor: resetColors.neutral[300],
      cursor: 'not-allowed',
    },
  },

  btnSecondary: {
    backgroundColor: 'white',
    color: resetColors.neutral[700],
    border: `1px solid ${resetColors.neutral[300]}`,
    width: '100%',
    '&:hover': {
      backgroundColor: resetColors.neutral[50],
    },
  },

  btnLink: {
    background: 'none',
    border: 'none',
    color: resetColors.primary[600],
    textDecoration: 'none',
    fontWeight: 500,
    padding: 0,
    fontSize: resetFont.sizing.sm,
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  formNavigation: {
    display: 'flex',
    gap: resetSpacing[3],
    marginTop: resetSpacing[6],
  },

  // Resend Timer
  resendContainer: {
    textAlign: 'center',
    margin: `${resetSpacing[4]} 0`,
  },

  resendTimer: {
    fontWeight: 600,
    color: resetColors.primary[600],
  },

  // Success State
  successState: {
    textAlign: 'center',
    padding: `${resetSpacing[6]} 0`,
    display: 'none',
    '&.show': {
      display: 'block',
      animation: 'fadeIn 0.5s ease',
    },
  },

  successIcon: {
    fontSize: globalFontSizes["4xl"],
    color: resetColors.status.success,
    marginBottom: resetSpacing[6],
  },

  successTitle: {
    fontSize: globalFontSizes.xl,
    fontWeight: 700,
    color: resetColors.neutral[800],
    marginBottom: resetSpacing[3],
  },

  successText: {
    color: resetColors.neutral[500],
    marginBottom: resetSpacing[6],
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  // Login Link
  loginLink: {
    textAlign: 'center',
    marginTop: resetSpacing[8],
    paddingTop: resetSpacing[6],
    borderTop: `1px solid ${resetColors.neutral[200]}`,
    color: resetColors.neutral[600],
    fontSize: resetFont.sizing.sm,
    '& a': {
      color: resetColors.primary[600],
      textDecoration: 'none',
      fontWeight: 600,
      marginLeft: resetSpacing[2],
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },

  // Responsive
  '@media (max-width: 1024px)': {
    resetContainer: {
      flexDirection: 'column',
    },
    resetLeft: {
      padding: resetSpacing[6],
      display: 'none',
    },
    resetRight: {
      padding: resetSpacing[6],
    },
  },

  '@media (max-width: 640px)': {
    otpContainer: {
      gap: resetSpacing[2],
    },
    otpInput: {
      width: '40px',
      height: '50px',
      fontSize: resetFont.sizing.lg,
    },
    formNavigation: {
      flexDirection: 'column',
    },
    btn: {
      width: '100%',
    },
  },

  '@media (max-width: 480px)': {
    resetFormContainer: {
      padding: resetSpacing[4],
    },
    otpContainer: {
      gap: resetSpacing[1],
    },
    otpInput: {
      width: '35px',
      height: '45px',
    },
  },
}
