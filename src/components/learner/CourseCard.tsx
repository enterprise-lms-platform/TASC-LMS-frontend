import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  return (
    <Card
      className="course-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        cursor: 'pointer',
        overflow: 'hidden',
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
            top: 12,
            left: 12,
            bgcolor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            fontWeight: 600,
            fontSize: '0.68rem',
            height: 24,
            borderRadius: '50px',
          }}
        />
        {/* Progress Bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            bgcolor: 'rgba(0,0,0,0.15)',
          }}
        >
          <Box
            sx={{
              width: `${course.progress}%`,
              height: '100%',
              bgcolor: 'white',
              borderRadius: '0 2px 2px 0',
              transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </Box>
      </Box>

      {/* Course Content */}
      <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom lineHeight={1.3} sx={{ fontSize: '0.95rem' }}>
          {course.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.disabled"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2, fontSize: '0.8rem' }}
        >
          <Person sx={{ fontSize: 16 }} /> {course.instructor}
        </Typography>

        {/* Stats Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.85rem' }}>
              {course.progress}%
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em' }}>
              Progress
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.85rem' }}>
              {course.lessonsCompleted}/{course.totalLessons}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em' }}>
              Lessons
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.85rem' }}>
              {course.rating}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em' }}>
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
            onClick={(e) => { e.stopPropagation(); navigate(`/learner/course/${course.id}`); }}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '10px',
              borderColor: 'rgba(0,0,0,0.08)',
              color: 'text.secondary',
              fontSize: '0.8rem',
              '&:hover': { borderColor: 'primary.main', color: 'primary.dark' },
            }}
          >
            Details
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            fullWidth
            onClick={(e) => { e.stopPropagation(); navigate(`/learner/course/${course.id}/learn`); }}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: 'white',
              borderRadius: '10px',
              boxShadow: 'none',
              fontSize: '0.8rem',
              '&:hover': { boxShadow: '0 4px 12px rgba(249,115,22,0.3)' },
            }}
          >
            Resume
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
