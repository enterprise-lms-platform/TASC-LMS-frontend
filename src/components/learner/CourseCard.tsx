import React from 'react';
import { Card, CardContent, Box, Typography, Button, Chip } from '@mui/material';
import { PlayArrow, Info, Person } from '@mui/icons-material';

interface Course {
  id: string;
  category: string;
  title: string;
  instructor: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  rating: number;
  image?: string;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card
      className="course-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: 1,
        borderColor: 'divider',
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
    >
      {/* Course Image/Header */}
      <Box
        sx={{
          position: 'relative',
          height: 160,
          background: 'linear-gradient(135deg, #ffb74d, #f97316)',
          overflow: 'hidden',
        }}
      >
        {course.image && (
          <img
            src={course.image}
            alt={course.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        <Chip
          label={course.category}
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: 'rgba(255,255,255,0.9)',
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />
        {/* Progress Bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            bgcolor: 'rgba(0,0,0,0.1)',
          }}
        >
          <Box
            sx={{
              width: `${course.progress}%`,
              height: '100%',
              bgcolor: 'white',
            }}
          />
        </Box>
      </Box>

      {/* Course Content */}
      <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom lineHeight={1.3}>
          {course.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
        >
          <Person fontSize="small" /> {course.instructor}
        </Typography>

        {/* Stats Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700}>
              {course.progress}%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Progress
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700}>
              {course.lessonsCompleted}/{course.totalLessons}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Lessons
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700}>
              {course.rating}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Rating
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Info />}
            fullWidth
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Details
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            fullWidth
            sx={{ textTransform: 'none', fontWeight: 500, color: 'white' }}
          >
            Resume
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
