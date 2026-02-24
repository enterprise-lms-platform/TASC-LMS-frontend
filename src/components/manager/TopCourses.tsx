import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { EmojiEvents as TrophyIcon, Star as StarIcon } from '@mui/icons-material';

const coursesData = [
  { rank: 1, rankBg: 'linear-gradient(135deg, #fbbf24, #f59e0b)', name: 'Advanced React Patterns', enrolled: 452, rating: 4.8 },
  { rank: 2, rankBg: 'linear-gradient(135deg, #9ca3af, #6b7280)', name: 'Data Science Fundamentals', enrolled: 387, rating: 4.9 },
  { rank: 3, rankBg: 'linear-gradient(135deg, #d97706, #b45309)', name: 'Cybersecurity Essentials', enrolled: 321, rating: 4.7 },
  { rank: 4, rankBg: '#e5e7eb', name: 'Digital Marketing Strategy', enrolled: 298, rating: 4.6 },
];

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const TopCourses: React.FC = () => {
  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrophyIcon sx={{ color: '#ffa424', fontSize: 20 }} />
          <Typography fontWeight={700}>Top Courses</Typography>
        </Box>
        <Chip label="View All" size="small" clickable
          sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(255,164,36,0.08)', color: '#ffa424',
            '&:hover': { bgcolor: 'rgba(255,164,36,0.15)' } }} />
      </Box>

      {coursesData.map((course, i) => (
        <Box key={i} sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, p: 2, px: 3,
          borderBottom: i < coursesData.length - 1 ? 1 : 0, borderColor: 'divider',
          cursor: 'pointer', transition: 'all 0.15s',
          '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
        }}>
          <Box sx={{
            width: 30, height: 30, borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: course.rankBg,
            color: course.rank <= 3 ? 'white' : '#71717a',
            fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
          }}>{course.rank}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600}
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {course.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">{course.enrolled} enrolled</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                <StarIcon sx={{ fontSize: 13, color: '#f59e0b' }} />
                <Typography variant="caption" fontWeight={700} sx={{ color: '#f59e0b' }}>{course.rating}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Paper>
  );
};

export default TopCourses;
