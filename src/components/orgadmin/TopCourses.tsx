import React from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { MenuBook as MenuBookIcon } from '@mui/icons-material';

interface TopCourse {
  id: number;
  title: string;
  enrolled_count: number;
  completion_rate?: number;
}

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const TopCourses: React.FC = () => {
  const isLoading = false;
  const courses: TopCourse[] = [];

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        <MenuBookIcon sx={{ color: '#ffa424', fontSize: 20 }} />
        <Typography fontWeight={700}>Top Courses</Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ p: 2 }}>
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton width="70%" height={20} />
              <Skeleton width="40%" height={16} />
            </Box>
          ))}
        </Box>
      ) : courses.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Course analytics coming soon
          </Typography>
        </Box>
      ) : (
        courses.slice(0, 5).map((course, i) => (
          <Box
            key={course.id}
            sx={{
              p: 2,
              px: 3,
              borderBottom: i < courses.length - 1 ? 1 : 0,
              borderColor: 'divider',
              '&:hover': { bgcolor: 'rgba(255,164,36,0.02)' },
            }}
          >
            <Typography variant="body2" fontWeight={600} noWrap sx={{ mb: 0.5 }}>
              {course.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {course.enrolled_count} enrolled
              </Typography>
              {course.completion_rate !== undefined && (
                <>
                  <Box
                    sx={{
                      flex: 1,
                      height: 4,
                      bgcolor: 'grey.200',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${course.completion_rate}%`,
                        height: '100%',
                        bgcolor: '#10b981',
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {course.completion_rate}%
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        ))
      )}
    </Paper>
  );
};

export default TopCourses;