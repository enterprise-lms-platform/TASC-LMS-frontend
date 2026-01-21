import React from 'react';
import { Box, Paper, Typography, Link } from '@mui/material';
import { EmojiEvents as TrophyIcon, Star as StarIcon } from '@mui/icons-material';

// Courses data (will come from backend later)
const coursesData = [
  { rank: 1, rankColor: 'gold', name: 'Advanced React Patterns', enrolled: 452, rating: 4.8 },
  { rank: 2, rankColor: 'silver', name: 'Data Science Fundamentals', enrolled: 387, rating: 4.9 },
  { rank: 3, rankColor: 'bronze', name: 'Cybersecurity Essentials', enrolled: 321, rating: 4.7 },
  { rank: 4, rankColor: 'default', name: 'Digital Marketing Strategy', enrolled: 298, rating: 4.6 },
];

const rankColors = {
  gold: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
  silver: 'linear-gradient(135deg, #9ca3af, #6b7280)',
  bronze: 'linear-gradient(135deg, #d97706, #b45309)',
  default: '#e5e7eb',
};

const TopCourses: React.FC = () => {
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
          <TrophyIcon sx={{ color: 'primary.dark' }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Top Courses
          </Typography>
        </Box>
        <Link href="#" underline="hover" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'primary.dark' }}>
          View All
        </Link>
      </Box>

      {/* Course List */}
      <Box>
        {coursesData.map((course, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              px: 3,
              borderBottom: index < coursesData.length - 1 ? 1 : 0,
              borderColor: 'divider',
              cursor: 'pointer',
              transition: 'background 0.2s',
              '&:hover': { bgcolor: 'grey.50' },
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: rankColors[course.rankColor as keyof typeof rankColors],
                color: course.rankColor === 'default' ? 'text.secondary' : 'white',
                fontWeight: 700,
                fontSize: '0.875rem',
                flexShrink: 0,
              }}
            >
              {course.rank}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {course.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, fontSize: '0.75rem', color: 'text.secondary' }}>
                <Typography variant="caption">{course.enrolled} enrolled</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, color: 'warning.main', fontWeight: 600 }}>
                  <StarIcon sx={{ fontSize: 12 }} />
                  <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 600 }}>
                    {course.rating}
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

export default TopCourses;
