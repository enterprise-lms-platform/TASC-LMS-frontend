import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import {
  People as StudentsIcon,
  VideoLibrary as CoursesIcon,
  Star as StarIcon,
  RateReview as ReviewsIcon,
} from '@mui/icons-material';

interface InstructorTabProps {
  instructor: {
    name: string;
    title: string;
    initials: string;
    bio: string;
    stats: {
      students: number;
      courses: number;
      rating: number;
      reviews: number;
    };
  };
}

const InstructorTab: React.FC<InstructorTabProps> = ({ instructor }) => {
  const stats = [
    { icon: <StudentsIcon />, label: 'Students', value: instructor.stats.students.toLocaleString() },
    { icon: <CoursesIcon />, label: 'Courses', value: instructor.stats.courses },
    { icon: <StarIcon />, label: 'Rating', value: instructor.stats.rating.toFixed(1) },
    { icon: <ReviewsIcon />, label: 'Reviews', value: instructor.stats.reviews.toLocaleString() },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        About the Instructor
      </Typography>

      <Paper elevation={0} sx={{ display: 'flex', gap: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            background: 'linear-gradient(135deg, #ffb74d, #f97316)',
            fontSize: '2.5rem',
            fontWeight: 600,
            flexShrink: 0,
            mx: { xs: 'auto', sm: 0 },
          }}
        >
          {instructor.initials}
        </Avatar>

        <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="h5" fontWeight={700} mb={0.5}>
            {instructor.name}
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {instructor.title}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
              mb: 3,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-start' },
            }}
          >
            {stats.map((stat, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: 'primary.main' }}>{stat.icon}</Box>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {instructor.bio}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default InstructorTab;
