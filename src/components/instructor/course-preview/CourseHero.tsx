import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Chip, Avatar } from '@mui/material';
import {
  Star as StarIcon,
  People as PeopleIcon,
  Schedule as ClockIcon,
  BarChart as LevelIcon,
  NavigateNext as NextIcon,
} from '@mui/icons-material';

interface CourseHeroProps {
  category: string;
  title: string;
  subtitle: string;
  rating: number;
  ratingCount: number;
  studentCount: number;
  duration: string;
  level: string;
  instructor: {
    name: string;
    title: string;
    initials: string;
  };
}

const CourseHero: React.FC<CourseHeroProps> = ({
  category,
  title,
  subtitle,
  rating,
  ratingCount,
  studentCount,
  duration,
  level,
  instructor,
}) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #27272a, #18181b)',
        color: 'white',
        p: { xs: 4, md: 6 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(135deg, #ffa424, #f97316)',
          opacity: 0.1,
          transform: 'skewX(-15deg) translateX(50%)',
        },
      }}
    >
      <Box sx={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
        {/* Breadcrumb */}
        <Breadcrumbs
          separator={<NextIcon fontSize="small" />}
          sx={{
            mb: 2,
            '& .MuiBreadcrumbs-separator': { color: 'rgba(255, 255, 255, 0.4)' },
          }}
        >
          <Link href="#" underline="hover" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#ffb74d' } }}>
            Home
          </Link>
          <Link href="#" underline="hover" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#ffb74d' } }}>
            Courses
          </Link>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Preview</Typography>
        </Breadcrumbs>

        {/* Category */}
        <Chip
          label={category}
          size="small"
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 600,
            mb: 2,
          }}
        />

        {/* Title */}
        <Typography variant="h3" fontWeight={700} mb={2} sx={{ fontSize: { xs: '1.875rem', md: '2.25rem' } }}>
          {title}
        </Typography>

        {/* Subtitle */}
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3, fontWeight: 400 }}>
          {subtitle}
        </Typography>

        {/* Meta Info */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: '#f59e0b', display: 'flex', gap: 0.25 }}>
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} sx={{ fontSize: 16 }} />
              ))}
            </Box>
            <Typography variant="body2" fontWeight={600} sx={{ color: '#f59e0b' }}>
              {rating}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              ({ratingCount.toLocaleString()})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon sx={{ fontSize: 18, color: '#ffb74d' }} />
            <Typography variant="body2">{studentCount.toLocaleString()} students</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ClockIcon sx={{ fontSize: 18, color: '#ffb74d' }} />
            <Typography variant="body2">{duration}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LevelIcon sx={{ fontSize: 18, color: '#ffb74d' }} />
            <Typography variant="body2">{level}</Typography>
          </Box>
        </Box>

        {/* Instructor */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 1,
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #ffb74d, #f97316)',
              fontWeight: 600,
            }}
          >
            {instructor.initials}
          </Avatar>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Instructor
            </Typography>
            <Typography fontWeight={600}>{instructor.name}</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {instructor.title}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseHero;
