import { globalBorderRadius, globalColors, globalFontSizes, globalShadows, globalSpacing } from "./globaltheme";


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

export const verificationSpacing = {
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

export const verificationFont = {
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
export const verificationRadius = {
    sm: globalBorderRadius.sm,
    base: globalBorderRadius.base,
    md: globalBorderRadius.md,
    lg: globalBorderRadius.lg,
    xl: globalBorderRadius.xl
};

export const verificationShadow = {
  shadow: {
    sm: globalShadows.sm,
    base: globalShadows.base,
    md: globalShadows.md,
    lg: globalShadows.lg,
    xl: globalShadows.xl
  }
}
