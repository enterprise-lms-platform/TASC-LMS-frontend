import React from 'react';
import { Box, Typography, Chip, Stack, Button } from '@mui/material';
import {
  Star as StarIcon,
  People as PeopleIcon,
  SignalCellularAlt as LevelIcon,
  AccessTime as TimeIcon,
  LocalOffer as TagIcon,
  ShoppingCart as CartIcon,
  PlayCircle as PlayIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

export interface CourseHeroData {
  title: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  level: string;
  duration: string;
  lastUpdated: string;
  lessons: number;
  videoHours: number;
  projects: number;
  hasCertificate: boolean;
}

interface CourseDetailHeroProps {
  course: CourseHeroData;
  onEnroll?: () => void;
  onPreview?: () => void;
}

const CourseDetailHero: React.FC<CourseDetailHeroProps> = ({
  course,
  onEnroll,
  onPreview,
}) => {
  return (
    <Box
      sx={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1616400619175-5beda3a17896?q=80&w=1074")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
          pointerEvents: 'none',
        },
      }}
    >

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        {/* Breadcrumb */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mb: 3, fontSize: '0.875rem', opacity: 0.9 }}
        >
          <Typography
            component="a"
            href="#"
            sx={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Courses
          </Typography>
          <Typography sx={{ opacity: 0.7 }}>›</Typography>
          <Typography
            component="a"
            href="#"
            sx={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            {course.category}
          </Typography>
          <Typography sx={{ opacity: 0.7 }}>›</Typography>
          <Typography>{course.title}</Typography>
        </Stack>

        {/* Main Content */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: { xs: 4, lg: 6 },
          }}
        >
          {/* Left: Course Info */}
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                lineHeight: 1.2,
              }}
            >
              {course.title}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                opacity: 0.9,
                mb: 4,
                maxWidth: 800,
              }}
            >
              {course.description}
            </Typography>

            {/* Meta Info */}
            <Stack
              direction="row"
              flexWrap="wrap"
              sx={{ gap: { xs: 2, md: 4 }, mb: 4 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <StarIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2">
                  {course.rating} ({course.reviewCount.toLocaleString()} reviews)
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PeopleIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2">
                  {course.studentCount.toLocaleString()} students enrolled
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LevelIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2">{course.level}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TimeIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2">{course.duration}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TagIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2">Last updated: {course.lastUpdated}</Typography>
              </Stack>
            </Stack>

            {/* Stats */}
            <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700}>{course.lessons}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Lessons
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700}>{course.videoHours}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Hours Video
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700}>{course.projects}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Projects
                </Typography>
              </Box>
              {course.hasCertificate && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={700}>Certificate</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Included
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Right: Enroll Card */}
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              p: 4,
            }}
          >
            {/* Subscription Info */}
            <Box sx={{ mb: 3 }}>
              <Chip 
                label="Biannual Plan" 
                sx={{ 
                  bgcolor: 'rgba(255, 164, 36, 0.15)', 
                  color: '#ffa424', 
                  fontWeight: 700,
                  mb: 1.5,
                  border: '1px solid rgba(255, 164, 36, 0.3)'
                }} 
              />
              <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                $99.00 <Typography component="span" variant="h6" sx={{ opacity: 0.8, fontWeight: 500 }}>/ 6 months</Typography>
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Unlimited access to this and all other courses
              </Typography>
            </Box>

            {/* Buttons */}
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<CartIcon />}
                onClick={onEnroll}
                sx={{
                  bgcolor: 'white',
                  color: '#ffa424',
                  fontWeight: 600,
                  py: 1.5,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                }}
              >
                Get Full Access
              </Button>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<PlayIcon />}
                onClick={onPreview}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  py: 1.5,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)', borderColor: 'white' },
                }}
              >
                Start Free Preview
              </Button>
            </Stack>

            {/* Features */}
            <Stack spacing={1.5}>
              {['Full lifetime access', 'Certificate of completion', `${course.projects} practical projects`, 'Access on mobile and TV'].map((feature) => (
                <Stack key={feature} direction="row" alignItems="center" spacing={1}>
                  <CheckIcon sx={{ fontSize: 18, color: '#10b981' }} />
                  <Typography variant="body2">{feature}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseDetailHero;
