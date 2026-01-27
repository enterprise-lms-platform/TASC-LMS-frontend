import React from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Chip, IconButton, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import StarIcon from '@mui/icons-material/Star';

export interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  instructorInitials: string;
  duration: string;
  level: string;
  rating: number;
  ratingCount: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: 'bestseller' | 'new' | 'sale';
  badgeText?: string;
  isFree?: boolean;
}

interface CourseCardProps {
  course: Course;
  onEnroll: (course: Course) => void;
}

const getBadgeColor = (badge?: string) => {
  switch (badge) {
    case 'bestseller': return '#ffa424';
    case 'new': return '#10b981';
    case 'sale': return '#ef4444';
    default: return '#71717a';
  }
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  return (
    <Card className="course-card course-card-animate" sx={{ boxShadow: 'none' }}>
      {/* Image */}
      <Box className="course-image">
        <CardMedia component="img" image={course.image} alt={course.title} />
        
        {/* Badges */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {course.badge && (
            <Chip
              label={course.badgeText || course.badge}
              size="small"
              sx={{ bgcolor: getBadgeColor(course.badge), color: 'white', fontWeight: 600, fontSize: '0.75rem', height: 24, textTransform: 'capitalize' }}
            />
          )}
          <IconButton
            onClick={() => setIsWishlisted(!isWishlisted)}
            sx={{ bgcolor: 'rgba(255,255,255,0.95)', width: 36, height: 36, ml: 'auto', '&:hover': { bgcolor: 'white', transform: 'scale(1.1)' } }}
          >
            {isWishlisted ? <FavoriteIcon sx={{ color: '#ef4444', fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ color: '#71717a', fontSize: 18 }} />}
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
        {/* Category */}
        <Typography sx={{ fontSize: '0.75rem', color: '#ffa424', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
          {course.category}
        </Typography>

        {/* Title */}
        <Link to="/course-details" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            sx={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#27272a',
              mb: 0.5,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              cursor: 'pointer',
              '&:hover': { color: '#ffa424' },
            }}
          >
            {course.title}
          </Typography>
        </Link>

        {/* Instructor */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffb74d, #f97316)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            {course.instructorInitials}
          </Box>
          <Typography sx={{ fontSize: '0.875rem', color: '#71717a' }}>{course.instructor}</Typography>
        </Stack>

        {/* Meta */}
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" sx={{ mb: 2, gap: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <AccessTimeIcon sx={{ fontSize: 14, color: '#a1a1aa' }} />
            <Typography sx={{ fontSize: '0.75rem', color: '#71717a' }}>{course.duration}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <SignalCellularAltIcon sx={{ fontSize: 14, color: '#a1a1aa' }} />
            <Typography sx={{ fontSize: '0.75rem', color: '#71717a' }}>{course.level}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#27272a' }}>{course.rating}</Typography>
            <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
            <Typography sx={{ fontSize: '0.75rem', color: '#a1a1aa' }}>({course.ratingCount})</Typography>
          </Stack>
        </Stack>

        {/* Footer */}
        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #f4f4f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: course.isFree ? '#10b981' : '#27272a' }}>
              {course.price}
            </Typography>
            {course.originalPrice && (
              <Typography sx={{ fontSize: '0.875rem', color: '#a1a1aa', textDecoration: 'line-through' }}>
                {course.originalPrice}
              </Typography>
            )}
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={() => onEnroll(course)}
              sx={{ bgcolor: '#f4f4f5', width: 32, height: 32, '&:hover': { bgcolor: '#e4e4e7' } }}
            >
              <PlayArrowIcon sx={{ fontSize: 16, color: '#52525b' }} />
            </IconButton>
            <Button
              variant="contained"
              size="small"
              onClick={() => onEnroll(course)}
              sx={{ bgcolor: '#ffa424', fontWeight: 600, px: 2, py: 0.75, fontSize: '0.875rem', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#f97316', boxShadow: 'none' } }}
            >
              Enroll
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
