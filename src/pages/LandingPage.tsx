import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Drawer,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
} from '@mui/material';
import '@fortawesome/fontawesome-free/css/all.min.css';

// FontAwesome Icon wrapper for use with MUI
interface FAIconProps {
  icon: string;
  size?: number;
  sx?: Record<string, unknown>;
}

const FAIcon: React.FC<FAIconProps> = ({ icon, size = 24, sx = {} }) => (
  <i className={`fas fa-${icon}`} style={{ fontSize: size, ...sx }} />
);

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesMenuEl, setCoursesMenuEl] = useState<null | HTMLElement>(null);
  const [pricingAnnual, setPricingAnnual] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCoursesMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCoursesMenuEl(event.currentTarget);
  };

  const handleCoursesMenuClose = () => {
    setCoursesMenuEl(null);
  };

  const getPricing = (monthly: number, annual: number) =>
    pricingAnnual ? annual : monthly;

  return (
    <Box sx={{ bgcolor: '#fff' }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'white',
          boxShadow: scrolled ? 2 : 0,
          transition: 'box-shadow 0.3s',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 2,
            }}
          >
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FAIcon icon="graduation-cap" size={32} sx={{ color: '#ffa424' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#27272a' }}>
                TASC LMS
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 8, flexGrow: 1, ml: 8 }}>
                <Button
                  onClick={handleCoursesMenuOpen}
                  endIcon={<FAIcon icon="chevron-down" size={12} />}
                  sx={{ color: '#52525b', fontWeight: 500, fontSize: '0.875rem', textTransform: 'none' }}
                >
                  Courses
                </Button>
                <Menu
                  anchorEl={coursesMenuEl}
                  open={Boolean(coursesMenuEl)}
                  onClose={handleCoursesMenuClose}
                  sx={{ mt: 1 }}
                >
                  <MenuItem onClick={handleCoursesMenuClose}>
                    <FAIcon icon="code" size={16} sx={{ mr: 2, color: '#ffa424' }} />
                    Web Development
                  </MenuItem>
                  <MenuItem onClick={handleCoursesMenuClose}>
                    <FAIcon icon="chart-line" size={16} sx={{ mr: 2, color: '#ffa424' }} />
                    Data Science
                  </MenuItem>
                  <MenuItem onClick={handleCoursesMenuClose}>
                    <FAIcon icon="shield-alt" size={16} sx={{ mr: 2, color: '#ffa424' }} />
                    Cybersecurity
                  </MenuItem>
                  <MenuItem onClick={handleCoursesMenuClose}>
                    <FAIcon icon="briefcase" size={16} sx={{ mr: 2, color: '#ffa424' }} />
                    Business
                  </MenuItem>
                </Menu>
                <Link
                  href="#features"
                  sx={{
                    color: '#52525b',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  sx={{
                    color: '#52525b',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Pricing
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: '#52525b',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                  }}
                >
                  For Business
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: '#52525b',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                  }}
                >
                  About
                </Link>
              </Box>
            )}

            {/* Desktop Actions */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button variant="outlined" sx={{ borderColor: '#d4d4d8', color: '#3f3f46' }}>
                  Log In
                </Button>
                <Button variant="contained" sx={{ bgcolor: '#ffa424', '&:hover': { bgcolor: '#f97316' } }}>
                  Start Free Trial
                </Button>
              </Box>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <IconButton onClick={() => setMobileMenuOpen(true)}>
                <FAIcon icon="bars" size={24} />
              </IconButton>
            )}
          </Box>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Box sx={{ width: 280, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FAIcon icon="graduation-cap" size={32} sx={{ color: '#ffa424' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                TASC LMS
              </Typography>
            </Box>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <FAIcon icon="times" size={24} />
            </IconButton>
          </Box>
          <Stack spacing={2}>
            <Link
              href="#"
              sx={{
                py: 2,
                borderBottom: '1px solid #e4e4e7',
                textDecoration: 'none',
                color: '#3f3f46',
              }}
            >
              Courses
            </Link>
            <Link
              href="#features"
              sx={{
                py: 2,
                borderBottom: '1px solid #e4e4e7',
                textDecoration: 'none',
                color: '#3f3f46',
              }}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              sx={{
                py: 2,
                borderBottom: '1px solid #e4e4e7',
                textDecoration: 'none',
                color: '#3f3f46',
              }}
            >
              Pricing
            </Link>
            <Button variant="outlined" fullWidth sx={{ mt: 3 }}>
              Log In
            </Button>
            <Button variant="contained" fullWidth sx={{ bgcolor: '#ffa424' }}>
              Start Free Trial
            </Button>
          </Stack>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          pt: 20,
          pb: 12,
          background: 'linear-gradient(135deg, rgba(255, 164, 36, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)',
        }}
      >
        <Container maxWidth="xl">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 8,
                alignItems: 'center',
              }}
            >
              <Box>
                <Chip
                icon={<FAIcon icon="wand-magic-sparkles" size={14} />}
                label="New: AI-Powered Learning Paths"
                sx={{
                  bgcolor: '#fff3e0',
                  color: '#ffa424',
                  fontWeight: 600,
                  mb: 3,
                  '& .MuiChip-icon': { marginLeft: 1 },
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Transform Your Career with{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #ffa424, #f97316)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  World-Class Learning
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#52525b',
                  mb: 4,
                  lineHeight: 1.7,
                }}
              >
                Access 1000+ courses from industry experts. Master in-demand skills, earn recognized
                certifications, and accelerate your professional growth with TASC Learning Management System.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<FAIcon icon="play" size={18} />}
                  sx={{ bgcolor: '#ffa424', px: 4, py: 1.5 }}
                >
                  Start Learning Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<FAIcon icon="briefcase" size={18} />}
                  sx={{ borderColor: '#ffa424', color: '#ffa424', px: 4, py: 1.5 }}
                >
                  For Organizations
                </Button>
              </Stack>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    1000+
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#71717a' }}>
                    Expert-Led Courses
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    50K+
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#71717a' }}>
                    Active Learners
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    4.8
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#71717a' }}>
                    Average Rating
                  </Typography>
                </Box>
              </Box>
            </Box>
              {!isMobile && (
                <Box>
                  <Paper
                  elevation={8}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Stack alignItems="center" spacing={2}>
                    <FAIcon icon="play" size={80} sx={{ opacity: 0.9 }} />
                    <Typography variant="h6">Start Your Learning Journey</Typography>
                  </Stack>
                </Paper>
                </Box>
              )}
            </Box>
        </Container>
      </Box>

      {/* Trusted By Section */}
      <Box sx={{ py: 6, bgcolor: '#fafafa', borderTop: '1px solid #e4e4e7', borderBottom: '1px solid #e4e4e7' }}>
        <Container maxWidth="xl">
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              textAlign: 'center',
              color: '#71717a',
              mb: 4,
              letterSpacing: 2,
            }}
          >
            Trusted by Leading Organizations Worldwide
          </Typography>
          <Stack direction="row" spacing={6} justifyContent="center" flexWrap="wrap">
            {['Acme Corp', 'Global Tech', 'Innovate', 'Future Dynamics', 'NextGen'].map((company) => (
              <Typography
                key={company}
                variant="h6"
                sx={{
                  color: '#a1a1aa',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <FAIcon icon="building" size={20} />
                {company}
              </Typography>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 12, bgcolor: 'white' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              icon={<FAIcon icon="star" size={14} />}
              label="Why Choose Us"
              sx={{
                bgcolor: '#fff3e0',
                color: '#ffa424',
                fontWeight: 600,
                mb: 2,
                '& .MuiChip-icon': { marginLeft: 1 },
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Everything You Need to Succeed
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#52525b',
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              Our comprehensive learning platform provides all the tools and resources you need to master new
              skills and advance your career.
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {[
              {
                icon: 'book-open',
                title: 'Comprehensive Course Library',
                desc: 'Access 1000+ courses across web development, data science, cybersecurity, business, and more. New content added weekly.',
                color: '#ffa424',
              },
              {
                icon: 'chalkboard-user',
                title: 'Expert Instructors',
                desc: 'Learn from industry professionals with real-world experience. Our instructors are certified experts in their fields.',
                color: '#3b82f6',
              },
              {
                icon: 'certificate',
                title: 'Verified Certifications',
                desc: 'Earn industry-recognized certificates with unique QR verification. Showcase your achievements to employers.',
                color: '#10b981',
              },
              {
                icon: 'video',
                title: 'Live Interactive Sessions',
                desc: 'Join live classes with Zoom, Teams, or Google Meet integration. Ask questions and interact in real-time.',
                color: '#8b5cf6',
              },
              {
                icon: 'tasks',
                title: 'Hands-On Assessments',
                desc: 'Practice with quizzes, assignments, and projects. Get instant feedback and track your progress.',
                color: '#ef4444',
              },
              {
                icon: 'mobile-alt',
                title: 'Learn Anywhere',
                desc: 'Access courses on any device. Download content for offline learning. Continue where you left off.',
                color: '#14b8a6',
              },
            ].map((feature, idx) => (
              <Box key={idx}>
                <Card
                  sx={{
                    p: 4,
                    height: '100%',
                    border: '1px solid #e4e4e7',
                    '&:hover': { boxShadow: 6, transform: 'translateY(-8px)' },
                    transition: 'all 0.3s',
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${feature.color}15`,
                      color: feature.color,
                      mb: 3,
                    }}
                  >
                    <FAIcon icon={feature.icon} size={32} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#52525b',
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.desc}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              icon={<FAIcon icon="route" size={14} />}
              label="How It Works"
              sx={{
                bgcolor: 'rgba(255, 164, 36, 0.2)',
                color: '#ffa424',
                fontWeight: 600,
                mb: 2,
                '& .MuiChip-icon': { marginLeft: 1 },
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Start Learning in Minutes
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#a1a1aa',
              }}
            >
              Getting started is easy. Follow these simple steps to begin your learning journey.
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {[
              {
                num: 1,
                icon: 'user-plus',
                title: 'Create Account',
                desc: 'Sign up for free in seconds using your email or social accounts.',
              },
              {
                num: 2,
                icon: 'magnifying-glass',
                title: 'Browse Courses',
                desc: 'Explore our catalog and find courses that match your goals.',
              },
              {
                num: 3,
                icon: 'play',
                title: 'Start Learning',
                desc: 'Enroll instantly and begin learning at your own pace.',
              },
              {
                num: 4,
                icon: 'trophy',
                title: 'Get Certified',
                desc: 'Complete courses and earn verified certificates to showcase.',
              },
            ].map((step) => (
              <Box key={step.num}>
                <Card
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-8px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'linear-gradient(135deg, #ffa424, #f97316)',
                      mx: 'auto',
                      mb: 3,
                      fontWeight: 700,
                    }}
                  >
                    {step.num}
                  </Avatar>
                  <Box sx={{ color: '#ffb74d', mb: 2 }}>
                    <FAIcon icon={step.icon} size={48} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      color: 'white',
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#a1a1aa',
                    }}
                  >
                    {step.desc}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Featured Courses Section */}
      <Box sx={{ py: 12, bgcolor: '#fafafa' }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              mb: 6,
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
            }}
          >
            <Box>
              <Chip
                icon={<FAIcon icon="fire" size={14} />}
                label="Popular Courses"
                sx={{
                  bgcolor: '#fff3e0',
                  color: '#ffa424',
                  fontWeight: 600,
                  mb: 2,
                  '& .MuiChip-icon': { marginLeft: 1 },
                }}
              />
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Featured Courses
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#52525b',
                }}
              >
                Discover our most popular courses loved by thousands of learners.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<FAIcon icon="arrow-right" size={16} />}
              sx={{
                borderColor: '#ffa424',
                color: '#ffa424',
              }}
            >
              View All Courses
            </Button>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {[
              {
                category: 'Web Development',
                title: 'Advanced React Patterns & Best Practices',
                instructor: 'Michael Rodriguez',
                hours: '24 hours',
                level: 'Advanced',
                rating: 4.8,
                reviews: '1.2k',
                price: '$129.99',
                original: '$199.99',
                badge: 'Bestseller',
                bg: 'linear-gradient(135deg, #667eea, #764ba2)',
              },
              {
                category: 'Data Science',
                title: 'Data Science & Machine Learning Fundamentals',
                instructor: 'Emma Chen',
                hours: '36 hours',
                level: 'Beginner',
                rating: 4.9,
                reviews: '856',
                price: 'Free',
                badge: 'New',
                bg: 'linear-gradient(135deg, #11998e, #38ef7d)',
              },
              {
                category: 'Cybersecurity',
                title: 'Cybersecurity Essentials: From Zero to Hero',
                instructor: 'David Wilson',
                hours: '28 hours',
                level: 'Intermediate',
                rating: 4.7,
                reviews: '642',
                price: '$89.99',
                bg: 'linear-gradient(135deg, #eb3349, #f45c43)',
              },
            ].map((course, idx) => (
              <Box key={idx}>
                <Card
                  sx={{
                    '&:hover': { boxShadow: 6, transform: 'translateY(-8px)' },
                    transition: 'all 0.3s',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      height: 200,
                      background: course.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <FAIcon icon="code" size={64} />
                    {course.badge && (
                      <Chip
                        label={course.badge}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          bgcolor: course.badge === 'Bestseller' ? '#ffa424' : '#10b981',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#ffa424',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      {course.category}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        my: 1.5,
                      }}
                    >
                      {course.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: '#ffa424',
                          fontSize: 12,
                        }}
                      >
                        {course.instructor
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#71717a',
                        }}
                      >
                        {course.instructor}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        mb: 2,
                        pb: 2,
                        borderBottom: '1px solid #e4e4e7',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: '#71717a',
                        }}
                      >
                        <FAIcon icon="clock" size={14} /> {course.hours}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: '#71717a',
                        }}
                      >
                        <FAIcon icon="signal" size={14} /> {course.level}
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <FAIcon icon="star" size={14} sx={{ color: '#f59e0b' }} />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {course.rating}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#a1a1aa',
                          }}
                        >
                          ({course.reviews})
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: course.price === 'Free' ? '#10b981' : '#27272a',
                          }}
                        >
                          {course.price}
                        </Typography>
                        {course.original && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#a1a1aa',
                              textDecoration: 'line-through',
                            }}
                          >
                            {course.original}
                          </Typography>
                        )}
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: '#ffa424',
                        }}
                      >
                        Enroll Now
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box id="pricing" sx={{ py: 12, bgcolor: 'white' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              icon={<FAIcon icon="tags" size={14} />}
              label="Pricing Plans"
              sx={{
                bgcolor: '#fff3e0',
                color: '#ffa424',
                fontWeight: 600,
                mb: 2,
                '& .MuiChip-icon': { marginLeft: 1 },
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Choose Your Learning Plan
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#52525b',
                mb: 4,
              }}
            >
              Flexible pricing options to fit your learning needs. Start free and upgrade anytime.
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{
                mb: 6,
              }}
            >
              <Typography sx={{ fontWeight: pricingAnnual ? 400 : 600 }}>Monthly</Typography>
              <ToggleButtonGroup
                value={pricingAnnual}
                exclusive
                onChange={(_, val) => val !== null && setPricingAnnual(val)}
              >
                <ToggleButton value={false} sx={{ px: 2 }}>
                  M
                </ToggleButton>
                <ToggleButton value={true} sx={{ px: 2 }}>
                  A
                </ToggleButton>
              </ToggleButtonGroup>
              <Typography sx={{ fontWeight: pricingAnnual ? 600 : 400 }}>Annual</Typography>
              <Chip
                label="Save 20%"
                sx={{
                  bgcolor: '#10b981',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, alignItems: 'flex-start' }}>
            {[
              {
                name: 'Basic',
                desc: 'Perfect for getting started',
                monthly: 9,
                annual: 7,
                features: [
                  'Access to 50+ courses',
                  '5 certificates per month',
                  '5 live sessions per month',
                  'Email support',
                ],
                disabled: ['Offline downloads', 'Priority support'],
              },
              {
                name: 'Pro',
                desc: 'Best for serious learners',
                monthly: 29,
                annual: 23,
                features: [
                  'Unlimited course access',
                  '10 certificates per month',
                  '20 live sessions per month',
                  '50 offline downloads',
                  'Priority email support',
                ],
                disabled: ['1-on-1 mentoring'],
                popular: true,
              },
              {
                name: 'Enterprise',
                desc: 'For teams and organizations',
                monthly: 79,
                annual: 63,
                features: [
                  'Everything in Pro',
                  'Unlimited certificates',
                  'Unlimited live sessions',
                  'Unlimited downloads',
                  '24/7 priority support',
                  'Monthly 1-on-1 mentoring',
                ],
                disabled: [],
              },
            ].map((plan, idx) => (
              <Box key={idx}>
                <Card
                  sx={{
                    p: 4,
                    position: 'relative',
                    border: plan.popular ? '2px solid #ffa424' : '2px solid #e4e4e7',
                    transform: plan.popular ? 'scale(1.05)' : 'none',
                    boxShadow: plan.popular ? 6 : 2,
                    '&:hover': {
                      boxShadow: 6,
                      transform: plan.popular ? 'scale(1.05) translateY(-8px)' : 'translateY(-8px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  {plan.popular && (
                    <Chip
                      icon={<FAIcon icon="star" size={14} />}
                      label="Most Popular"
                      sx={{
                        position: 'absolute',
                        top: -14,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'linear-gradient(135deg, #ffa424, #f97316)',
                        color: 'white',
                        fontWeight: 600,
                        '& .MuiChip-icon': { marginLeft: 1 },
                      }}
                    />
                  )}
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      textAlign: 'center',
                    }}
                  >
                    {plan.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#71717a',
                      mb: 3,
                      textAlign: 'center',
                    }}
                  >
                    {plan.desc}
                  </Typography>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                      component="span"
                      variant="h4"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      $
                    </Typography>
                    <Typography
                      component="span"
                      variant="h2"
                      sx={{
                        fontWeight: 800,
                      }}
                    >
                      {getPricing(plan.monthly, plan.annual)}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#71717a',
                      }}
                    >
                      /month
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Stack spacing={1.5} sx={{ mb: 4 }}>
                    {plan.features.map((feature, i) => (
                      <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                        <FAIcon icon="check" size={16} sx={{ color: '#10b981' }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Stack>
                    ))}
                    {plan.disabled.map((feature, i) => (
                      <Stack
                        key={i}
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{
                          opacity: 0.4,
                        }}
                      >
                        <FAIcon icon="times" size={16} sx={{ color: '#d4d4d8' }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Button
                    variant={plan.popular ? 'contained' : 'outlined'}
                    fullWidth
                    sx={{
                      bgcolor: plan.popular ? '#ffa424' : undefined,
                      borderColor: plan.popular ? '#ffa424' : '#ffa424',
                      color: plan.popular ? 'white' : '#ffa424',
                    }}
                  >
                    {plan.name === 'Pro'
                      ? 'Start Free Trial'
                      : plan.name === 'Enterprise'
                        ? 'Contact Sales'
                        : 'Get Started'}
                  </Button>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #ffa424, #f97316)',
          color: 'white',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
              Ready to Start Your Learning Journey?
            </Typography>
            <Typography variant="h6" sx={{ mb: 8, opacity: 0.9 }}>
              Join 50,000+ learners who are already advancing their careers with TASC LMS. Start your free trial
              today - no credit card required.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                startIcon={<FAIcon icon="rocket" size={18} />}
                sx={{
                  bgcolor: 'white',
                  color: '#ffa424',
                  '&:hover': { bgcolor: '#f4f4f5' },
                }}
              >
                Start Learning Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<FAIcon icon="calendar" size={18} />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                Schedule a Demo
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#18181b', color: 'white', py: 8 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 6, mb: 8 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <FAIcon icon="graduation-cap" size={32} sx={{ color: '#ffa424' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  TASC LMS
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 3 }}>
                Empowering learners worldwide with world-class education. Transform your career with expert-led
                courses and recognized certifications.
              </Typography>
              <Stack direction="row" spacing={1}>
                {['facebook-f', 'twitter', 'linkedin-in', 'instagram', 'youtube'].map((icon) => (
                  <IconButton
                    key={icon}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '&:hover': { bgcolor: '#ffa424' },
                    }}
                  >
                    <FAIcon icon={icon} size={16} />
                  </IconButton>
                ))}
              </Stack>
            </Box>
            {[
              {
                title: 'Platform',
                links: ['Browse Courses', 'Categories', 'Pricing', 'For Business', 'Become an Instructor'],
              },
              {
                title: 'Resources',
                links: ['Help Center', 'Documentation', 'Blog', 'Community', 'Webinars'],
              },
              {
                title: 'Company',
                links: ['About Us', 'Careers', 'Press', 'Partners', 'Contact'],
              },
            ].map((column) => (
              <Box key={column.title}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    color: 'white',
                  }}
                >
                  {column.title}
                </Typography>
                <Stack spacing={1.5}>
                  {column.links.map((link) => (
                    <Link
                      key={link}
                      href="#"
                      sx={{
                        color: '#a1a1aa',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        '&:hover': { color: '#ffa424' },
                      }}
                    >
                      {link}
                    </Link>
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: '#71717a' }}>
              © 2025 TASC Learning Management System. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Link
                href="#"
                sx={{
                  color: '#71717a',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#ffa424' },
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                sx={{
                  color: '#71717a',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#ffa424' },
                }}
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                sx={{
                  color: '#71717a',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#ffa424' },
                }}
              >
                Cookie Policy
              </Link>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
