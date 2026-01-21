import React from 'react';
import { Box, Paper, Typography, Avatar, Link } from '@mui/material';
import { Person as InstructorIcon, MenuBook as BookIcon, People as StudentsIcon, Star as StarIcon } from '@mui/icons-material';

// Instructors data (will come from backend later)
const instructorsData = [
  {
    name: 'Michael Rodriguez',
    initials: 'MR',
    avatarColor: 'linear-gradient(135deg, #667eea, #764ba2)',
    courses: 4,
    learners: 842,
    rating: 4.8,
  },
  {
    name: 'David Wilson',
    initials: 'DW',
    avatarColor: 'linear-gradient(135deg, #f093fb, #f5576c)',
    courses: 3,
    learners: 567,
    rating: 4.6,
  },
  {
    name: 'Amina Nakato',
    initials: 'AN',
    avatarColor: 'linear-gradient(135deg, #11998e, #38ef7d)',
    courses: 2,
    learners: 423,
    rating: 4.9,
  },
];

const InstructorPerformance: React.FC = () => {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2.5,
          px: 3,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InstructorIcon sx={{ color: 'primary.dark' }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Instructor Performance
          </Typography>
        </Box>
        <Link href="#" underline="hover" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'primary.dark' }}>
          View All
        </Link>
      </Box>

      {/* Instructor List */}
      <Box>
        {instructorsData.map((instructor, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              px: 3,
              borderBottom: index < instructorsData.length - 1 ? 1 : 0,
              borderColor: 'divider',
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: instructor.avatarColor,
                fontSize: '0.875rem',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {instructor.initials}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                {instructor.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, fontSize: '0.75rem', color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BookIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                  <Typography variant="caption">{instructor.courses} courses</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StudentsIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                  <Typography variant="caption">{instructor.learners} learners</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                  <Typography variant="caption" fontWeight={600}>
                    {instructor.rating}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default InstructorPerformance;
