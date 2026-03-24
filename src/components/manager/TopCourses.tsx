import React from 'react';
import { Box, Paper, Typography, Chip, Skeleton } from '@mui/material';
import { EmojiEvents as TrophyIcon, Star as StarIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { courseApi } from '../../services/catalogue.services';
import type { PaginatedResponse } from '../../types/types';

interface CourseResult {
  id: number;
  title: string;
  rating?: number;
  enrollment_count?: number;
}

const rankStyles = [
  'linear-gradient(135deg, #fbbf24, #f59e0b)',
  'linear-gradient(135deg, #9ca3af, #6b7280)',
  'linear-gradient(135deg, #d97706, #b45309)',
  '#e5e7eb',
];

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const TopCourses: React.FC = () => {
  const navigate = useNavigate();

  const { data: coursesRaw, isLoading } = useQuery({
    queryKey: ['manager', 'courses', 'top'],
    queryFn: () => courseApi.getAll({ page_size: 20 }).then(r => r.data),
  });

  const courses = (coursesRaw as PaginatedResponse<CourseResult> | undefined)?.results ?? [];

  // Sort by enrollment_count descending, take top 4
  const coursesData = [...courses]
    .sort((a, b) => (b.enrollment_count || 0) - (a.enrollment_count || 0))
    .slice(0, 4)
    .map((c, i) => ({
      rank: i + 1,
      rankBg: rankStyles[i] || '#e5e7eb',
      name: c.title,
      enrolled: c.enrollment_count || 0,
      rating: c.rating || 0,
    }));

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrophyIcon sx={{ color: '#ffa424', fontSize: 20 }} />
          <Typography fontWeight={700}>Top Courses</Typography>
        </Box>
        <Chip label="View All" size="small" clickable
          onClick={() => navigate('/manager/courses')}
          sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(255,164,36,0.08)', color: '#ffa424',
            '&:hover': { bgcolor: 'rgba(255,164,36,0.15)' } }} />
      </Box>

      {isLoading ? (
        [0, 1, 2, 3].map(i => (
          <Box key={i} sx={{ p: 2, px: 3, borderBottom: i < 3 ? 1 : 0, borderColor: 'divider' }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        ))
      ) : coursesData.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">No courses yet</Typography>
        </Box>
      ) : (
        coursesData.map((course, i) => (
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
        ))
      )}
    </Paper>
  );
};

export default TopCourses;
