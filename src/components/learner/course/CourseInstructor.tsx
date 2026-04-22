import React from 'react';
import { Box, Typography, Stack, Avatar, Button } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

export interface InstructorData {
  id: string;
  name: string;
  title: string;
  initials: string;
  avatar?: string;
  bio: string;
  courseCount: number;
  studentCount: string;
}

interface CourseInstructorProps {
  instructor: InstructorData;
  onViewProfile?: () => void;
  /** Approved learner reviews for this course (catalogue summary). Omit to hide rating — not instructor-specific. */
  courseLearnerReviews?: { average: number; total: number };
}

const CourseInstructor: React.FC<CourseInstructorProps> = ({
  instructor,
  onViewProfile,
  courseLearnerReviews,
}) => {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 3,
        p: 4,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e4e4e7',
      }}
    >
      <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mb: 3 }}>
        Your Instructor
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        alignItems={{ xs: 'center', sm: 'flex-start' }}
        sx={{ textAlign: { xs: 'center', sm: 'left' } }}
      >
        {/* Avatar */}
        <Avatar
          src={instructor.avatar}
          sx={{
            width: 100,
            height: 100,
            background: 'linear-gradient(135deg, #ffb74d, #f97316)',
            fontSize: '1.5rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {instructor.initials}
        </Avatar>

        {/* Info */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
            {instructor.name}
          </Typography>
          <Typography sx={{ color: '#ffa424', mb: 2, fontWeight: 500 }}>
            {instructor.title}
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
            {instructor.bio}
          </Typography>

          {/* Stats */}
          <Stack
            direction="row"
            spacing={4}
            sx={{ mb: 3, justifyContent: { xs: 'center', sm: 'flex-start' } }}
          >
            {courseLearnerReviews ? (
              <Box sx={{ textAlign: 'center' }}>
                <Typography fontWeight={700} color="text.primary">
                  {courseLearnerReviews.average.toFixed(1)}/5.0
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Course rating
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', opacity: 0.85 }}>
                  {courseLearnerReviews.total}{' '}
                  {courseLearnerReviews.total === 1 ? 'review' : 'reviews'}
                </Typography>
              </Box>
            ) : null}
            <Box sx={{ textAlign: 'center' }}>
              <Typography fontWeight={700} color="text.primary">
                {instructor.courseCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Courses
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography fontWeight={700} color="text.primary">
                {instructor.studentCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Students
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            startIcon={<PersonIcon />}
            onClick={onViewProfile}
            sx={{
              bgcolor: '#ffa424',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#e59420' },
            }}
          >
            View Full Profile
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default CourseInstructor;
