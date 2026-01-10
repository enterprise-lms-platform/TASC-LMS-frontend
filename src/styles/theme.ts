// styles/theme.ts
// Centralized style configuration for TASC LMS

export const colors = {
  primary: {
    main: '#667eea',
    dark: '#764ba2',
    light: '#8b9ce8',
  },
  secondary: {
    main: '#f093fb',
    dark: '#f5576c',
  },
  success: {
    main: '#4caf50',
  },
  warning: {
    main: '#ff9800',
  },
  gradients: {
    hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    card1: '#667eea',
    card2: '#f093fb',
    card3: '#4facfe',
  }
};

export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const typography = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h1: {
    fontSize: { xs: '2rem', md: '3.5rem' },
    fontWeight: 800,
  },
  h2: {
    fontSize: { xs: '1.75rem', md: '3rem' },
    fontWeight: 700,
  },
  h3: {
    fontSize: { xs: '2rem', md: '2.5rem' },
    fontWeight: 700,
  },
  h4: {
    fontSize: { xs: '1.5rem', md: '2rem' },
    fontWeight: 700,
  },
  h5: {
    fontSize: { xs: '1.25rem', md: '1.5rem' },
    fontWeight: 600,
  },
  h6: {
    fontSize: { xs: '1rem', md: '1.125rem' },
    fontWeight: 600,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
};

// Reusable component styles
export const componentStyles = {
  // Hero Section
  hero: {
    background: colors.gradients.hero,
    color: 'white',
    py: { xs: 8, md: 12 },
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    }
  },

  // Section Titles
  sectionTitle: {
    fontWeight: 700,
    mb: 2,
    fontSize: { xs: '2rem', md: '2.5rem' },
    textAlign: 'center',
  },

  sectionSubtitle: {
    color: 'text.secondary',
    mb: 6,
    fontSize: { xs: '1rem', md: '1.125rem' },
    textAlign: 'center',
  },

  // Cards
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
    }
  },

  categoryCard: {
    p: 4,
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: 2,
    transition: 'all 0.3s ease',
    border: '1px solid',
    borderColor: 'divider',
    '&:hover': {
      backgroundColor: 'primary.main',
      color: 'white',
      transform: 'scale(1.05)',
      borderColor: 'primary.main',
      '& .MuiTypography-root': {
        color: 'white',
      },
      '& .category-icon': {
        color: 'white',
      }
    }
  },

  featureBox: {
    textAlign: 'center',
    p: 3,
  },

  // Icons
  featureIcon: {
    fontSize: 48,
    color: 'primary.main',
    mb: 2,
  },

  categoryIcon: {
    fontSize: 40,
    color: 'primary.main',
    mb: 1,
  },

  // Buttons
  primaryButton: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    px: 4,
    py: 1.5,
    borderRadius: 2,
    boxShadow: 'none',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    }
  },

  outlineButton: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    px: 4,
    py: 1.5,
    borderRadius: 2,
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2,
    }
  },

  iconButton: {
    textTransform: 'none',
    fontWeight: 600,
    px: 3,
    py: 1,
    borderRadius: 2,
  },

  // Stats/Numbers
  statsBox: {
    textAlign: 'center',
    p: 3,
  },

  statNumber: {
    fontWeight: 700,
    fontSize: { xs: '2.5rem', md: '3rem' },
  },

  statLabel: {
    fontSize: { xs: '0.875rem', md: '1rem' },
    opacity: 0.9,
  },

  // Pricing Cards
  pricingCard: {
    p: 4,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    }
  },

  popularPricingCard: {
    p: 4,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    position: 'relative',
    border: 2,
    borderColor: 'primary.main',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)',
  },

  // Course Card Media
  courseMedia: {
    height: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  // Chip/Badge
  badge: {
    fontWeight: 600,
    fontSize: '0.75rem',
  },

  // Navigation
  navbar: {
    backgroundColor: 'white',
    color: 'text.primary',
    boxShadow: 1,
  },

  navLink: {
    textTransform: 'none',
    fontWeight: 500,
    color: 'text.primary',
    '&:hover': {
      color: 'primary.main',
    }
  },

  // Footer
  footer: {
    backgroundColor: 'grey.900',
    color: 'white',
    py: 8,
  },

  footerLink: {
    opacity: 0.8,
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    '&:hover': {
      opacity: 1,
    }
  },

  // Sections
  section: {
    py: { xs: 6, md: 10 },
  },

  sectionGrey: {
    backgroundColor: 'grey.50',
    py: { xs: 6, md: 10 },
  },

  // Container
  container: {
    maxWidth: 'lg',
    px: { xs: 2, sm: 3, md: 4 },
  },
};

// Animation variants
export const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  
  scaleOnHover: {
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    }
  },

  slideUpOnHover: {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
    }
  },
};

// Breakpoint helpers
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// z-index hierarchy
export const zIndex = {
  navbar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};