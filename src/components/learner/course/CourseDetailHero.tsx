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
  price: number;
  originalPrice?: number;
  discountPercent?: number;
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
        background: 'linear-gradient(135deg, #ffa424, #f97316)',
        color: 'white',
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 200" opacity="0.1"><path d="M0,100 C250,0 500,200 750,100 T1000,100 V200 H0 Z" fill="white"/></svg>') bottom center no-repeat`,
          backgroundSize: 'cover',
        }}
      />

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
            {/* Price */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                ${course.price.toFixed(2)}
              </Typography>
              {course.originalPrice && (
                <Typography
                  sx={{ fontSize: '1.125rem', textDecoration: 'line-through', opacity: 0.7, mb: 1 }}
                >
                  ${course.originalPrice.toFixed(2)}
                </Typography>
              )}
              {course.discountPercent && (
                <Chip
                  label={`${course.discountPercent}% OFF`}
                  size="small"
                  sx={{
                    bgcolor: '#10b981',
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
              )}
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
                Enroll Now
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
