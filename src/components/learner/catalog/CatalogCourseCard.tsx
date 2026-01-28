import React from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  IconButton,
  Rating,
} from '@mui/material';
import {
  AccessTime,
  SignalCellularAlt,
  Person,
  FavoriteBorder,
  Favorite,
} from '@mui/icons-material';

export interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  image: string;
  category: string;
  badge?: 'Bestseller' | 'New' | 'Sale';
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  reviewCount: number;
  price: number | 'Free';
}

interface CatalogCourseCardProps {
  course: Course;
  isFavorite?: boolean;
  onFavoriteToggle?: (courseId: string) => void;
  onEnroll?: (course: Course) => void;
  onClick?: (course: Course) => void;
}

// Sample courses for export
export const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    instructor: 'Michael Rodriguez',
    description: 'Master advanced React patterns including render props, higher-order components, and custom hooks.',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Web Development',
    badge: 'Bestseller',
    duration: '24 hours',
    level: 'Advanced',
    rating: 4.8,
    reviewCount: 1200,
    price: 129.99,
  },
  {
    id: '2',
    title: 'Data Science Fundamentals',
    instructor: 'Emma Chen',
    description: 'Complete introduction to data science with Python, statistics, and machine learning basics.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Data Science',
    badge: 'New',
    duration: '36 hours',
    level: 'Beginner',
    rating: 4.9,
    reviewCount: 856,
    price: 'Free',
  },
  {
    id: '3',
    title: 'Cybersecurity Essentials',
    instructor: 'David Wilson',
    description: 'Learn essential cybersecurity concepts, tools, and techniques to protect digital assets.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Cybersecurity',
    duration: '28 hours',
    level: 'Intermediate',
    rating: 4.7,
    reviewCount: 642,
    price: 89.99,
  },
  {
    id: '4',
    title: 'Digital Marketing Strategy',
    instructor: 'Lisa Thompson',
    description: 'Develop comprehensive digital marketing strategies for modern businesses and startups.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Digital Marketing',
    badge: 'Sale',
    duration: '20 hours',
    level: 'Intermediate',
    rating: 4.6,
    reviewCount: 521,
    price: 79.99,
  },
];

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case 'Bestseller':
      return { bg: 'rgba(0, 0, 0, 0.8)', color: 'white' };
    case 'New':
      return { bg: '#10b981', color: 'white' };
    case 'Sale':
      return { bg: '#ef4444', color: 'white' };
    default:
      return { bg: 'rgba(0, 0, 0, 0.8)', color: 'white' };
  }
};

const CatalogCourseCard: React.FC<CatalogCourseCardProps> = ({
  course,
  isFavorite = false,
  onFavoriteToggle,
  onEnroll,
  onClick,
}) => {
  return (
    <Card
      onClick={() => onClick?.(course)}
      sx={{
        cursor: 'pointer',
        borderRadius: 3,
        border: '1px solid #e4e4e7',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="180"
          image={course.image}
          alt={course.title}
          sx={{
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        
        {/* Badge */}
        {course.badge && (
          <Chip
            label={course.badge}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: getBadgeColor(course.badge).bg,
              color: getBadgeColor(course.badge).color,
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        )}
        
        {/* Category */}
        <Chip
          label={course.category}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            color: '#3f3f46',
            fontWeight: 500,
            fontSize: '0.75rem',
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#27272a',
              mb: 0.5,
              lineHeight: 1.3,
              fontSize: '1.125rem',
            }}
          >
            {course.title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#71717a' }}>
            <Person sx={{ fontSize: 16 }} />
            <Typography variant="body2">{course.instructor}</Typography>
          </Stack>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: '#52525b',
            mb: 2,
            flex: 1,
            lineHeight: 1.5,
          }}
        >
          {course.description}
        </Typography>

        {/* Meta */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#71717a' }}>
            <AccessTime sx={{ fontSize: 16 }} />
            <Typography variant="caption">{course.duration}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#71717a' }}>
            <SignalCellularAlt sx={{ fontSize: 16 }} />
            <Typography variant="caption">{course.level}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Rating value={1} max={1} size="small" readOnly sx={{ color: '#f59e0b' }} />
            <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 500 }}>
              {course.rating} ({course.reviewCount >= 1000 ? `${(course.reviewCount / 1000).toFixed(1)}k` : course.reviewCount})
            </Typography>
          </Stack>
        </Stack>

        {/* Footer */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: course.price === 'Free' ? '#10b981' : '#27272a',
            }}
          >
            {course.price === 'Free' ? 'Free' : `$${course.price}`}
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle?.(course.id);
              }}
              sx={{
                border: '1px solid #d4d4d8',
                borderRadius: 1,
                color: isFavorite ? '#ef4444' : '#71717a',
              }}
            >
              {isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            </IconButton>
            <Button
              variant="contained"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEnroll?.(course);
              }}
              sx={{
                bgcolor: '#ffa424',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#e59420',
                },
              }}
            >
              Enroll Now
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CatalogCourseCard;
