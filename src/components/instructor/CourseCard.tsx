import React from 'react';
import { Box, Typography, Paper, Button, LinearProgress } from '@mui/material';
import { Code as CodeIcon, Edit as EditIcon, BarChart as AnalyticsIcon } from '@mui/icons-material';

interface CourseCardProps {
  title: string;
  category: string;
  learners: number;
  rating: number;
  progress: number;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  category,
  learners,
  rating,
  progress,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Course Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
        <Typography variant="subtitle1" fontWeight={600} color="text.primary" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
          <CodeIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption">{category}</Typography>
        </Box>
      </Box>

      {/* Course Body */}
      <Box sx={{ p: 2 }}>
        {/* Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              {learners}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Learners
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              {rating}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rating
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              {progress}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            mb: 2,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: 'linear-gradient(90deg, #ffb74d, #ffa424)',
            },
          }}
        />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            sx={{
              flex: 1,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.75rem',
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'grey.50' },
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AnalyticsIcon />}
            sx={{
              flex: 1,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.75rem',
              bgcolor: 'primary.dark',
              '&:hover': { bgcolor: 'primary.main' },
            }}
          >
            Analytics
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CourseCard;
